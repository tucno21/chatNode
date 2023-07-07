// path: api/login
const { Router } = require('express');
const { crearUsuario, login, renewToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//crear usuario
router.post('/new', [
    /* middlewares */
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe ser de 6 caracteres').not().isEmpty(),
    validarCampos
], crearUsuario);

//login
router.post('/', [
    /* middlewares */
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], login);

//renew token
router.get('/renew', [
    /* middlewares */
    validarJWT
], renewToken);


module.exports = router;