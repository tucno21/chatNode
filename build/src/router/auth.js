"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validarCampos_1 = require("../middlewares/validarCampos");
const authController_1 = require("../controllers/authController");
const validarJwt_1 = require("../middlewares/validarJwt");
const router = (0, express_1.Router)();
router.post('/login', [
    /* middlewares */
    (0, express_validator_1.check)('email', 'El email es obligatorio').isEmail(),
    (0, express_validator_1.check)('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos_1.validarCampos
], authController_1.getUser);
router.post('/register', [
    /* middlewares */
    (0, express_validator_1.check)('nombre', 'El nombre es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('email', 'El email es obligatorio').isEmail(),
    (0, express_validator_1.check)('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos_1.validarCampos
], authController_1.createUser);
router.get('/renew', [
    /* middlewares */
    validarJwt_1.validarJWT
], authController_1.renewToken);
exports.default = router;
//# sourceMappingURL=auth.js.map