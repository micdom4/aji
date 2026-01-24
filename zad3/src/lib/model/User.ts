import mongoose from 'mongoose';

export enum UserRole {
  CLIENT = 'CLIENT',
  WORKER = 'WORKER'
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.CLIENT,
    required: true
  },
  refreshToken: {
    type: String
  }
}, { timestamps: true });

export const UserModel = mongoose.model.User || mongoose.model('User', userSchema);
