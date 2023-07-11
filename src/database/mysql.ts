// const mysql = require('mysql2');
import mysql from 'mysql2/promise';
const dotenv = require('dotenv');
dotenv.config();

// parametros
const host = process.env.DB_HOST || 'localhost';
const user = process.env.DB_USERNAME || 'root';
const password = process.env.DB_PASSWORD || 'root';
const database = process.env.DB_DATABASE || 'cronos';
const portData = process.env.DB_PORT || 3306;
const port = parseInt(portData.toString());

const db = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database,
    port: port
});

db.catch((err: any) => {
    console.log(err);
    throw new Error('Error al conectar con la base de datos');
});

export default db;