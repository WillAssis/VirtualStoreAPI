// import { openDb } from './configDb.js';
import express from 'express';
import { createTable, getAllClients, insertClient } from './controller/clienteController.js';

const app = express();

app.use(express.json());

createTable();

app.get('/', (req, res) => {
    res.send('Bem vindo ao nosso Projeto :)')
})

app.get('/cliente',async (req, res) => {
    const clients = await getAllClients();
    res.send(clients);
})

app.post('/cliente', (req, res) => {
    insertClient(req.body)
    res.send({
        "status": 'OK'
    })
})

app.listen(3333, () => console.log('http://localhost:3333'));
