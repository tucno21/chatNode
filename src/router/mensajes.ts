import { Router } from 'express';
import { obtenerChat } from '../controllers/mensajeController';
import { validarJWT } from '../middlewares/validarJwt';

const router = Router();

router.get('/:de', [validarJWT], obtenerChat)

export default router;
