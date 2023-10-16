import bcrypt from "bcryptjs";

export const createToken = (req, res, next) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      throw new Error(err);
    }

    bcrypt.hash(
      req.body.password + process.env.SECRET_KEY,
      salt,
      (err, hash) => {
        if (err) {
          throw new Error(err);
        }

        req.body.password = hash;

        next();
      }
    );
  });
};
