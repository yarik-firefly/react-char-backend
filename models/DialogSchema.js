import mongoose, { Schema, model } from "mongoose";

const DialogSchema = new mongoose.Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
    partner: { type: Schema.Types.ObjectId, ref: "User" },
    last_message: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

export const DialogModel = model("Dialog", DialogSchema);
