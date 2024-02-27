import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import { createTable } from "./controller/clienteController.js";
import clientRoute from "./routes/clientRoute.js";
import { createProductTable } from "./controller/produtoController.js";
import productRouter from "./routes/productRoute.js";
import { createPedidoTable } from "./controller/pedidoController.js";
import { createProdutoPedidoTable } from "./controller/produtoPedidoController.js";
import produtoPedidoRouter from "./routes/pedidoRoute.js";

const app = express();

function configureApp() {
  app.use(express.json());
  app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
    allowedHeaders: ['Content-Type']
  }))
  app.use(cookieParser());
  const routers = [
    userRouter,
    clientRoute,
    productRouter,
    produtoPedidoRouter
  ]

  for (const router of routers) {
    app.use(router);
  }

  // Usado pelas tags <img> no HTML para mostrar as imagens salvas
  app.use("/images", express.static("src/public/images"));
}

async function configureMongoose() {
  await mongoose.connect(
    "mongodb+srv://admin:admin@cluster0.1bfhxjk.mongodb.net/?retryWrites=true&w=majority"
  );
}

async function createAllTables() {
  Promise.all([createTable(), createProductTable(), createPedidoTable(), createProdutoPedidoTable()]);
}

configureApp();
await configureMongoose();
await createAllTables();

app.get("/", (req, res) => {
  res.send("Bem vindo ao nosso Projeto :)");
});

app.listen(3333, () => console.log("http://localhost:3333"));
