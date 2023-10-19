import cloudinary from "../core/cloudinary.js";
import { UploadModel } from "../models/UploadSchema.js";
import { UserModel } from "../models/UserSchema.js";

class UploadController {
  constructor(io) {
    this.io = io;
  }

  create = async (req, res) => {
    try {
      const userId = req.user;
      const file = req.file;

      cloudinary.v2.uploader
        .upload_stream({ resource_type: "auto" }, async (error, result) => {
          if (error || !result) {
            return res.status(500).json({
              status: "error",
              message: error || "upload error",
            });
          }
          console.log(123);
          console.log(result);

          const postData = {
            url: result.url,
            size: file.size,
            filename: file.originalname.split(".")[0],
            ext: result.format,
            user: userId,
          };

          const fileObj = await UploadModel.create(postData);

          return res.json({
            data: fileObj,
          });
        })
        .end(file.buffer);
    } catch (error) {
      console.log(error);
    }
  };

  uploadAvatar = async (req, res) => {
    try {
      const userId = req.user;
      const file = req.file;
      console.log(file);
      // console.log(userId);
      cloudinary.v2.uploader
        .upload_stream({ resource_type: "auto" }, async (error, result) => {
          if (error || !result) {
            return res.status(500).json({
              status: "error",
              message: error || "upload error",
            });
          }

          const user = await UserModel.findById(userId);
          user.avatar = result.url;
          user.save();

          res.status(200).json({
            url: result.url,
          });

          return this.io.emit("CHANGE:AVATAR", result.url);
        })
        .end(file.buffer);
    } catch (error) {
      console.log(error);
    }
  };
}

export default UploadController;
