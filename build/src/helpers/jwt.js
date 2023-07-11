"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comprobarJWT = exports.generateJWT = void 0;
const jwt = require('jsonwebtoken');
const generateJWT = ({ id, email }) => {
    return new Promise((resolve, reject) => {
        const payload = { id, email };
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '24h'
        }, (err, token) => {
            if (err) {
                reject('No se pudo generar el token');
            }
            else {
                resolve(token);
            }
        });
    });
};
exports.generateJWT = generateJWT;
const comprobarJWT = (token = '') => {
    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        return [true, id];
    }
    catch (error) {
        return [false, null];
    }
};
exports.comprobarJWT = comprobarJWT;
//# sourceMappingURL=jwt.js.map