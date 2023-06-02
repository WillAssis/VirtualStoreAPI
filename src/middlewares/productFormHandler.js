// Faz verificações a alterações na informações enviadas por formulário

const productFormHandler = (req, res, next) => {
    try {
        if (!req.body.name) {
            throw new Error('Nome é obrigatório');
        }

        if (!req.body.description) {
            throw new Error('Descrição é obrigatória');
        }

        const price = parseFloat(req.body.price);
        if (Number.isNaN(price) || price <= 0) {
            throw new Error('Preço inválido');
        }

        if (!req.files || req.files.length === 0) {
            req.files = [{filename: 'placeholder.png'}];
        } else if (req.files.length > 5) {
            throw new Error('Máximo 5 arquivos');
        }
        
        req.body.featured = (req.body.featured) ? 1 : 0;

        next();
    } catch (error) {
        console.log(error);
        res.status(204).send(error);
    }
}

export default productFormHandler;