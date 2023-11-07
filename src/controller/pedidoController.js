import { openDb } from "../configDb.js";
import { getClient } from "./clienteController.js";
import { createProdutoPedido } from "./produtoPedidoController.js";

export async function createPedidoTable() {
    openDb().then(db => {
        db.exec(
            `CREATE TABLE IF NOT EXISTS pedido (
                id              INTEGER         PRIMARY KEY,
                cliente_id      INTEGER,
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

export async function getPedidosFromClient(clienteId) {
    const client = await getClient(clienteId);

    if (!client) {
        throw {
            statusCode: 400,
            message: 'Não foi encontrado nenhum cliente com o ID informado'
        }
    };

    return openDb().then(db => {
        return db.get(`
        SELECT p FROM pedido WHERE p.cliente_id== ${clienteId}
        `)
            .then(res => res);
    });
};

export async function insertPedido(pedido) {
    const { clientId, produtos } = pedido;
    const client = await getClient(clientId);

    if (!client) {
        throw {
            statusCode: 400,
            message: 'Não foi encontrado nenhum cliente com o ID informado'
        }
    }

    const pedidoResult = await Promise.resolve(openDb().then(db => {
        return db.run(`
            INSERT INTO pedido (cliente_id)
            VALUES (${clientId})
        `, (err, result) => {
            if (err) {
                return err.message;
            }
            return result;
        });
    }));

    for (let produto of produtos) {
        await createProdutoPedido({pedidoId: pedidoResult.lastID, ...produto});
    }

    return pedidoResult;
};

export async function deletePedido(pedidoId) {
    openDb().then(db => {
        db.run(`
            DELETE FROM pedido
            WHERE  id = ${pedidoId}
        `)
    })
}