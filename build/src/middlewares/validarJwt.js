"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarJWT = void 0;
const jwt = require('jsonwebtoken');
const validarJWT = (req, res, next) => {
    try {
        //leer el token
        const token = req.header('x-token');
        if (!token) {
            return res.status(401).json({
                ok: false,
                msg: 'No hay token en la petición'
            });
        }
        const data = jwt.verify(token, process.env.JWT_SECRET);
        //eliminar de data.iat and data.exp
        delete data.iat;
        delete data.exp;
        //enviar data en req
        req.body.dataToken = data;
        next();
    }
    catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido',
        });
    }
};
exports.validarJWT = validarJWT;
//# sourceMappingURL=validarJwt.js.map