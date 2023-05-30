/**
 * Faz as alterações dos dados de uma query para evitar erros quando usados no banco de dados.
 * 
 *      Um exemplo de query feita: /produtos?page=2&orderBy=name&search=produto%20123
 *      Variáveis da query:
 *          page = '2' (string)
 *          orderBy = 'name' (string)
 *          search = 'produto 123' (string)
 */

const URLQueryHandler = (req, res, next) => {
    try {
        req.query.pageSize = 12; // Valor fixo para número de itens retornados
        
        if (req.query.page) {
            const page = parseInt(req.query.page);
            if (Number.isInteger(page) && page > 0) {
                req.query.page = page;
            } else {
                throw new Error('Sem resultados');
            }
        } else {
            req.query.page = 1;
        }

        const orderBy = req.query.orderBy;
        if (orderBy) {
            req.query.orderBy = (['name', 'price'].includes(orderBy)) ? orderBy : null;
        } else {
            req.query.orderBy = null;
        }

        // Lower case -> Tira caractéres inválidos -> Tira espaços duplicados
        req.query.search = (req.query.search)
            ? req.query.search.toLowerCase().replace(/[^a-zA-Z0-9 -]/g, '').replace(/\s+/g, ' ')
            : null;

        next();
    } catch (error) {
        res.status(204).send(error);
    }
}

export default URLQueryHandler;