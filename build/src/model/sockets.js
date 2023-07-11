"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../helpers/jwt");
const socketController_1 = require("../controllers/socketController");
class Sockets {
    constructor(io) {
        this.io = io;
        this.socketEvents();
    }
    socketEvents() {
        this.io.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
            const token = socket.handshake.query['x-token'];
            const [valido, id] = (0, jwt_1.comprobarJWT)(token);
            if (!valido) {
                console.log('Socket no identificado');
                return socket.disconnect();
            }
            yield (0, socketController_1.usuarioConectado)(id);
            //crear una sala de chat para el usuario que ha iniciado sesion con el uid
            socket.join(id); //global, socket.id, uid
            console.log('Cliente conectado', id);
            //TODO: Emitir todos los usuarios conectados
            this.io.emit('lista-usuarios', yield (0, socketController_1.getUsuarios)());
            socket.on('mensaje-personal', (payload) => __awaiter(this, void 0, void 0, function* () {
                const mensaje = yield (0, socketController_1.grabarMensaje)(payload);
                //io.to es para emitir a un usuario en especifico
                //payload.para es el uid del usuario al que se le va a enviar el mensaje
                this.io.to(payload.para).emit('mensaje-personal', mensaje);
                //enviar el mensaje al usuario que lo envio
                this.io.to(payload.de).emit('mensaje-personal', mensaje);
            }));
            //TODO: Emitir todos los usuarios conectados
            socket.on('disconnect', () => __awaiter(this, void 0, void 0, function* () {
                console.log('Cliente desconectado');
                yield (0, socketController_1.usuarioDesconectado)(id);
                this.io.emit('lista-usuarios', yield (0, socketController_1.getUsuarios)());
            }));
            return;
        }));
    }
}
exports.default = Sockets;
//# sourceMappingURL=sockets.js.map