import express, { Application } from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import Sockets from '../model/sockets';
import router from './route';


class App {
    private app: Application;
    private port: string;
    private server: http.Server;
    private io: Server;
    private initParh: string = `/${process.env.NAME_INIT_PATH}` || '/api';

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '8000';


        this.server = http.createServer(this.app);
        this.io = new Server(this.server);

        //iniciar los middlewares
        this.middlewares();
        //iniciar las rutas
        this.routes();
        //iniciar sockets
        this.sockets();
    }

    private middlewares(): void {
        //cors
        this.app.use(cors({
            origin: true,
        }));
        //lectura y parseo del body
        this.app.use(express.json());
        //directorio publico
        this.app.use(express.static('public'));
    }

    routes(): void {
        this.app.use(this.initParh, router);
    }

    private sockets(): void {
        new Sockets(this.io);
    }

    public listen(): void {
        const port = this.port;
        this.server.listen(port, () => {
            console.log(`Servidor corriendo en el puerto ${port}`);
        });
    }
}

export default App;