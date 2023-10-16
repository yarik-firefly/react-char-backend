import { UserModel } from "../models/UserSchema.js";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

class UserController {
  constructor(io) {
    this.io = io;
  }

  index = async (req, res) => {
    try {
      const id = req.params.id;

      const user = await UserModel.findById(id);

      if (user) {
        return res.status(200).json({
          status: "success",
          data: user,
        });
      }

      res.json({
        status: " error",
        message: "Пользователь не найден",
      });
    } catch (error) {
      res.json({
        status: "error",
        message: "Произошла ошибка",
      });
    }
  };

  findUsers = async (req, res) => {
    const info = req.query.query;

    const user = await UserModel.find().or([
      { fullname: new RegExp(info, "i") },
      { email: new RegExp(info, "i") },
    ]);

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не анйден",
      });
    }

    res.json({
      user,
    });
  };

  create = async (req, res) => {
    try {
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password + process.env.SECRET_KEY, salt);
      const confirm_hash = await bcrypt.hash(
        req.body.email + process.env.SECRET_KEY,
        salt
      );

      const userData = {
        email: req.body.email,
        fullname: req.body.fullname,
        password: hash,
        confirm_hash,
      };

      const user = await UserModel.create(userData);

      sendEmail({
        emailFrom: process.env.MY_MAIL,
        emailTo: userData.email,
        subject: "😎Подтверждение Почты Для Офигенного React-Chat 😎",
        html: `Для того, чтобы подтвердить почту, перейдите на <a href='${
          process.env.REACT_APP_VERIFY_URL || "http://localhost:4444"
        }user/verify?hash=${userData.confirm_hash}'>по этой ссылке</a>`,
      });

      const { password: passwordHash, ...data } = user._doc;

      res.status(200).json({
        status: "success",
        data,
      });
    } catch (error) {
      res.json({
        status: "error",
      });
    }
  };

  delete = async (req, res) => {
    try {
      const user = await UserModel.create(userData);

      res.status(200).json({
        status: "success",
        data: user,
      });
    } catch (error) {
      res.json({
        status: "error",
      });
    }
  };

  login = async (req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.body.email });

      if (!user) {
        return res.status(404).json({
          message: "User Not Found",
        });
      }

      const isValidPass = await bcrypt.compare(
        req.body.password + process.env.SECRET_KEY,
        user.password
      );

      if (!isValidPass) {
        return res.status(404).json({
          status: "error",
          message: "Неверный логин или пароль!",
        });
      }

      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "30d",
        }
      );

      const { password, ...userData } = user._doc;
      res.json({ ...userData, token });
    } catch (error) {
      console.log(error);
    }
  };

  authMe = async (req, res) => {
    const userId = req.user;

    if (!userId) {
      return res.status(401).json({
        message: "Вы не авторизованы",
      });
    }

    const me = await UserModel.findById(userId);

    const { password, ...userData } = me._doc;
    console.log(userData.last_seen);

    res.status(200).json({
      status: "success",
      data: userData,
    });
  };

  verify = async (req, res) => {
    const hash = req.query.hash;
    if (!hash) {
      return res.status(403).json({
        status: "error",
        message: "Хэш недействителен или его не существует",
      });
    }

    const user = await UserModel.findOne({ confirm_hash: hash });

    if (!user) {
      return res.status(403).json({
        status: "error",
        message: "Пользователь не найден",
      });
    }

    user.confirmed = true;
    user.save();

    res.json({
      status: "success",
      message: "Верификация прошла успешно",
    });
  };
}

export default UserController;
