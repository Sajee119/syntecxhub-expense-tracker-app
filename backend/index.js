import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRouter from './routers/AuthRouter.js';
import expenseRouter from './routers/Expense.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.use('/api/users', authRouter);
app.use('/api/expenses', expenseRouter);

const startServer = async () => {
    await connectDB();
    console.log(process.env.APP_NAME);
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startServer();