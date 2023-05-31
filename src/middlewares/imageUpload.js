import multer from 'multer';
import path from 'path';
import fs from 'fs';

/**
 * O multer da acesso às informações enviadas por formulário nas requisições:
 *      -> 'req.body' mostra informações textuais
 *      -> 'req.file' mostra informações das imagens enviadas
 * 
 * As imagens são salvas automaticamente em src/public/images e seu nome no banco de dados
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

const imageUpload = multer({ storage: storage });

export default imageUpload;