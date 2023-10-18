import { DialogModel } from "../models/DialogSchema.js";
import { MessageModel } from "../models/MessageSchema.js";

class DialogsController {
  constructor(io) {
    this.io = io;
  }

  index = async (req, res) => {
    const userId = req.user;

    const dialog = await DialogModel.find()
      .or([{ author: userId }, { partner: userId }])
      .populate(["author", "partner"])
      .populate({
        path: "last_message",
        populate: {
          path: "user",
        },
      })
      .exec();

    if (dialog) {
      return res.status(200).json({
        status: "success",
        data: dialog,
      });
    }

    res.json({
      status: "error",
      message: "Не удалось найти диалог!",
    });
  };

  create = async (req, res) => {
    try {
      const data = {
        author: req.user,
        partner: req.body.partner,
      };

      if (data) {
        const dialog = await DialogModel.create(data);
        if (dialog) {
          const message = {
            text: req.body.text,
            user: data.author,
            dialog: dialog._id,
          };

          const newMessage = await MessageModel.create(message);

          dialog.last_message = newMessage._id;
          return dialog
            .save()
            .then(() => {
              res.status(200).json({
                status: "success",
                dialog,
              });

              this.io.emit("SERVER:DIALOG_CREATED", {
                ...data,
                dialog,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }

      res.status(500).json({
        status: "error",
        message: "Не удалось созадть диалог",
      });
    } catch (error) {
      res.json({
        status: "error",
        error,
      });
    }
  };
}

export default DialogsController;
