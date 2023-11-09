import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import imageUpload from "./middlewares/imageUpload.js";
import URLQueryHandler from "./middlewares/URLQueryHandler.js";
import productFormHandler from "./middlewares/productFormHandler.js";
import {
  createTable,
  deleteClient,
  getAllClients,
  getClient,
  insertClient,
  updateClient,
} from "./controller/clienteController.js";
import {
  getFeaturedProdutos,
  countProdutos,
  createProductTable,
  deleteProduto,
  getProdutos,
  getProduto,
  insertProduto,
  updateProduto,
} from "./controller/produtoController.js";
import deleteImages from "./utils/deleteImage.js";
import formatProduct from "./utils/formatProduct.js";
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

mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.1bfhxjk.mongodb.net/?retryWrites=true&w=majority"
);

const app = express();

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
    allowedHeaders: ['Content-Type']
}))
app.use(cookieParser());
app.use(userRouter);

// Usado pelas tags <img> no HTML para mostrar as imagens salvas
app.use("/images", express.static("src/public/images"));

await createTable();
await createProductTable();
await createPedidoTable();
await createProdutoPedidoTable();

app.get("/", (req, res) => {
  res.send("Bem vindo ao nosso Projeto :)");
});

app.get("/cliente", async (req, res) => {
  const clients = await getAllClients();
  res.send(clients);
});

app.get("/cliente/:id", async (req, res) => {
  const result = await getClient(req.params.id);
  if (!result) {
    res.status(204).send();
  }
  if (result) {
    res.status(200).send(result);
  }
});

app.post("/cliente", async (req, res) => {
  const { cliente } = req.body;
  const result = await insertClient(cliente);
  res.status(201).send({
    id: result.lastID,
    ...cliente,
  });
});

app.put("/cliente/:id", async (req, res) => {
  const clienteAtual = await getClient(req.params.id);
  if (clienteAtual) {
    await updateClient(req.body);
    res.status(200).send({
      id: req.params.id,
      ...req.body,
    });
  } else {
    res.status(204).send();
  }
});

app.delete("/cliente/:id", async (req, res) => {
  const clienteAtual = await getClient(req.params.id);
  console.log(clienteAtual);
  if (clienteAtual) {
    await deleteClient(req.params.id);
    res.status(200).send("Usuário deletado");
  } else {
    res.status(204).send();
  }
});

/**
 * TODO:
 *      -> Fazer verificações relacionadas à segurança;
 *      -> Criar autenticação para as operações de post, put e delete.
 */

createProductTable();

// A quantidade de resultados é enviada para o front-end para facilitar a criação dos botões de paginação
app.get("/produtos", URLQueryHandler, async (req, res) => {
  try {
    const result = await getProdutos(req.query);
    const numberOfResults = await countProdutos(req.query);
    const produtos = result.map(formatProduct);
    if (produtos.length > 0) {
      res.send({
        products: produtos,
        results: numberOfResults.size,
        pages: Math.ceil(numberOfResults.size / req.query.pageSize),
        currentPage: req.query.page,
      });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.log(error);
    res.status(204).send();
  }
});

app.get("/produto/:slug", async (req, res) => {
  try {
    const result = await getProduto(req.params.slug);
    if (result) {
      const produto = formatProduct(result);
      res.status(200).send(produto);
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.log(error);
    res.status(204).send();
  }
});

app.get("/destaques", async (req, res) => {
  try {
    const result = await getFeaturedProdutos();
    const produtos = result.map(formatProduct);
    if (produtos.length > 0) {
      res.status(200).send(produtos);
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.log(error);
    res.status(204).send();
  }
});

app.post(
  "/novo-produto",
  imageUpload.array("images", 5),
  productFormHandler,
  async (req, res) => {
    try {
      const images = req.files.map((img) => img.filename);
      await insertProduto({ ...req.body, images: images });
      res.status(201).send("Produto criado");
    } catch (error) {
      console.log(error);
      res.status(204).send();
    }
  }
);

// TODO: testar o method put
app.put(
  "/produto/:slug",
  imageUpload.array("images", 5),
  productFormHandler,
  async (req, res) => {
    try {
      const produto = await getProduto(req.params.slug);
      if (produto) {
        const images = req.files.map((img) => img.filename);
        deleteImages(JSON.parse(produto));
        await updateProduto({ ...req.body, images: images });
        res.status(200).send("Produto atualizado");
      } else {
        res.status(204).send();
      }
    } catch (error) {
      console.log(error);
      res.status(204).send();
    }
  }
);

app.delete("/produto/:slug", async (req, res) => {
  try {
    const produto = await getProduto(req.params.slug);
    if (produto) {
      await deleteProduto(req.params.slug);
      deleteImages(JSON.parse(produto.images));
      res.status(200).send("Produto deletado");
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.log(error);
    res.status(204).send();
  }
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
