import User from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const secret = "8fbgj396378t3h53t893";
const saltRounds = 10;

const login = async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const matchPassword = userDoc
    ? bcrypt.compareSync(password, userDoc.password)
    : false;

  if (matchPassword) {
    const user = { id: userDoc._id, username, isAdmin: userDoc.isAdmin };

    jwt.sign(user, secret, {}, (error, token) => {
      if (error) throw error;
      res
        .status(201)
        .cookie("token", token)
        .json({
          user: { username, isAdmin: userDoc.isAdmin },
          errors: null,
        });
    });
  } else {
    res.status(418).json({
      user: null,
      errors: {
        usernameError: "Usuário não existe ou senha incorreta",
        passwordError: "Usuário não existe ou senha incorreta",
      },
    });
  }
};

const register = async (req, res) => {
  const { username, password, email } = req.body;
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    res.status(418).json({
      user: null,
      errors: {
        usernameError: "Nome de usuário já existe",
        passwordError: "",
        emailError: "",
      },
    });
  } else {
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const userDoc = await User.create({
      username,
      password: passwordHash,
      email,
    });
    const user = { id: userDoc._id, username, isAdmin: userDoc.isAdmin };

    jwt.sign(user, secret, {}, (error, token) => {
      if (error) throw error;
      res
        .status(201)
        .cookie("token", token)
        .json({
          user: { username, isAdmin: userDoc.isAdmin },
          errors: null,
        });
    });
  }
};

export { login, register };
