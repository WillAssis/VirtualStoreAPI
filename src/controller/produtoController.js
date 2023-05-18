import { openDb } from "../configDb.js";

export async function createProductTable() {
    openDb().then(db => {
        db.exec(
            `CREATE TABLE IF NOT EXISTS produto (
                id              INTEGER         PRIMARY KEY,
                name            VARCHAR(100),
                description     VARCHAR(100),
                price           FLOAT,
                image           VARCHAR(100)
            )`
        );
    });
};

export async function insertProduto(produto) {
    return openDb().then(db => {
        return db.run(
            `INSERT INTO produto (name, description, price, image)
            VALUES (?, ?, ?, ?)`,
            [produto.name, produto.description, produto.price, produto.image]
        );
    });
};

export async function getProduto(id) {
    return openDb().then(db => {
        return db.get(
            `SELECT * FROM produto
            WHERE produto.id == ${id}`
        )
            .then(res => res)
    });
};

export async function updateProduto(produto) {
    openDb().then(db => {
        db.run(
            `UPDATE produto
            SET name=?, description=?, price=?, image=?
            WHERE id=?`,
            [produto.name, produto.description, produto.price, produto.image, produto.id]
        );
    });
};

export async function getAllProdutos() {
    return openDb().then(db => {
        return db.all(
            'SELECT * FROM produto'
        )
            .then(res => res);
    });
};

export async function deleteProduto(id) {
    return openDb().then(db => {
        return db.get(
            `DELETE FROM produto
            WHERE id == ${id}`
        )
            .then(res => res);
    });
};