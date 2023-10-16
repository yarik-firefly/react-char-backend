import jwt from "jsonwebtoken";

export default (token) => {
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (err || !decodedToken) {
        return reject(err);
      }

      resolve(decodedToken);
    });
  });
};
