import multer from 'multer';
import path from 'path';
import fs from 'fs';

/**
 * O multer permite ver as informações enviadas por formulário
 * 
 * req.body mostra informações textuais
 * req.file mostra informações da imagem enviada
 * 
 * as imagens são salvas automaticamente em ./public/images e seu path no banco de dados
 */

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const imageDirectory = path.resolve('src/public/images');
        if (!fs.existsSync(imageDirectory)) {
            fs.mkdirSync(imageDirectory);
        }
        cb(null, imageDirectory);
    }
});

const upload = multer({ storage: storage });

export default upload;