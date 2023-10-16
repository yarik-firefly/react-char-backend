import { DialogModel } from "../models/DialogSchema.js";
import { MessageModel } from "../models/MessageSchema.js";

class MessageController {
  constructor(io) {
    this.io = io;
  }

  index = async (req, res) => {
    const dialogId = req.query.dialog;
    const userId = req.user;

    const dialog = await MessageModel.find({ dialog: dialogId })
      .populate(["dialog", "attachments"])
      .exec();

    await MessageModel.updateMany(
      { dialog: dialogId, user: { $ne: userId } },
      { $set: { readed: true } }
    );

    if (dialog) {
      return res.status(200).json({
        dialogId,
        data: dialog,
      });
    }

    return res.json({
      message: "Диалог не найден",
    });
  };

  create = async (req, res) => {
    const userId = req.user;
    const data = {
      text: req.body.text,
      dialog: req.body.dialogId,
      user: userId,
      attachments: req.body.attachments,
    };

    if (data) {
      const message = await MessageModel.create(data);

      await DialogModel.findByIdAndUpdate(
        { _id: data.dialog },
        { last_message: message._id },
        { upsert: true }
      );

      res.status(200).json({
        status: "success",
        data: await message.populate(["dialog", "attachments"]),
      });

      return this.io.emit("SERVER:NEW_MESSAGE", message);
    }

    res.json({
      status: "error",
      message: "Не удалось создать сообщение",
    });
  };

  delete = async (req, res) => {
    const authorId = req.user;
    const messageId = req.query.id;

    if (authorId && messageId) {
      const message = await MessageModel.findById({ _id: messageId });

      if (message && message.user.toString() === authorId) {
        message.deleteOne();

        const dialogId = message.dialog;

        const lastMessage = await MessageModel.findOne(
          { dialog: dialogId },
          {},
          { sort: { created_at: -1 } }
        );

        console.log(lastMessage);

        const dialog = await DialogModel.findById({ _id: dialogId });

        dialog.last_message = lastMessage._id;
        dialog.save();

        return res.json({
          message: "Message deleted",
        });
      }

      return res.status(200).json({
        message: "Вы не являетесь автором сообщения!",
      });
    }

    res.json({
      message: "You don't authorized",
    });
  };
}

export default MessageController;
