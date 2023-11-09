const validateUsername = (username) => {
  return username.length === 0 ? "Nome de usuário é requerido" : "";
};

const validatePassword = (password) => {
  return password.length === 0 ? "Senha é requerida" : "";
};

const validateEmail = (email) => {
  const pattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const isValid = pattern.test(email);

  if (email.length === 0) {
    return "Email é requerido";
  } else if (!isValid) {
    return "Email inválido. exemplo de email válido: sujeito@gmail.com";
  }

  return "";
};

const validateRegister = async (req, res, next) => {
  const { username, password, email } = req.body;
  const usernameError = validateUsername(username);
  const passwordError = validatePassword(password);
  const emailError = validateEmail(email);
  const isValid =
    usernameError === "" && emailError === "" && passwordError === "";

  if (isValid) {
    next();
  } else {
    res.status(418).json({
      user: null,
      errors: {
        usernameError,
        passwordError,
        emailError,
      },
    });
  }
};

export default validateRegister;
