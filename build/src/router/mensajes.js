"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mensajeController_1 = require("../controllers/mensajeController");
const validarJwt_1 = require("../middlewares/validarJwt");
const router = (0, express_1.Router)();
router.get('/:de', [validarJwt_1.validarJWT], mensajeController_1.obtenerChat);
exports.default = router;
//# sourceMappingURL=mensajes.js.map