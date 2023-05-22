import fs from 'fs';

const deleteImage = async function (produto) {
    fs.unlink(produto.image, (err) => {
        if (err) {
            console.log(err);
        }
    });
}

export default deleteImage;