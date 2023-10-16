import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import UserCtrl from "./controllers/UserController.js";
import cors from "cors";
import { registerValidations } from "./validation/register.js";
import DialogsCtrl from "./controllers/DialogsController.js";
import MessageCtrl from "./controllers/MessageController.js";
import { UpdateSeen } from "./middleware/UpdateSeen.js";
import { createToken } from "./utils/CreateToken.js";
import { checkAuth } from "./utils/checkAuth.js";
import { loginValidations } from "./validation/login.js";
import validatorErrors from "./validation/validatorErrors.js";
import { createServer } from "node:http";
import socket from "./core/socket.js";
import UploadController from "./controllers/UploadController.js";
import multer from "multer";

const app = express();
const server = createServer(app);
const io = socket(server);

const UserController = new UserCtrl(io);
const DialogsController = new DialogsCtrl(io);
const MessageController = new MessageCtrl(io);

const UploadControler = new UploadController();

mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connect!");
  });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
// app.use(checkAuth);
app.use(UpdateSeen);
app.use(validatorErrors);

app.get("/", (req, res) => {
  res.send("Hello Nigga :)");
});

app.get("/auth/me", checkAuth, UserController.authMe);
app.get("/user/verify", UserController.verify);

app.post("/register", registerValidations, UserController.create);
app.post("/login", loginValidations, UserController.login);

app.get("/user/find", checkAuth, UserController.findUsers);
app.get("/user/:id", checkAuth, UserController.index);

app.get("/dialogs", checkAuth, DialogsController.index);
app.post("/dialogs", checkAuth, DialogsController.create);

app.get("/messages", checkAuth, MessageController.index);
app.post("/messages", checkAuth, MessageController.create);
app.delete("/messages", checkAuth, MessageController.delete);

app.post("/files", checkAuth, upload.single("file"), UploadControler.create);
// app.delete("/files", checkAuth, UploadControler.delete);

server.listen(process.env.PORT || 4444, () => {
  console.log("Server Start!");
});
