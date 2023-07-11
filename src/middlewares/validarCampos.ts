const { validationResult } = require("express-validator");
import { Request, Response, NextFunction } from 'express';

export const validarCampos = (req: Request, res: Response, next: NextFunction): void | Response => {

    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errores: errores.mapped()
        })
    }

    next();
};