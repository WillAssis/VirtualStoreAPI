import express from "express";
import { deletePedido, getAllPedidos, getPedidosFromClient, insertPedido } from "../controller/pedidoController.js";
import { getAllProdutosFromPedido, updatePedido } from "../controller/produtoPedidoController.js";

const router = express.Router();

router.get("/pedido", async (req, res) => {
    const pedidos = await getAllPedidos();

    res.send(pedidos);
});

router.post("/pedido", async (req, res) => {
    const { pedido } = req.body;

    try {
        let result = await insertPedido(pedido);
        res.status(201).send({ id: result.lastID, ...pedido });
    } catch (e) {
        res.status(e.statusCode || 400).send(e.message);
    }
});

router.get("/pedido/:pedidoId", async (req, res) => {
    const { pedidoId } = req.params;
    const produtos = await getAllProdutosFromPedido(pedidoId);

    if (!produtos.length) {
        res.status(204).send();
    } else {
        res.send(produtos);
    }
});

router.get("/pedido/cliente/:clienteId", async (req, res) => {
    const { clienteId } = req.params;
    try {
        const pedidos = await getPedidosFromClient(clienteId);
        res.send(pedidos);
    } catch (e) {
        res.status(e.statusCode || 400).send(e.message);
    }
});

router.put("/pedido/:pedidoId", async (req, res) => {
    const { pedidoId } = req.params;
    const { produtos } = req.body;

    await updatePedido(pedidoId, produtos);

    res.send("Pedido atualizado");
});

router.delete("/pedido/:pedidoId", async (req, res) => {
    const { pedidoId } = req.params;
    await deletePedido(pedidoId);

    res.send("Pedido removido!");
});

export default router;