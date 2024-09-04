import mongoose, { Schema, Document } from "mongoose";

interface IItem extends Document {
  name: string;
  price: number;
  category: string;
  stock: number;
}

const ItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model<IItem>("Product", ItemSchema);

export default Item;
