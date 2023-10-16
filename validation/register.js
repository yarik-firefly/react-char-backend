import validator from "express-validator";

export const registerValidations = [
  validator
    .body("email", "Введите почту")
    .isEmail()
    .isString()
    .isLength({ min: 8, max: 40 }),

  validator
    .body("fullname", "Ввведите имя")
    .isString()
    .isLength({ min: 2, max: 25 }),
  validator
    .body("password", "")
    .isLength({ min: 8 })
    .custom((value, { req }) => {
      if (value !== req.body.password2) {
        throw new Error("Пароли не совпадают");
      } else {
        return value;
      }
    }),
];
