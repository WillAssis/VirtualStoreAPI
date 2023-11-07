import { openDb } from "../configDb.js";
import { getProduto } from "./produtoController.js";

export async function createProdutoPedidoTable() {
    openDb().then(db => {
        db.exec(`
            CREATE TABLE IF NOT EXISTS produto_pedido (
                produto_id INTEGER,
                pedido_id INTEGER,
                quantidade INTEGER,
                PRIMARY KEY (produto_id, pedido_id),
                FOREIGN KEY (produto_id) REFERENCES produto(id),
                FOREIGN KEY (pedido_id) REFERENCES pedido(id)
            )
        `)
    })
};

export async function createProdutoPedido(produtoPedido) {
    const { id, pedidoId, quantidade, slug } = produtoPedido;

    const produto = await getProduto(slug);
    if (!produto) {
        throw {
            statusCode: 400,
            message: 'Não foi encontrado nenhum produto com o ID informado'
        }
    }

    openDb().then(db => async () => {
        await db.exec(`
            INSERT INTO produto_pedido(produto_id, pedido_id, quantidade)
            VALUES(${id}, ${pedidoId}, ${quantidade})
        `)
    })
};

export async function getAllProdutosFromPedido(pedidoId) {
    return openDb().then(db => {
        return db.all(`
            SELECT produto.name, produto.price, produto.image, p.quantidade, p.pedido_id
            FROM produto
            INNER JOIN produto_pedido p
            ON produto.id == p.produto_id
            AND pedido_id == ${pedidoId}
        `)
            .then(res => res);
    });
};

export async function updatePedido(pedidoId, produtos) {
    for (let produto of produtos) {
        const { produtoId, quantidade } = produto 
        openDb().then(db => {
            db.all(`
                UPDATE produto_pedido
                SET quantidade = ${quantidade}
                WHERE pedido_id = ${pedidoId}
                AND produto_id = ${produtoId}
            `)
        })
    }
}