"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const sockets_1 = __importDefault(require("../model/sockets"));
const route_1 = __importDefault(require("./route"));
class App {
    constructor() {
        this.initParh = `/${process.env.NAME_INIT_PATH}` || '/api';
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '8000';
        this.server = http_1.default.createServer(this.app);
        this.io = new socket_io_1.Server(this.server);
        //iniciar los middlewares
        this.middlewares();
        //iniciar las rutas
        this.routes();
        //iniciar sockets
        this.sockets();
    }
    middlewares() {
        //cors
        this.app.use((0, cors_1.default)());
        //lectura y parseo del body
        this.app.use(express_1.default.json());
        //directorio publico
        this.app.use(express_1.default.static('public'));
    }
    routes() {
        this.app.use(this.initParh, route_1.default);
    }
    sockets() {
        new sockets_1.default(this.io);
    }
    listen() {
        const port = this.port;
        this.server.listen(port, () => {
            console.log(`Servidor corriendo en el puerto ${port}`);
        });
    }
}
exports.default = App;
//# sourceMappingURL=server.js.map