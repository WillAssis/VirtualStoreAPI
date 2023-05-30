// import { openDb } from './configDb.js';
import express from 'express';
import path from 'path';
import imageUpload from './middlewares/imageUpload.js';
import URLQueryHandler from './middlewares/URLQueryHandler.js';
import productFormHandler from './middlewares/productFormHandler.js';
import { createTable, deleteClient, getAllClients, getClient, insertClient, updateClient } from './controller/clienteController.js';
import { getFeaturedProdutos, countProdutos, createProductTable, deleteProduto, getProdutos, getProduto, insertProduto, updateProduto } from './controller/produtoController.js';
import deleteImages from './utils/deleteImage.js';
import formatProduct from './utils/formatProduct.js';

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

/**
 * TODO:
 *      -> Fazer verificações relacionadas à segurança;
 *      -> Criar autenticação para as operações de post, put e delete.
 */

createProductTable();

// Usado pelas tags <img> no front para mostrar as imagens salvas
app.use('/images', express.static(path.resolve('src/public/images')));

// A quantidade de resultados é enviada para o front-end para facilitar a criação dos botões de paginação
app.get('/produtos', URLQueryHandler, async (req, res) => {
    try {
        const result = await getProdutos(req.query);
        const numberOfResults = await countProdutos(req.query);
        const produtos = result.map(formatProduct);
        if (produtos.length > 0) {
            res.send({
                products: produtos,
                results: numberOfResults.size,
                pages: Math.ceil(numberOfResults.size / req.query.pageSize),
                currentPage: req.query.page
            });
        } else {
            res.send({});
        }
    } catch (error) {
        console.log(error);
        res.status(204).send();
    }
});

app.get('/produto/:slug', async (req, res) => {
    try {
        const result = await getProduto(req.params.slug);
        const produto = formatProduct(result);
        res.status(200).send(produto);
    } catch (error) {
        console.log(error);
        res.status(204).send();
    }
});

app.get('/destaques', async (req, res) => {
    try {
        const result = await getFeaturedProdutos();
        const produtos = result.map(formatProduct);
        res.status(200).send(produtos);
    } catch (error) {
        console.log(error);
        res.status(204).send();
    }
});

app.post('/novo-produto', imageUpload.array('images', 5), productFormHandler, async (req, res) => {
    try {
        const images = req.files.map((img) => img.filename);
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
app.put('/produto/:id', imageUpload.array('images', 5), async (req, res) => {
    try {
        const produto = await getProduto(req.params.id);
        const images = req.files.map((img) => img.filename);
        deleteImages(JSON.parse(produto));
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

app.delete('/produto/:slug', async (req, res) => {
    try {
        const produto = await getProduto(req.params.slug);
        if (produto) {
            await deleteProduto(req.params.slug);
            deleteImages(JSON.parse(produto.images));
            res.status(200).send('Produto deletado');
        } else {
            res.status(204).send('Produto não existe');
        }
    } catch (error) {
        console.log(error);
        res.status(204).send();
    }
});

app.listen(3333, () => console.log('http://localhost:3333'));
