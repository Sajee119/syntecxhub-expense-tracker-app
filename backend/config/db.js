import mongoose from 'mongoose';

const isMongoConnected = () => mongoose.connection.readyState === 1;

export const connectDB = async () => {
	try {
		if (!process.env.MONGO_URI) {
			throw new Error('MONGO_URI is not set');
		}

		if (isMongoConnected()) {
			return true;
		}

		await mongoose.connect(process.env.MONGO_URI);
		console.log('Connected to MongoDB');
		return true;
	} catch (error) {
		console.error('MongoDB connection failed:', error.message);
		return false;
	}
};

export { isMongoConnected, mongoose };
