import { openDb } from "../configDb.js";

export async function createProductTable() {
    openDb().then(db => {
        db.exec(
            `CREATE TABLE IF NOT EXISTS produto (
                id              INTEGER         PRIMARY KEY,
                name            VARCHAR(100),
                description     VARCHAR(100),
                price           FLOAT,
                images          VARCHAR(256)
            )`
        );
    });
};

/**
 * As imagens são salvas no formato JSON como um array de caminhos/paths na forma
 *      '[caminho-até-o-projeto]/src/public/images/[imagem]'
 */
export async function insertProduto(produto) {
    return openDb().then(db => {
        return db.run(
            `INSERT INTO produto (name, description, price, images)
            VALUES (?, ?, ?, ?)`,
            [produto.name, produto.description, produto.price, JSON.stringify(produto.images)]
        );
    });
};

export async function getProduto(id) {
    return openDb().then(db => {
        return db.get(
            `SELECT * FROM produto
            WHERE produto.id == ${id}`
        ).then(res => {
            console.log(res);
            console.log(JSON.parse(res.images));
            return {
                name: res.name,
                description: res.description,
                price: res.price,
                images: JSON.parse(res.images)
            }
        });
    });
};

export async function updateProduto(produto) {
    openDb().then(db => {
        db.run(
            `UPDATE produto
            SET name=?, description=?, price=?, images=?
            WHERE id=?`,
            [produto.name, produto.description, produto.price, produto.image, produto.id]
        );
    });
};

export async function getAllProdutos() {
    return openDb().then(db => {
        return db.all(
            'SELECT * FROM produto'
        ).then(res => {
            return res.map((produto) => {
                console.log(produto);
                return {
                    name: produto.name,
                    description: produto.description,
                    price: produto.price,
                    images: JSON.parse(produto.images)
                }
            })
        });
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