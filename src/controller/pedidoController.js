import { openDb } from "../configDb.js";
import { getClient } from "./clienteController.js";
import { createProdutoPedido } from "./produtoPedidoController.js";

export async function createPedidoTable() {
    openDb().then(db => {
        db.exec(
            `CREATE TABLE IF NOT EXISTS pedido (
                id              INTEGER         PRIMARY KEY,
                cliente_id      INTEGER,
                data_pedido     DATE,
                FOREIGN KEY (cliente_id) REFERENCES cliente(id)
            )`
        );
    });
};

export async function getAllPedidos() {
    return openDb().then(db => {
        return db.all(`
        SELECT * FROM pedido
        `)
            .then(res => res);
    })
};

export async function insertPedido(pedido) {
    const { clienteId, dataPedido, produtos } = pedido;
    const client = await getClient(clienteId);

    if (!client) {
        throw {
            statusCode: 400,
            message: 'Não foi encontrado nenhum cliente com o ID informado'
        }
    }

    const pedidoResult = openDb().then(db => async () => {
        return db.run(`
            INSERT INTO pedido (cliente_id, data_pedido)
            VALUES (${clienteId}, ${dataPedido})
        `, (err, result) => {
            if (err) {
                return error.message;
            }
            return result;
        });
    });

    for (pedido of pedidos) {
        await createProdutoPedido({pedidoId: pedidoResult.lastID, ...pedido});
    }

    return pedidoResult;
}