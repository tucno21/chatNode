const { response } = require("express");
const Mensaje = require("../models/mensaje");

const obtenerChat = async (req, res = response) => {
    try {
        const miId = req.uid;
        const mensajesDe = req.params.de;

        const last30 = await Mensaje.find({
            $or: [{ de: miId, para: mensajesDe }, { de: mensajesDe, para: miId }]
        })
            .sort({ createdAt: 'asc' })
            .limit(30);

        res.json({
            ok: true,
            mensajes: last30
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        })
    }
}

module.exports = {
    obtenerChat
}