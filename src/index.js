// import { openDb } from './configDb.js';
import express from 'express';
import { createTable, deleteClient, getAllClients, getClient, insertClient, updateClient } from './controller/clienteController.js';
import { createProductTable, deleteProduto, getAllProdutos, getProduto, insertProduto, updateProduto } from './controller/produtoController.js';

const app = express();

app.use(express.json());

createTable();

app.get('/', (req, res) => {
    res.send('Bem vindo ao nosso Projeto :)');
});

app.get('/cliente', async (req, res) => {
    const clients = await getAllClients();
    res.send(clients);
});

app.get('/cliente/:id', async (req, res) => {
    const result = await getClient(req.params.id);
    res.status(200).send(result);
});

app.post('/cliente', async (req, res) => {
    const result = await insertClient(req.body)
    res.status(201).send({
        id: result.lastID,
        ...req.body
    });
});

app.put('/cliente/:id', async (req, res) => {
    const clienteAtual = await getClient(req.params.id);
    if (clienteAtual) {
        await updateClient(req.body);
        res.status(200).send({
            id: req.params.id,
            ...req.body
        });
    } else {
        res.status(204).send();
    }
});

app.delete('/cliente/:id', async (req, res) => {
    const clienteAtual = await getClient(req.params.id);
    console.log(clienteAtual)
    if (clienteAtual) {
        await deleteClient(req.params.id);
        res.status(200).send('Usuário deletado');
    } else {
        res.status(204).send();
    }
});

createProductTable();

app.get('/produtos', async (req, res) => {
    const produtos = await getAllProdutos();
    res.send(produtos);
});

app.get('/produto/:id', async (req, res) => {
    const result = await getProduto(req.params.id);
    res.status(200).send(result);
});

app.post('/produto', async (req, res) => {
    const result = await insertProduto(req.body);
    res.status(201).send({
        id: result.lastID,
        ...req.body
    });
});

app.put('/produto/:id', async (req, res) => {
    const produto = await getProduto(req.params.id);
    if (produto) {
        await updateProduto(req.body);
        res.status(200).send({
            id: req.params.id,
            ...req.body
        });
    } else {
        res.status(204).send();
    }
});

app.delete('/produto/:id', async (req, res) => {
    const produto = await getProduto(req.params.id);
    if (produto) {
        await deleteProduto(req.params.id);
        res.status(200).send('Produto deletado');
    } else {
        res.status(204).send();
    }
});

deleteProduto(1);

app.listen(3333, () => console.log('http://localhost:3333'));
