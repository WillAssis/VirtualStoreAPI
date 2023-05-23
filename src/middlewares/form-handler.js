import multer from 'multer';
import path from 'path';

/**
 * O multer permite ver as informações enviadas por formulário
 * 
 * req.body mostra informações textuais
 * req.file mostra informações da imagem enviada
 * 
 * as imagens são salvas automaticamente em ./public/images e seu path no banco de dados
 */

console.log(path.resolve('src/public/images'));
const upload = multer({ dest: path.resolve('src/public/images') });

export default upload;