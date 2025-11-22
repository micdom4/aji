import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

export const UserModel = mongoose.model('User', userSchema);
