// Função de utilidade para formatar os dados de uma query no banco de dados dos produtos
const formatProduct = (query) => {
    return {
        id: query.id,
        name: query.name,
        description: query.description,
        price: query.price/100,
        images: JSON.parse(query.images)
    }
}

export default formatProduct;