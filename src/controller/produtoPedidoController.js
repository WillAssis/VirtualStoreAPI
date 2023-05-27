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
}

export async function createProdutoPedido(produtoPedido) {
    const { produtoId, pedidoId, quantidade } = produtoPedido;

    const produto = await getProduto(produtoId);
    if (!produto) {
        throw {
            statusCode: 400,
            message: 'Não foi encontrado nenhum produto com o ID informado'
        }
    }
    openDb().then(db => {
        db.exec(`
            INSERT INTO produto_pedido(produto_id, pedido_id, quantidade)
            VALUES(${produtoId}, ${pedidoId}, ${quantidade})
        `)
    })
}