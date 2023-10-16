import { UserModel } from "../models/UserSchema.js";

export const UpdateSeen = (req, __, next) => {
  const userId = req.user;
  if (userId) {
    try {
      UserModel.findOneAndUpdate(
        {
          _id: userId,
        },
        { last_seen: new Date() },
        { new: true }
      );
    } catch (error) {
      console.log(error);
    }
  }

  next();
};
