import { openDb } from "../configDb.js";
import formatProduct from "../utils/formatProduct.js";

/**
 * Gambiarras:
 *      -> Os nomes das imagens estão sendo armazenas como um array no formato JSON na própria
 *      tabela dos produtos.
 *      -> O preço dos produtos é multiplicado por 100 e transformado em integer para facilitar
 *      a conversão de valores e resultar em 2 casas decimais.
 * TODO:
 *      -> Criar uma nova tabela para armazenar os nomes das imagens em cada coluna, com uma
 *      foreign key para o id de um produto em cada instância
 */

export async function createProductTable() {
    openDb().then(db => {
        db.exec(
            `CREATE TABLE IF NOT EXISTS produto (
                id              INTEGER         PRIMARY KEY,
                slug            VARCHAR(100),
                name            VARCHAR(100),
                description     VARCHAR(100),
                price           INTEGER,
                images          VARCHAR(256)
            )`
        );
    });
};

export async function insertProduto(produto) {
    return openDb().then(db => {
        return db.run(
            `INSERT INTO produto (slug, name, description, price, images)
            VALUES (?, ?, ?, ?, ?)`,
            [
                // Lower case -> Tira caractéres inválidos -> Tira espaços duplicados -> Insere - nos espaços
                produto.name.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, ' ').replace(/[ ]/g, '-'),
                produto.name,
                produto.description,
                Math.round(produto.price*100),
                JSON.stringify(produto.images)
            ]
        );
    });
};

export async function getProduto(slug) {
    console.log(slug);
    return openDb().then(db => {
        return db.get(
            `SELECT slug, name, description, price, images FROM produto
            WHERE produto.slug == '${slug}';`
        ).then(res => formatProduct(res));
    });
};

export async function updateProduto(produto) {
    openDb().then(db => {
        db.run(
            `UPDATE produto
            SET slug=?, name=?, description=?, price=?, images=?
            WHERE id=?`,
            [
                // Lower case -> Tira caractéres inválidos -> Tira espaços duplicados -> Insere - nos espaços
                produto.name.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, ' ').replace(/[ ]/g, '-'),
                produto.name,
                produto.description,
                Math.round(produto.price*100),
                JSON.stringify(produto.images)
            ]
        );
    });
};

export async function getProdutos(data) {
    return openDb().then(db => {
        return db.all(
            `SELECT slug, name, description, price, images FROM produto
            ${(data.search) ? `WHERE name LIKE '%${data.search}%'` : ''}
            ${(data.orderBy) ? `ORDER BY ${data.orderBy}` : ''}
            LIMIT 12 OFFSET ${data.pageSize * (data.page - 1)};`
        )
            .then(res => res.map((produto) => formatProduct(produto)));
    });
};

export async function countProdutos(data) {
    return openDb().then(db => {
        return db.get(
            `SELECT COUNT() AS size FROM produto
            ${(data.search) ? `WHERE name LIKE '%${data.search}%'` : ''};`
        );
    });
}

export async function deleteProduto(id) {
    return openDb().then(db => {
        return db.get(
            `DELETE FROM produto
            WHERE id == ${id};`
        )
            .then(res => {
                res
            });
    });
};