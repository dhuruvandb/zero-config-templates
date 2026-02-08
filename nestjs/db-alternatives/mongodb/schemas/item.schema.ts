import { Schema, model, Types } from 'mongoose';

const ItemSchema = new Schema(
  {
    name: { type: String, required: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

ItemSchema.index({ userId: 1 });

export const ItemModel = model('Item', ItemSchema);
