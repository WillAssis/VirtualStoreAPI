import express from "express";
import { login, register } from "../controller/user.controller.js";
import validateRegister from "../middlewares/validateRegister.middleware.js";
import validateLogin from "../middlewares/validateLogin.middleware.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const secret = "8fbgj396378t3h53t893";

router.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, secret, {}, (err, data) => {
      if (err) throw err;
      res.json({ user: { username: data.username, isAdmin: data.isAdmin } });
    });
  } else {
    res.json({ user: null });
  }
});

router.post("/login", validateLogin, login);

router.post("/cadastro", validateRegister, register);

router.post("/logout", (req, res) => {
  res.clearCookie("token").end();
});

export default router;
