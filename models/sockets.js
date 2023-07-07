const { usuarioConectado, usuarioDesconectado, getUsuarios, grabarMensaje } = require("../controllers/sockets");
const { comprobarJWT } = require("../helpers/jwt");

class Sockets {

    constructor(io) {
        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', async (socket) => {
            // console.log(socket.handshake.query['x-token']);
            const [valido, uid] = comprobarJWT(socket.handshake.query['x-token']);
            if (!valido) {
                console.log('Socket no identificado');
                return socket.disconnect();
            }

            await usuarioConectado(uid);

            //crear una sala de chat para el usuario que ha iniciado sesion con el uid
            socket.join(uid); //global, socket.id, uid

            console.log('Cliente conectado', uid);
            //TODO: validar el JWT
            //Si el token no es valido, desconectar

            //TODO: Saber que usuario esta activo mediante el UID

            //TODO: Emitir todos los usuarios conectados
            this.io.emit('lista-usuarios', await getUsuarios());

            //TODO: Socket join, uid

            //TODO: Escuchar cuando el cliente manda un mensaje
            //mensaje-personal
            socket.on('mensaje-personal', async (payload) => {
                const mensaje = await grabarMensaje(payload);
                //io.to es para emitir a un usuario en especifico
                //payload.para es el uid del usuario al que se le va a enviar el mensaje
                this.io.to(payload.para).emit('mensaje-personal', mensaje);
                //enviar el mensaje al usuario que lo envio
                this.io.to(payload.de).emit('mensaje-personal', mensaje);
            });

            //TODO: Disconnect
            //Marcar en la BD que el usuario se desconecto

            //TODO: Emitir todos los usuarios conectados

            socket.on('disconnect', async () => {
                console.log('Cliente desconectado');
                await usuarioDesconectado(uid);
                this.io.emit('lista-usuarios', await getUsuarios());
            });
        });
    }

}

module.exports = Sockets;