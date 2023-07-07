const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {
    try {
        //leer el token
        const token = req.header('x-token');

        if (!token) {
            return res.status(401).json({
                ok: false,
                msg: 'No hay token en la petición'
            })
        }

        const { uid } = jwt.verify(token, process.env.JWT_KEY);
        //ENVIAR EL UID EN LA PETICIÓN
        req.uid = uid;

        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }
}

module.exports = {
    validarJWT
}