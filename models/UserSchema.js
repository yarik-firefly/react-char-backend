import { Schema, model } from "mongoose";
import { differenceInMinutes } from "date-fns";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    avatar: String,
    fullname: { type: String, required: true },
    password: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
    confirm_hash: String,
    last_seen: { type: Date, default: new Date() },
    isOnline: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.set("toJSON", {
  virtuals: true,
});

// UserSchema.virtual("isOnline");

// .get(function () {
//   return differenceInMinutes(new Date(), this.last_seen) < 5;
// });

export const UserModel = model("User", UserSchema);
