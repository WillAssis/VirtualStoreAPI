/**
 * Faz as alterações dos dados de uma query para a lista de produtos para evitar erros
 * (e SQL Injection?) quando usados no banco de dados.
 * 
 *      Um exemplo de query feita: /produtos?page=2&orderBy=name&search=produto%20123
 *      Variáveis da query:
 *          page = '2' (string)
 *          orderBy = 'name' (string)
 *          search = 'produto 123' (string)
 */

const URLQueryHandler = (req, res, next) => {
    try {
        const page = parseInt(req.query.page);
        req.query.page = ((Number.isInteger(page) && page > 0) ? page : 1);

        const orderBy = req.query.orderBy;
        if (orderBy) {
            req.query.orderBy = (['name', 'price'].includes(orderBy)) ? orderBy : null;
        } else {
            req.query.orderBy = null;
        }

        // TODO: verificar as pesquisas
        const search = req.query.search;
        req.query.search = (search) ? search : null;

        next();
    } catch (error) {
        console.log(error);
        res.status(204).send();
    }
}

export default URLQueryHandler;