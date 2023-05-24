// import { openDb } from './configDb.js';
import express from 'express';
import path from 'path';
import upload from './middlewares/form-handler.js';
import { createTable, deleteClient, getAllClients, getClient, insertClient, updateClient } from './controller/clienteController.js';
import { createProductTable, deleteProduto, getAllProdutos, getProduto, insertProduto, updateProduto } from './controller/produtoController.js';
import deleteImage from './utils/deleteImage.js';

const app = express();

app.use(express.json());

// Usado pelas tags <img> no HTML para mostrar as imagens salvas
app.use('/images', express.static(path.resolve('src/public/images')));

createTable();

app.get('/', (req, res) => {
    res.sendFile(path.resolve('src/public/', 'form.html'));
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

/**
 * Os diretórios absolutos das imagens salvas no banco de dados são substituídos pelo
 * padrão 'images/[nome da imagem]' quando enviados para o client side
 */
app.get('/produtos', async (req, res) => {
    const produtos = await getAllProdutos();
    produtos.forEach((produto) => {
        produto.images = produto.images.map((url) => {
            return url.replace(path.resolve('src/public') + '/', '');
        });
    });
    res.send(produtos);
});

app.get('/produto/:id', async (req, res) => {
    const produto = await getProduto(req.params.id);
    produto.images = produto.images.map((url) => url.replace(path.resolve('src/public') + '/', ''))
    res.status(200).send(produto);
});

app.post('/new-product', upload.array('images', 5), async (req, res) => {
    const images = req.files.map((img) => img.path);
    const result = await insertProduto({...req.body, images: images});
    res.status(201).send({
        id: result.lastID,
        ...req.body,
        images: images
    });
});

app.put('/produto/:id', upload.single('produto-image'), async (req, res) => {
    const produto = await getProduto(req.params.id);
    if (produto) {
        await updateProduto({...req.body, image: req.file.path});
        await deleteImage(produto);
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
        await deleteImage(produto);
        res.status(200).send('Produto deletado');
    } else {
        res.status(204).send();
    }
});

app.listen(3333, () => console.log('http://localhost:3333'));
