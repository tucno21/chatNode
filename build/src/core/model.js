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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("../database/mysql"));
class Model {
    constructor() {
        this.tableName = '';
        this.primaryKey = '';
        this.fillable = [];
        this.hidden = [];
        this.timestamps = false;
        this.created = '';
        this.updated = '';
        this.query = '';
        this.existWhere = false;
        this.wheree = [];
        this.joinn = [];
        this.selectt = '*';
        this.orderby = '';
        this.limitt = '';
        this.values = [];
    }
    define({ tableName, primaryKey, fillable, hidden = [], timestamps = false, created = 'created_at', updated = 'updated_at' }) {
        this.tableName = tableName;
        this.primaryKey = primaryKey;
        this.fillable = fillable;
        this.hidden = hidden;
        this.timestamps = timestamps;
        this.created = created;
        this.updated = updated;
    }
    getFields() {
        //elimino los campos que esta en hidden del array de fillable
        const fields = this.fillable.filter((item) => !this.hidden.includes(item));
        //agregar los campos de timestamps si es true
        if (this.timestamps) {
            fields.push(this.created, this.updated);
        }
        //agregar el campo primaryKey
        fields.push(this.primaryKey);
        return fields;
    }
    all() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fields = this.getFields().join(', ');
                //armamos la consulta
                const sql = `SELECT ${fields} FROM ${this.tableName}`;
                const rows = yield (yield mysql_1.default).query(sql);
                const data = rows[0].constructor === Array ? rows[0] : rows;
                return data;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fields = this.getFields().join(', ');
                //armamos la consulta
                const sql = `SELECT ${fields} FROM ${this.tableName} WHERE ${this.primaryKey} = ${id}`;
                const rows = yield (yield mysql_1.default).query(sql);
                const data = rows[0].constructor === Array ? rows[0][0] : rows[0];
                return data;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    last() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fields = this.getFields().join(', ');
                //armamos la consulta
                const sql = `SELECT ${fields} FROM ${this.tableName} ORDER BY ${this.primaryKey} DESC LIMIT 1`;
                const rows = yield (yield mysql_1.default).query(sql);
                const data = rows[0].constructor === Array ? rows[0][0] : rows[0];
                return data;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.validate(data);
                //agregar los campos de timestamps si es true al objeto data
                if (this.timestamps) {
                    const currentDate = new Date();
                    data[this.created] = currentDate;
                    data[this.updated] = currentDate;
                }
                //obtenemos los campos de data
                const fields = Object.keys(data).join(', ');
                //obtenemos los valores de data y almacenamos en un array
                const values = Object.values(data);
                //el numero de ? es igual al numero de fields
                const questionMarks = Object.keys(data).map(() => '?').join(', ');
                //armamos la consulta
                const sql = `INSERT INTO ${this.tableName} (${fields}) VALUES (${questionMarks})`;
                const connect = yield mysql_1.default;
                const [result] = yield connect.execute(sql, values);
                const lastInsertId = result.insertId;
                //agregar el id al objeto data
                data[this.primaryKey] = lastInsertId;
                //eliminar de dara los campos que estan en hidden
                this.hidden.forEach((item) => delete data[item]);
                return data;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.validateFillable(data);
                //agregar los campos de timestamps si es true al objeto data
                if (this.timestamps) {
                    data[this.updated] = new Date();
                }
                //obtenemos los campos de data fields = campo1 = ?, campo2 = ?
                const fields = Object.keys(data).map((item) => `${item} = ?`).join(', ');
                //obtenemos los valores de data y almacenamos en un array
                const values = Object.values(data);
                //agregamos el id al array de values
                values.push(id);
                //armamos la consulta
                const sql = `UPDATE ${this.tableName} SET ${fields} WHERE ${this.primaryKey} = ?`;
                const connect = yield mysql_1.default;
                const [result] = yield connect.execute(sql, values);
                const affectedRows = result.affectedRows;
                if (affectedRows === 0) {
                    throw new Error('El registro no existe');
                }
                //agregar el id al objeto data
                data[this.primaryKey] = id;
                //eliminar de data los campos que estan en hidden
                this.hidden.forEach((item) => delete data[item]);
                return data;
            }
            catch (error) {
                // throw new Error(error.message);
                const err = error;
                throw new Error(err.message);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //armamos la consulta
                const sql = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
                // console.log(this.timestamps);
                // console.log(sql);
                // console.log(values);
                const connect = yield mysql_1.default;
                const [result] = yield connect.execute(sql, [id]);
                const affectedRows = result.affectedRows;
                if (affectedRows === 0) {
                    throw new Error('El registro no existe');
                }
                return true;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    validate(data) {
        //verificar que data tenga los campos de fillable caso contrario lanzar error y detener la ejecucion
        const validate = this.fillable.every((item) => Object.keys(data).includes(item));
        if (!validate) {
            throw new Error('Los nombres campos no coinciden con los campos de la tabla');
        }
    }
    validateFillable(data) {
        //validar que lo que se envia en data exista en fillable caso contrario lanzar error y detener la ejecucion
        const validate = Object.keys(data).every((item) => this.fillable.includes(item));
        if (!validate) {
            throw new Error('Los nombres campos no coinciden con los campos de la tabla');
        }
    }
    select(...fields) {
        this.selectt = fields.join(', ');
        return this;
    }
    where(columna, operadorOvalor, valor = '') {
        this.existWhere = true;
        if (valor === '') {
            this.wheree.push(`${columna} = ?`);
            this.values.push(operadorOvalor);
        }
        else {
            this.wheree.push(`${columna} ${operadorOvalor} '${valor}'`);
        }
        return this;
    }
    whereBetween(columna, valor1, valor2) {
        this.existWhere = true;
        this.wheree.push(`${columna} BETWEEN ? AND ?`);
        this.values.push(valor1);
        this.values.push(valor2);
        return this;
    }
    whereConcat(columna, operadorOvalor, valor = '') {
        this.existWhere = true;
        if (valor === '') {
            this.wheree.push(`CONCAT(${columna}) = ?`);
            this.values.push(operadorOvalor);
        }
        else {
            this.wheree.push(`CONCAT(${columna}) ${operadorOvalor} ?`);
            this.values.push(valor);
        }
        return this;
    }
    andWhere(columna, operadorOvalor, valor = '') {
        if (valor === '') {
            this.wheree.push(`AND ${columna} = ?`);
            this.values.push(operadorOvalor);
        }
        else {
            this.wheree.push(`AND ${columna} ${operadorOvalor} ?`);
            this.values.push(valor);
        }
        return this;
    }
    orWhere(columna, operadorOvalor, valor = '') {
        if (valor === '') {
            this.wheree.push(`OR ${columna} = ?`);
            this.values.push(operadorOvalor);
        }
        else {
            this.wheree.push(`OR ${columna} ${operadorOvalor} ?`);
            this.values.push(valor);
        }
        return this;
    }
    join(tabla, columna1, operador, columna2, tipo = "INNER") {
        this.joinn.push(`${tipo} JOIN ${tabla} ON ${columna1} ${operador} ${columna2}`);
        return this;
    }
    orderBy(columna, orden) {
        this.orderby = `ORDER BY ${columna} ${orden}`;
        return this;
    }
    limit(limit) {
        // Comprobar si el límite es un número entero
        if (!Number.isInteger(limit)) {
            throw new Error("El límite debe ser un número entero");
        }
        // Comprobar si el límite es mayor a 0
        if (limit <= 0) {
            throw new Error("El límite debe ser mayor a 0");
        }
        this.limitt = `LIMIT ${limit}`;
        return this;
    }
    executeResult(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const connect = yield mysql_1.default;
            const result = yield connect.execute(query, this.values);
            this.joinn = [];
            this.selectt = '*';
            this.wheree = [];
            this.orderby = '';
            this.values = [];
            return result;
        });
    }
    first() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const select = this.selectt;
                const join = this.joinn.join(" ");
                const where = this.wheree.join(" ");
                const orderby = this.orderby;
                if (this.existWhere) {
                    this.query = `SELECT ${select} FROM ${this.tableName} ${join} WHERE ${where} ${orderby} LIMIT 1`;
                }
                else {
                    this.query = `SELECT ${select} FROM ${this.tableName} ${join} ${orderby} LIMIT 1`;
                }
                const result = yield this.executeResult(this.query);
                const data = result[0].constructor === Array ? result[0][0] : result[0];
                return data;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const select = this.selectt;
                const join = this.joinn.join(" ");
                const where = this.wheree.join(" ");
                const orderby = this.orderby;
                const limit = this.limitt;
                if (this.existWhere) {
                    this.query = `SELECT ${select} FROM ${this.tableName} ${join} WHERE ${where} ${orderby} ${limit}`;
                }
                else {
                    this.query = `SELECT ${select} FROM ${this.tableName} ${join} ${orderby} ${limit}`;
                }
                console.log(this.query);
                const result = yield this.executeResult(this.query);
                const data = result[0].constructor === Array ? result[0] : result;
                return data;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    max() {
        return __awaiter(this, void 0, void 0, function* () {
            const select = this.selectt;
            if (select === '*') {
                throw new Error("no agregó ninguna columna para obtener el valor máximo Model.select('columna').max()");
            }
            const join = this.joinn.join(" ");
            const where = this.wheree.join(" ");
            const orderby = this.orderby;
            if (this.existWhere) {
                this.query = `SELECT MAX(${select}) FROM ${this.tableName} ${join} WHERE ${where} ${orderby}`;
            }
            else {
                this.query = `SELECT MAX(${select}) FROM ${this.tableName} ${join} ${orderby}`;
            }
            const result = yield this.executeResult(this.query);
            const maxResult = result[0];
            const maxColumn = `MAX(${select})`;
            if (!maxResult[0] || !(maxColumn in maxResult[0])) {
                throw new Error(`No se encontró el valor máximo para la columna ${select}`);
            }
            return maxResult[0][maxColumn];
        });
    }
    min() {
        return __awaiter(this, void 0, void 0, function* () {
            const select = this.selectt;
            if (select === '*') {
                throw new Error("no agregó ninguna columna para obtener el valor mínimo Model.select('columna').min()");
            }
            const join = this.joinn.join(" ");
            const where = this.wheree.join(" ");
            const orderby = this.orderby;
            if (this.existWhere) {
                this.query = `SELECT MIN(${select}) FROM ${this.tableName} ${join} WHERE ${where} ${orderby}`;
            }
            else {
                this.query = `SELECT MIN(${select}) FROM ${this.tableName} ${join} ${orderby}`;
            }
            const result = yield this.executeResult(this.query);
            const minResult = result[0];
            const minColumn = `MIN(${select})`;
            if (!minResult[0] || !(minColumn in minResult[0])) {
                throw new Error(`No se encontró el valor mínimo para la columna ${select}`);
            }
            return minResult[0][minColumn];
        });
    }
    sum() {
        return __awaiter(this, void 0, void 0, function* () {
            const select = this.selectt;
            if (select === '*') {
                throw new Error("no agregó ninguna columna para obtener la suma Model.select('columna').sum()");
            }
            const join = this.joinn.join(" ");
            const where = this.wheree.join(" ");
            const orderby = this.orderby;
            if (this.existWhere) {
                this.query = `SELECT SUM(${select}) FROM ${this.tableName} ${join} WHERE ${where} ${orderby}`;
            }
            else {
                this.query = `SELECT SUM(${select}) FROM ${this.tableName} ${join} ${orderby}`;
            }
            const result = yield this.executeResult(this.query);
            const sumResult = result[0];
            const sumColumn = `SUM(${select})`;
            if (!sumResult[0] || !(sumColumn in sumResult[0])) {
                throw new Error(`No se encontró el valor mínimo para la columna ${select}`);
            }
            return sumResult[0][sumColumn];
        });
    }
    avg() {
        return __awaiter(this, void 0, void 0, function* () {
            const select = this.selectt;
            if (select === '*') {
                throw new Error("no agregó ninguna columna para obtener el promedio Model.select('columna').avg()");
            }
            const join = this.joinn.join(" ");
            const where = this.wheree.join(" ");
            const orderby = this.orderby;
            if (this.existWhere) {
                this.query = `SELECT AVG(${select}) FROM ${this.tableName} ${join} WHERE ${where} ${orderby}`;
            }
            else {
                this.query = `SELECT AVG(${select}) FROM ${this.tableName} ${join} ${orderby}`;
            }
            const result = yield this.executeResult(this.query);
            const avgResult = result[0];
            const avgColumn = `AVG(${select})`;
            if (!avgResult[0] || !(avgColumn in avgResult[0])) {
                throw new Error(`No se encontró el valor mínimo para la columna ${select}`);
            }
            return avgResult[0][avgColumn];
        });
    }
    veryfyEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = `SELECT * FROM ${this.tableName} WHERE email = ?`;
                const connect = yield mysql_1.default;
                const result = yield connect.execute(sql, [email]);
                const data = result[0].constructor === Array ? result[0][0] : result[0];
                return data;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    customQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connect = yield mysql_1.default;
                const result = yield connect.execute(query);
                const data = result[0].constructor === Array ? result[0] : result;
                return data;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = Model;
//# sourceMappingURL=model.js.map