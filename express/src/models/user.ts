import mongoose from "mongoose";

export interface IUser {
  email: string;
  password: string; // hashed
  // optionally you could store a list of valid refresh tokens or tokens identifiers
  refreshTokens?: string[];
}

const userSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshTokens: { type: [String], default: [] },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
