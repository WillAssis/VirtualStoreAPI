import path from 'path';
import fs from 'fs';

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