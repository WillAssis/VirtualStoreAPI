import { openDb } from "../configDb.js";

/**
 * Gambiarras:
 *      -> Os nomes das imagens estão sendo armazenas como um array no formato JSON na própria
 *      tabela dos produtos.
 *      -> O preço dos produtos é multiplicado por 100 e transformado em integer para facilitar
 *      a conversão de valores e resultar em 2 casas decimais.
 * TODO:
 *      -> Normalização
 *      -> Slugs diferentes para nomes duplicados
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
                images          VARCHAR(256),
                featured        INTEGER         DEFAULT         0
            )`
        );
    });
};

export async function insertProduto(produto) {
    return openDb().then(db => {
        return db.run(
            `INSERT INTO produto (slug, name, description, price, images, featured)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                // Lower case -> Tira caractéres inválidos -> Tira espaços duplicados -> Insere - nos espaços
                produto.name.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, ' ').replace(/[ ]/g, '-'),
                produto.name,
                produto.description,
                Math.round(produto.price*100),
                JSON.stringify(produto.images),
                produto.featured
            ]
        );
    });
};

export async function getProduto(slug) {
    return await openDb().then(db => async () => {
        return await db.get(
            `SELECT * FROM produto
            WHERE produto.slug == '${slug}';`
        );
    });
};

export async function updateProduto(produto) {
    openDb().then(db => {
        db.run(
            `UPDATE produto
            SET slug=?, name=?, description=?, price=?, images=?, featured=?
            WHERE id=?`,
            [
                // Lower case -> Tira caractéres inválidos -> Tira espaços duplicados -> Insere - nos espaços
                produto.name.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, ' ').replace(/[ ]/g, '-'),
                produto.name,
                produto.description,
                Math.round(produto.price*100),
                JSON.stringify(produto.images),
                produto.featured
            ]
        );
    });
};

export async function getProdutos(data) {
    return openDb().then(db => {
        return db.all(
            `SELECT * FROM produto
            ${(data.search) ? `WHERE LOWER(name) LIKE '%${data.search}%'` : ''}
            ${(data.orderBy) ? `ORDER BY ${data.orderBy}` : ''}
            LIMIT 12 OFFSET ${data.pageSize * (data.page - 1)};`
        );
    });
};

export async function getFeaturedProdutos() {
    return openDb().then(db => {
        return db.all(
            `SELECT * FROM produto
            WHERE produto.featured == 1;`
        );
    });
}

export async function countProdutos(data) {
    return openDb().then(db => {
        return db.get(
            `SELECT COUNT() AS size FROM produto
            ${(data.search) ? `WHERE LOWER(name) LIKE '%${data.search}%'` : ''};`
        );
    });
}

export async function deleteProduto(slug) {
    return openDb().then(db => {
        return db.get(
            `DELETE FROM produto
            WHERE slug == '${slug}';`
        );
    });
};