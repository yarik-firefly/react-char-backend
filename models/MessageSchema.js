import { Schema, model } from "mongoose";

const MessageSchema = new Schema(
  {
    partner: String,
    text: { type: String, require: true },
    dialog: { type: Schema.Types.ObjectId, ref: "Dialog", require: true },
    user: { type: Schema.Types.ObjectId, ref: "User", require: true },
    readed: { type: Boolean, default: false },
    attachments: [{ type: Schema.Types.ObjectId, ref: "Upload" }],
  },
  { timestamps: true, usePushEach: true }
);

export const MessageModel = model("Message", MessageSchema);
