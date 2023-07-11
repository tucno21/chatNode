import { Server } from 'socket.io';
import { comprobarJWT } from '../helpers/jwt';
import { getUsuarios, grabarMensaje, usuarioConectado, usuarioDesconectado } from '../controllers/socketController';



class Sockets {

    private io: Server;

    constructor(io: Server) {
        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        this.io.on('connection', async (socket) => {
            const token: string = socket.handshake.query['x-token'] as string;
            const [valido, id] = comprobarJWT(token);
            if (!valido) {
                console.log('Socket no identificado');
                return socket.disconnect();
            }

            await usuarioConectado(id);

            //crear una sala de chat para el usuario que ha iniciado sesion con el uid
            socket.join(id); //global, socket.id, uid

            console.log('Cliente conectado', id);

            //TODO: Emitir todos los usuarios conectados
            this.io.emit('lista-usuarios', await getUsuarios());

            socket.on('mensaje-personal', async (payload: any) => {
                const mensaje = await grabarMensaje(payload);
                //io.to es para emitir a un usuario en especifico
                //payload.para es el uid del usuario al que se le va a enviar el mensaje
                this.io.to(payload.para).emit('mensaje-personal', mensaje);
                //enviar el mensaje al usuario que lo envio
                this.io.to(payload.de).emit('mensaje-personal', mensaje);
            });

            //TODO: Emitir todos los usuarios conectados
            socket.on('disconnect', async () => {
                console.log('Cliente desconectado');
                await usuarioDesconectado(id);
                this.io.emit('lista-usuarios', await getUsuarios());
            });

            return;
        });
    }

}

export default Sockets;