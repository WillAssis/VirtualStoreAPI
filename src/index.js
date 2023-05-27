// import { openDb } from './configDb.js';
import express from 'express';
import path from 'path';
import upload from './middlewares/formHandler.js';
import URLQueryHandler from './middlewares/URLQueryHandler.js';
import { createTable, deleteClient, getAllClients, getClient, insertClient, updateClient } from './controller/clienteController.js';
import { createProductTable, deleteProduto, getAllProdutos, getProduto, insertProduto, updateProduto } from './controller/produtoController.js';
import deleteImages from './utils/deleteImage.js';

const app = express();

app.use(express.json());

createTable();

app.get('/', (req, res) => {
    //res.send('Bem vindo ao nosso Projeto :)');
    res.sendFile(path.resolve('src/public', 'index.html'));
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

/**
 * TODO:
 *      -> Fazer verificações relacionadas à segurança;
 *      -> Criar autenticação para as operações de post, put e delete.
 */

createProductTable();

// Usado pelas tags <img> no front para mostrar as imagens salvas
app.use('/images', express.static(path.resolve('src/public/images')));

app.get('/produtos', URLQueryHandler, async (req, res) => {
    try {
        const produtos = await getAllProdutos(req.query);
        if (produtos.length > 0) {
            res.send(produtos);
        } else {
            res.send('Sem resultados');
        }
    } catch (error) {
        console.log(error);
        res.status(204).send();
    }
});

app.get('/produto/:id', async (req, res) => {
    try {
        const produto = await getProduto(req.params.id);
        res.status(200).send(produto);
    } catch (error) {
        console.log(error);
        res.status(204).send();
    }
});

app.post('/novo-produto', upload.array('images', 5), async (req, res) => {
    try {
        let images = [];
        if (req.files) {
            images = req.files.map((img) => img.filename);
        }
        if (images.length === 0) {
            images.push('placeholder.png');
        }
        const result = await insertProduto({...req.body, images: images});
        res.status(201).send({
            id: result.lastID,
            ...req.body,
            images
        });
    } catch (error) {
        console.log(error);
        res.status(204).send();
    }
});

// TODO: testar o method put
app.put('/produto/:id', upload.single('images'), async (req, res) => {
    try {
        const produto = await getProduto(req.params.id);
        const images = req.files.map((img) => img.filename);
        await deleteImage(produto);
        await updateProduto({...req.body, images: images});
        res.status(200).send({
                id: req.params.id,
                ...req.body,
                images
        });
    } catch (error) {
        console.log(error);
        res.status(204).send();
    }
});

app.delete('/produto/:id', async (req, res) => {
    try {
        const produto = await getProduto(req.params.id);
        await deleteProduto(req.params.id);
        deleteImages(produto.images);
        res.status(200).send('Produto deletado');
    } catch (error) {
        console.log(error);
        res.status(204).send();
    }
});

app.listen(3333, () => console.log('http://localhost:3333'));
