import mongoose from 'mongoose';
import logger from '@utils/logger';
import { BaseError } from '@utils/baseError';

type DatabaseType = 'mongodb';

const getDatabaseType = (): DatabaseType => {
  const mongoURI = process.env.MONGODB_URI as string;
  if (mongoURI) return 'mongodb';
  throw new BaseError(
    'No database configuration found in environment variables',
    'DB_CONFIG_MISSING',
    500
  );
};

const connectToDatabase = async () => {
  const dbType = getDatabaseType();

  try {
    logger.info(`Attempting to connect to ${dbType} database...`);
    
    switch (dbType) {
      case 'mongodb':
        await connectMongoDB();
        break;
    }
    
    logger.info(`Successfully connected to ${dbType} database`);
  } catch (error) {
    if (error instanceof BaseError) {
      logger.error('Database configuration error:', {
        code: error.code,
        message: error.message,
        details: error.details
      });
    } else {
      logger.error('Unexpected database connection error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
    }
    throw error;
  }
};

const connectMongoDB = async () => {
  const uri = process.env.MONGODB_URI as string;
  
  if (!uri) {
    throw new BaseError(
      'MongoDB URI is not defined in environment variables',
      'MONGODB_URI_MISSING',
      500
    );
  }

  try {
    mongoose.set('strictQuery', true);
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: process.env.MONGODB_USER,
      pass: process.env.MONGODB_PASSWORD,
    };

    await mongoose.connect(uri, options);
    
    // Set up event listeners for MongoDB connection
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', {
        error: err.message,
        stack: err.stack
      });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected successfully');
    });

  } catch (error) {
    throw new BaseError(
      'Failed to connect to MongoDB',
      'MONGODB_CONNECTION_FAILED',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

export default connectToDatabase;
