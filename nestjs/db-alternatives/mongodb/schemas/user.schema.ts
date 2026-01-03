import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    refreshTokens: [{ type: String }],
  },
  { timestamps: true },
);

export const UserModel = model('User', UserSchema);
