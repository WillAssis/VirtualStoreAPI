// Faz verificações a alterações na informações enviadas por formulário

const productBodyHandler = (req, res, next) => {
    try {
        if (!req.body.name) {
            throw new Error('Nome é obrigatório');
        }

        if (!req.body.description) {
            throw new Error('Descrição é obrigatória');
        }

        const price = parseInt(req.body.price);
        if (!Number.isInteger(price) || price <= 0) {
            throw new Error('Preço inválido');
        }

        if (!req.files || req.files.length === 0) {
            req.files = [{filename: 'placeholder.png'}];
        }

        next();
    } catch (error) {
        res.status(204).send(error);
    }
}

export default productBodyHandler;