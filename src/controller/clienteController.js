import { openDb } from "../configDb.js";

export async function createTable() {
    openDb().then(db => {
        db.exec(
            'CREATE TABLE IF NOT EXISTS cliente (id INTEGER PRIMARY KEY, nome VARCHAR(100), data_nascimento DATE, cep VARCHAR(8))'
        );
    });
};

export async function insertClient(cliente) {
    return openDb().then(db => {
        return db.run(
            `INSERT INTO cliente (nome, data_nascimento, cep)
            VALUES (?, ?, ?)`,
            [cliente.nome, cliente.dataNascimento, cliente.cep]
        );
    });
};

export async function getClient(id) {
    return openDb().then(db => {
        return db.get(
            `SELECT * FROM cliente WHERE cliente.id == ${id}`
        )
            .then(res => res)
    });
};

export async function updateClient(cliente) {
    openDb().then(db => {
        db.run(
            'UPDATE cliente SET nome=?, data_nascimento=?, cep=? WHERE id=?',
            [cliente.nome, cliente.dataNascimento, cliente.cep, cliente.id]
        );
    });
};

export async function getAllClients() {
    return openDb().then(db => {
        return db.all(
            'SELECT * FROM cliente'
        )
            .then(res => res);
    });
};

export async function deleteClient(id) {
    return openDb().then(db => {
        return db.get(
            `DELETE FROM cliente WHERE id == ${id}`
        )
            .then(res => res);
    });
};
