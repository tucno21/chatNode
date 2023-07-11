import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');

export const validarJWT = (req: Request, res: Response, next: NextFunction): void | Response => {
    try {
        //leer el token
        const token = req.header('x-token');
        if (!token) {
            return res.status(401).json({
                ok: false,
                msg: 'No hay token en la petición'
            })
        }
        const data = jwt.verify(token, process.env.JWT_SECRET);

        //eliminar de data.iat and data.exp
        delete data.iat;
        delete data.exp;

        //enviar data en req
        req.body.dataToken = data;

        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido',
        })
    }
}