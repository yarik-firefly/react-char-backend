import { Server } from "socket.io";
import { UserModel } from "../models/UserSchema.js";

export default (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_PART || "http://localhost:3000",
      methods: ["GET", "POST"],
      credential: true,
    },
  });

  const onlineUsers = {};

  io.on("connection", (socket) => {
    console.log("CONNECTED");
    socket.emit("test command", "Hello Pidorasi");

    socket.on("DIALOG:TYPING", (obj) => {
      socket.to(obj.currentDialogId).emit("DIALOG:TYPING", obj);
    });

    socket.on("DIALOG:JOIN", (dialogId) => {
      socket.dialogId = dialogId;
      socket.join(dialogId);
      console.log(dialogId);
    });

    socket.on("CLIENT:ONLINE", async (data) => {
      onlineUsers[socket._id] = data.userId;
      const doc = await UserModel.findOneAndUpdate(
        {
          _id: data.userId,
        },
        { isOnline: true },
        { upsert: true }
      );

      console.log("ONLINE");

      socket.emit("CLIENT:ONLINE", "Online");
    });

    socket.on("disconnect", () => {
      const oflineUserId = onlineUsers[socket._id];
      UserModel.findOneAndUpdate(
        {
          _id: oflineUserId,
        },
        { isOnline: false },
        { upsert: true }
      ).then(() => {
        console.log("OFFLINE");
      });
    });
  });

  return io;
};
