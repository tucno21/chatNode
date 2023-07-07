const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const Sockets = require('./sockets');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        //conectar a la base de datos
        dbConnection();

        //http server
        this.server = http.createServer(this.app);

        //configuracion de socket.io
        this.io = socketio(this.server, {
            /* configuraciones */
        });
    }

    middlewares() {
        //desplegar el directorio publico
        this.app.use(express.static(path.resolve(__dirname, '../public')));

        //cors
        this.app.use(cors());

        //lectura y parseo del body
        this.app.use(express.json());

        //api endpoints
        this.app.use('/api/login', require('../router/auth'));
        this.app.use('/api/mensajes', require('../router/mensajes'));
    }

    configSockets() {
        new Sockets(this.io);
    }

    execute() {
        //inicializar middlewares
        this.middlewares();

        // //inicializar sockets
        this.configSockets();

        //inicializar server
        this.server.listen(this.port, () => {
            console.log('servidor corriendo' + this.port);
        });
    }
}

module.exports = Server;