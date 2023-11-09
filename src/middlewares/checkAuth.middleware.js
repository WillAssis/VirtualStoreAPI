import jwt from "jsonwebtoken";

const secret = "8fbgj396378t3h53t893";

// Verifica se o user é admin para prosseguir com a requisição
const checkAuth = (req, res, next) => {
  const { token } = req.cookies;
  let isAdmin = false;

  if (token) {
    jwt.verify(token, secret, {}, (error, user) => {
      if (error) throw error;
      isAdmin = user.isAdmin;
    });
  }

  if (isAdmin) {
    next();
  } else {
    res.status(401).json({ message: "Sem permissão" });
  }
};

export default checkAuth;
