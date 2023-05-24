import { openDb } from "../configDb.js";
import formatProduct from "../utils/formatProduct.js";

export async function createProductTable() {
    openDb().then(db => {
        db.exec(
            `CREATE TABLE IF NOT EXISTS produto (
                id              INTEGER         PRIMARY KEY,
                name            VARCHAR(100),
                description     VARCHAR(100),
                price           INTEGER,
                images          VARCHAR(256)
            )`
        );
    });
};

// Um array contendo o nome das imagens dos produtos é salvo no formato JSON
export async function insertProduto(produto) {
    return openDb().then(db => {
        return db.run(
            `INSERT INTO produto (name, description, price, images)
            VALUES (?, ?, ?, ?)`,
            [produto.name, produto.description, Math.round(produto.price*100), JSON.stringify(produto.images)]
        );
    });
};

export async function getProduto(id) {
    return openDb().then(db => {
        return db.get(
            `SELECT * FROM produto
            WHERE produto.id == ${id}`
        ).then(res => formatProduct(res));
    });
};

export async function updateProduto(produto) {
    openDb().then(db => {
        db.run(
            `UPDATE produto
            SET name=?, description=?, price=?, images=?
            WHERE id=?`,
            [produto.name, produto.description, Math.round(produto.price*100), JSON.stringify(produto.images)]
        );
    });
};

export async function getAllProdutos() {
    return openDb().then(db => {
        return db.all(
            'SELECT * FROM produto'
        ).then(res => {
            return res.map((produto) => formatProduct(produto));
        });
    });
};

export async function deleteProduto(id) {
    return openDb().then(db => {
        return db.get(
            `DELETE FROM produto
            WHERE id == ${id}`
        )
            .then(res => {
                res
            });
    });
};