import { Schema, model, Types } from 'mongoose';

const RefreshTokenSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },
    isRevoked: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true },
);

RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenModel = model('RefreshToken', RefreshTokenSchema);
