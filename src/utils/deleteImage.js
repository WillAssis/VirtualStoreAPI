import path from 'path';
import fs from 'fs';

// Recebe um array com o nome das imagens a serem deletadas em src/public/images
const deleteImages = function (images) {
    images.forEach(img => {
        if (img !== 'placeholder.png') {
            fs.unlink(path.resolve('src/public/images/' + img), (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
}

export default deleteImages;