import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validarCampos';
import { createUser, getUser, renewToken } from '../controllers/authController';
import { validarJWT } from '../middlewares/validarJwt';

const router = Router();

router.post('/login', [
    /* middlewares */
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], getUser);
router.post('/register', [
    /* middlewares */
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], createUser);

router.get('/renew', [
    /* middlewares */
    validarJWT
], renewToken);

export default router;