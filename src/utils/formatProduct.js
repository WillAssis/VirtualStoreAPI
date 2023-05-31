// Função de utilidade para formatar os dados de uma query no banco de dados dos
// produtos antes de enviar ao client
const formatProduct = (query) => {
    return {
        slug: query.slug,
        name: query.name,
        description: query.description,
        price: query.price/100,
        images: JSON.parse(query.images),
        featured: Boolean(query.featured)
    }
}

export default formatProduct;