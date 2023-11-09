const validateUsername = (username) => {
  return username.length === 0 ? "Nome de usuário é requerido" : "";
};

const validatePassword = (password) => {
  return password.length === 0 ? "Senha é requerida" : "";
};

const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  const usernameError = validateUsername(username);
  const passwordError = validatePassword(password);
  const isValid = usernameError === "" && passwordError === "";

  if (isValid) {
    next();
  } else {
    res.status(418).json({
      user: null,
      errors: {
        usernameError,
        passwordError,
      },
    });
  }
};

export default validateLogin;
