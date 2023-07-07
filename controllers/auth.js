const { response } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
    try {

        const { email, password, nombre } = req.body;

        //verificar email en la base de datos
        const validarEmail = await Usuario.findOne({ email });
        if (validarEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El email ya existe'
            })
        }

        //crear usuario con el modelo
        const usuario = new Usuario(req.body);

        //encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //guardar usuario en la base de datos
        await usuario.save();

        //generar el token
        const token = await generarJWT(usuario.id);


        //enviar respuesta
        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        })
    }
}

const login = async (req, res = response) => {
    try {
        const { email, password } = req.body;

        //verificar email en la base de datos
        const validarEmail = await Usuario.findOne({ email });
        if (!validarEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El email no existe'
            })
        }

        //verificar password
        const validarPassword = bcrypt.compareSync(password, validarEmail.password);
        if (!validarPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'El password no es correcto'
            })
        }

        //generar el token
        const token = await generarJWT(validarEmail.id);

        //enviar respuesta
        res.json({
            ok: true,
            usuario: validarEmail,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        })
    }
}

const renewToken = async (req, res = response) => {
    const uid = req.uid;

    //generar el token
    const token = await generarJWT(uid);

    //obtener el usuario por el uid
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        usuario,
        token
    })
}

module.exports = {
    crearUsuario,
    login,
    renewToken
}
