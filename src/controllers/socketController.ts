import User from "../model/user";
import Mensaje from "../model/mensaje";


export const usuarioConectado = async (id = '') => {
    try {
        const usuario = await User.where('id', id).first();
        usuario.online = true;
        await User.update(usuario.id, { online: true });
        return usuario;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const usuarioDesconectado = async (uid = '') => {
    try {
        const usuario = await User.where('id', uid).first();
        usuario.online = false;
        await User.update(usuario.id, { online: false });
        return usuario;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const getUsuarios = async () => {
    try {
        const usuarios = await User.all();
        return usuarios;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const grabarMensaje = async (payload: any) => {
    try {
        const { de, para, mensaje } = payload;

        const nuevoMensaje = await Mensaje.create({
            de,
            para,
            mensaje
        });

        return nuevoMensaje;
    } catch (error) {
        console.log(error);
        return null;
    }
};