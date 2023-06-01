// Função de utilidade para formatar os dados de uma query no banco de dados dos
// produtos antes de enviar ao client
const formatProduct = (query) => {
    return {
        id: query.id,
        title: query.title,
        slug: query.slug,
        description: query.description,
        price: query.price/100,
        images: JSON.parse(query.images).map(image => `/images/${image}`),
        destaque: Boolean(query.destaque)
    }
}

export default formatProduct;