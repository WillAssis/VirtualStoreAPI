// import { openDb } from './configDb.js';
import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { createTable, deleteClient, getAllClients, getClient, insertClient, updateClient } from './controller/clienteController.js';
import { createProductTable, deleteProduto, getAllProdutos, getProduto, insertProduto, updateProduto } from './controller/produtoController.js';

// Gambiarra
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const upload = multer({ dest: path.join(__dirname, '/public/images/') });
const app = express();

deleteProduto(1);
app.use(express.json());

// Usado pelas tags <img> no HTML para mostrar as imagens salvas
app.use('public/images', express.static(path.join(__dirname, '/public/images/')));

createTable();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/form.html'));
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

/**
 * O multer permite ver as informações enviadas por formulário
 * 
 * req.body mostra informações textuais
 * req.file mostra informações da imagem enviada
 * 
 * as imagens são salvas automaticamente em ./public/images e seu path no banco de dados
 */
app.post('/new-product', upload.single('produto-image'), async (req, res) => {
    const result = await insertProduto({...req.body, image: `public/images/${req.file.filename}`});
    res.status(201).send({
        id: result.lastID,
        ...req.body,
        image: `public/images/${req.file.filename}`
    });
});

app.put('/produto/:id', upload.single('produto-image'), async (req, res) => {
    const produto = await getProduto(req.params.id);
    if (produto) {
        await updateProduto({...req.body, image: `public/images/${req.file.filename}`});
        fs.unlink(path.join(__dirname, produto.image), (err) => {
            if (err) {
                console.log(err);
            }
        });
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
        fs.unlink(path.join(__dirname, produto.image), (err) => {
            if (err) {
                console.log(err);
            }
        });
        res.status(200).send('Produto deletado');
    } else {
        res.status(204).send();
    }
});

app.listen(3333, () => console.log('http://localhost:3333'));
