import mongoose from 'mongoose';
require('dotenv').config();
const { MONGO_URI } = process.env;
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI || '');
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
};
export {
    connectDB,
    mongoose
}