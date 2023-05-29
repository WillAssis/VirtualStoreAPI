// Faz verificações a alterações na informações enviadas por formulário

const productBodyHandler = (req, res, next) => {
    try {
        if (!req.body.name) {
            res.send('Nome é obrigatório');
        }

        if (!req.body.description) {
            res.send('Descrição é obrigatória');
        }

        const price = parseInt(req.body.price);
        if (!Number.isInteger(price) || price <= 0) {
            res.send('Preço inválido');
        }

        if (!req.files || req.files.length === 0) {
            req.files = [{filename: 'placeholder.png'}];
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(204).send();
    }
}

export default productBodyHandler;