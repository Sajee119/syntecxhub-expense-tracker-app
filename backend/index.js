import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDB, isMongoConnected, mongoose } from './config/db.js';
import authRouter from './routers/AuthRouter.js';
import expenseRouter from './routers/Expense.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DB_HEALTH_CHECK_INTERVAL_MS = 5 * 60 * 1000;
const PORT_HEALTH_CHECK_INTERVAL_MS = 60 * 1000;
const CONSOLE_CLEAR_INTERVAL_MS = 10 * 60 * 1000;
const MAX_STARTUP_ATTEMPTS = 5;
let server;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const retryOperation = async (operation, { maxAttempts = Infinity, baseDelayMs = 2000, maxDelayMs = 30000, label = 'operation' } = {}) => {
    let attempt = 0;

    while (attempt < maxAttempts) {
        attempt += 1;
        const success = await operation();

        if (success) {
            return true;
        }

        const delay = Math.min(baseDelayMs * (2 ** (attempt - 1)), maxDelayMs);
        console.warn(`${label} attempt ${attempt} failed. Retrying in ${Math.round(delay / 1000)}s...`);
        await wait(delay);
    }

    return false;
};

app.use(bodyParser.json());
app.use(cors());

app.use('/api/users', authRouter);
app.use('/api/expenses', expenseRouter);

const startListening = async () => {
    if (server?.listening) {
        return true;
    }

    return new Promise((resolve) => {
        const nextServer = app.listen(PORT, () => {
            server = nextServer;
            console.log(`Server is running on http://localhost:${PORT}`);
            resolve(true);
        });

        nextServer.on('close', () => {
            if (server === nextServer) {
                server = undefined;
            }
            console.warn('HTTP server closed. Health monitor will attempt restart.');
        });

        nextServer.on('error', (error) => {
            console.error('HTTP server failed to start:', error.message);
            nextServer.close(() => resolve(false));
        });
    });
};

const ensureDatabaseConnection = async () => {
    if (isMongoConnected()) {
        return true;
    }

    console.warn('MongoDB is disconnected. Trying to reconnect...');
    return retryOperation(connectDB, { maxAttempts: 3, baseDelayMs: 2000, maxDelayMs: 10000, label: 'MongoDB reconnect' });
};

const ensurePortListener = async () => {
    if (server?.listening) {
        return true;
    }

    console.warn(`Port ${PORT} listener is down. Trying to restart server...`);
    return retryOperation(startListening, { maxAttempts: 3, baseDelayMs: 2000, maxDelayMs: 10000, label: 'HTTP listener restart' });
};

const startHealthMonitors = () => {
    setInterval(async () => {
        await ensureDatabaseConnection();
    }, DB_HEALTH_CHECK_INTERVAL_MS);

    setInterval(async () => {
        await ensurePortListener();
    }, PORT_HEALTH_CHECK_INTERVAL_MS);

    setInterval(() => {
        console.clear();
        console.log(`[${new Date().toISOString()}] Console auto-cleared`);
    }, CONSOLE_CLEAR_INTERVAL_MS);
};

const registerProcessHandlers = () => {
    mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected event received.');
    });

    mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected.');
    });

    process.on('unhandledRejection', async (error) => {
        console.error('Unhandled promise rejection:', error);
        await ensureDatabaseConnection();
        await ensurePortListener();
    });

    process.on('uncaughtException', async (error) => {
        console.error('Uncaught exception:', error);
        await ensureDatabaseConnection();
        await ensurePortListener();
    });
};

const startServer = async () => {
    const dbReady = await retryOperation(connectDB, {
        maxAttempts: MAX_STARTUP_ATTEMPTS,
        baseDelayMs: 2000,
        maxDelayMs: 15000,
        label: 'MongoDB startup connection'
    });

    if (!dbReady) {
        console.error('Startup failed: unable to connect to MongoDB after retries.');
    }

    console.log(process.env.APP_NAME);
    const serverReady = await retryOperation(startListening, {
        maxAttempts: MAX_STARTUP_ATTEMPTS,
        baseDelayMs: 2000,
        maxDelayMs: 15000,
        label: 'HTTP listener startup'
    });

    if (!serverReady) {
        console.error(`Startup failed: unable to bind to port ${PORT} after retries.`);
    }

    registerProcessHandlers();
    startHealthMonitors();
};

startServer();