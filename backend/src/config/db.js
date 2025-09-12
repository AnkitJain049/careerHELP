import mongoose from 'mongoose';

export const connectToDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerhelp';
  const options = {
    autoIndex: true,
  };

  if (!process.env.MONGODB_URI) {
    // eslint-disable-next-line no-console
    console.warn('MONGODB_URI not set. Falling back to local mongodb://127.0.0.1:27017/careerhelp');
  }

  try {
    await mongoose.connect(mongoUri, options);
    // eslint-disable-next-line no-console
    console.log('Connected to MongoDB');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};

export default mongoose;

