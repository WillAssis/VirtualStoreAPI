import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import { createTable } from "./controller/clienteController.js";
import clientRoute from "./routes/clientRoute.js";
import { createProductTable } from "./controller/produtoController.js";
import productRouter from "./routes/productRoute.js";
import {
  createPedidoTable,
  deletePedido,
  getAllPedidos,
  getPedidosFromClient,
  insertPedido,
} from "./controller/pedidoController.js";
import {
  createProdutoPedidoTable,
  getAllProdutosFromPedido,
  updatePedido,
} from "./controller/produtoPedidoController.js";

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
    productRouter
  ]

  for (const router of routers) {
    app.use(router);
  }

  // Usado pelas tags <img> no HTML para mostrar as imagens salvas
  app.use("/images", express.static("src/public/images"));
}

async function configureMongoose() {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:admin@cluster0.1bfhxjk.mongodb.net/?retryWrites=true&w=majority"
    );
  } catch (err) {
    console.log(err);
  }
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

app.get("/pedido", async (req, res) => {
  const pedidos = await getAllPedidos();

  res.send(pedidos);
});

app.post("/pedido", async (req, res) => {
  const { pedido } = req.body;

  try {
    let result = await insertPedido(pedido);
    res.status(201).send({ id: result.lastID, ...pedido });
  } catch (e) {
    res.status(e.statusCode || 400).send(e.message);
  }
});

app.get("/pedido/:pedidoId", async (req, res) => {
  const { pedidoId } = req.params;
  const produtos = await getAllProdutosFromPedido(pedidoId);

  if (!produtos.length) {
    res.status(204).send();
  } else {
    res.send(produtos);
  }
});

app.get("/pedido/cliente/:clienteId", async (req, res) => {
  const { clienteId } = req.params;
  try {
    const pedidos = await getPedidosFromClient(clienteId);
    res.send(pedidos);
  } catch (e) {
    res.status(e.statusCode || 400).send(e.message);
  }
});

app.put("/pedido/:pedidoId", async (req, res) => {
  const { pedidoId } = req.params;
  const { produtos } = req.body;

  await updatePedido(pedidoId, produtos);

  res.send("Pedido atualizado");
});

app.delete("/pedido/:pedidoId", async (req, res) => {
  const { pedidoId } = req.params;
  await deletePedido(pedidoId);

  res.send("Pedido removido!");
});

app.listen(3333, () => console.log("http://localhost:3333"));
