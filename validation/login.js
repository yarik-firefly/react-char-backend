import validator from "express-validator";

export const loginValidations = [
  validator
    .body("email", "Введите почту")
    .isEmail()
    .isString()
    .isLength({ min: 8, max: 40 }),

  validator
    .body("password", "Минимальная длина пароля 8 символов")
    .isLength({ min: 8 }),
];
