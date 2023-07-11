
import { Request, Response } from "express";
import Mensaje from "../model/mensaje";

export const obtenerChat = async (req: Request, res: Response) => {
    try {
        const { de } = req.params;
        const { dataToken } = req.body;

        const query = `SELECT * FROM mensaje WHERE (de = ${de} AND para = ${dataToken.id}) OR (de = ${dataToken.id} AND para = ${de}) ORDER BY created_at ASC LIMIT 30`;

        const mensajes = await Mensaje.customQuery(query);
        return res.status(200).json({
            ok: true,
            mensajes
        });

    } catch (error) {
        return res.status(500).json({
            msg: 'Error interno del servidor'
        });
    }
}