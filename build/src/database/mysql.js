"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const mysql = require('mysql2');
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv = require('dotenv');
dotenv.config();
// parametros
const host = process.env.DB_HOST || 'localhost';
const user = process.env.DB_USERNAME || 'root';
const password = process.env.DB_PASSWORD || 'root';
const database = process.env.DB_DATABASE || 'cronos';
const portData = process.env.DB_PORT || 3306;
const port = parseInt(portData.toString());
console.log(host, user, password, database, port);
const db = promise_1.default.createConnection({
    host: host,
    user: user,
    password: password,
    database: database,
    port: port
});
db.then((connection) => {
    console.log('Conectado a la base de datos');
    return connection;
});
db.catch((err) => {
    console.log(err);
    throw new Error('Error al conectar con la base de datos');
});
exports.default = db;
//# sourceMappingURL=mysql.js.map