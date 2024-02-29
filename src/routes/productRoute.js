import express from "express";
import URLQueryHandler from "../middlewares/URLQueryHandler.js";
import {
    deleteProduto,
    getFeaturedProdutos,
    getProduto,
    getProdutos,
    insertProduto,
    updateProduto,
    countProdutos
} from "../controller/produtoController.js";
import formatProduct from "../utils/formatProduct.js";
import deleteImages from "../utils/deleteImage.js";
import productFormHandler from "../middlewares/productFormHandler.js";
import imageUpload from "../middlewares/imageUpload.js";

const router = express.Router();
/**
 * TODO:
 *      -> Fazer verificações relacionadas à segurança;
 *      -> Criar autenticação para as operações de post, put e delete.
 */

// A quantidade de resultados é enviada para o front-end para facilitar a criação dos botões de paginação
router.get("/produtos", URLQueryHandler, async (req, res) => {
    try {
        const result = await getProdutos(req.query);
        const numberOfResults = await countProdutos(req.query);
        const produtos = result.map(formatProduct);
        if (produtos.length > 0) {
            res.send({
                products: produtos,
                results: numberOfResults.size,
                pages: Math.ceil(numberOfResults.size / req.query.pageSize),
                currentPage: req.query.page,
            });
        } else {
            res.status(204).send();
        }
    } catch (error) {
        console.log(error);
        res.status(204).send();
    }
});

router.get("/produto/:slug", async (req, res) => {
    try {
        const result = await getProduto(req.params.slug);
        if (result) {
            const produto = formatProduct(result);
            res.status(200).send(produto);
        } else {
            res.status(204).send();
        }
    } catch (error) {
        console.log(error);
        res.status(204).send();
    }
});

router.get("/destaques", async (req, res) => {
    try {
        const result = await getFeaturedProdutos();
        const produtos = result.map(formatProduct);
        if (produtos.length > 0) {
            res.status(200).send({ products: produtos });
        } else {
            res.status(204).send();
        }
    } catch (error) {
        console.log(error);
        res.status(204).send();
    }
});

router.post(
    "/novo-produto",
    imageUpload.array("images", 5),
    productFormHandler,
    async (req, res) => {
        try {
            const images = req.files.map((img) => img.filename);
            await insertProduto({ ...req.body, images: images });
            res.status(201).send({ errors: null });
        } catch (error) {
            console.log(error);
            res.status(418).send({
                errors: {
                    nameError: 'erro',
                    priceError: 'erro',
                    descriptionError: 'erro',
                }
            });
        }
    }
);

// TODO: testar o method put
router.put(
    "/produto/:slug",
    imageUpload.array("images", 5),
    productFormHandler,
    async (req, res) => {
        try {
            const produto = await getProduto(req.params.slug);
            if (produto) {
                const images = req.files.map((img) => img.filename);
                deleteImages(JSON.parse(produto));
                await updateProduto({ ...req.body, images: images });
                res.status(200).send("Produto atualizado");
            } else {
                res.status(204).send();
            }
        } catch (error) {
            console.log(error);
            res.status(204).send();
        }
    }
);

router.delete("/produto/:slug", async (req, res) => {
    try {
        const produto = await getProduto(req.params.slug);
        if (produto) {
            await deleteProduto(req.params.slug);
            deleteImages(JSON.parse(produto.images));
            res.status(200).send("Produto deletado");
        } else {
            res.status(204).send();
        }
    } catch (error) {
        console.log(error);
        res.status(204).send();
    }
});

export default router;