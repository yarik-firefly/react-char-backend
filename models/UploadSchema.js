import { Schema, model } from "mongoose";

const UploadSchema = new Schema(
  {
    url: String,
    size: Number,
    filename: String,
    ext: String,
    message: { type: Schema.Types.ObjectId, ref: "Message", require: true },
    user: { type: Schema.Types.ObjectId, ref: "User", require: true },
  },
  { timestamps: true }
);

export const UploadModel = model("Upload", UploadSchema);
