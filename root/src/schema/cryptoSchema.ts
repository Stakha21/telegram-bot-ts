import mongoose from 'mongoose';
import User from '../interfaces/database-interface';

const userSchema = new mongoose.Schema<User>({
    userName: { type: String, required: true },
    cryptos: { type: [String], required: true },
});

const userModel = mongoose.model<User>('user', userSchema);

export { userModel };
