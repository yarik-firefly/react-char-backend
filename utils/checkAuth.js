import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  try {
    if (!token) {
      return res.status(401).json({
        message: "Вы не авторизованы!",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded._id;

    next();
  } catch (err) {
    res.json({
      err: err,
    });
  }
};
