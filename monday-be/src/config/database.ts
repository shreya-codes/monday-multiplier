import mongoose, { ConnectOptions } from 'mongoose';

const database = process.env.MONGODB_URI as string;
const connectToDatabase = async () => {
  try {
    mongoose.set('strictQuery', true);
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(database, options as ConnectOptions);
    console.log('Connected to database!\n');
  } catch (error) {
    console.log(error);
  }
};

export default connectToDatabase;
