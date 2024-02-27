import express from "express";
import { deleteClient, getAllClients, getClient, insertClient, updateClient } from "../controller/clienteController";

const router = express.Router();

router.get("/cliente", async (req, res) => {
    const clients = await getAllClients();
    res.send(clients);
});

router.get("/cliente/:id", async (req, res) => {
    const result = await getClient(req.params.id);
    if (!result) {
        res.status(204).send();
    }
    if (result) {
        res.status(200).send(result);
    }
});

router.post("/cliente", async (req, res) => {
    const { cliente } = req.body;
    const result = await insertClient(cliente);
    res.status(201).send({
        id: result.lastID,
        ...cliente,
    });
});

router.put("/cliente/:id", async (req, res) => {
    const clienteAtual = await getClient(req.params.id);
    if (clienteAtual) {
        await updateClient(req.body);
        res.status(200).send({
            id: req.params.id,
            ...req.body,
        });
    } else {
        res.status(400).send("Usuário não encontrado");
    }
});

router.delete("/cliente/:id", async (req, res) => {
    const clienteAtual = await getClient(req.params.id);
    console.log(clienteAtual);
    if (clienteAtual) {
        await deleteClient(req.params.id);
        res.status(200).send("Usuário deletado");
    } else {
        res.status(204).send();
    }
});

export default router;