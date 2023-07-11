import { RowDataPacket } from 'mysql2';
import db from '../database/mysql';



interface CustomError extends Error {
    code: number;
}

interface SchemaData {
    tableName: string;
    primaryKey: string;
    fillable: string[];
    hidden?: string[];
    timestamps?: boolean;
    created?: string;
    updated?: string;
}


class Model {
    tableName: string = '';
    primaryKey: string = '';
    fillable: string[] = [];
    hidden: string[] = [];
    timestamps: boolean = false;
    created: string = '';
    updated: string = '';

    protected query: string = '';
    protected existWhere: boolean = false;
    protected wheree: string[] = [];
    protected joinn: string[] = [];
    protected selectt: string = '*';
    protected orderby: string = '';
    protected limitt: string = '';
    protected values: any[] = [];


    define(
        {
            tableName,
            primaryKey,
            fillable,
            hidden = [],
            timestamps = false,
            created = 'created_at',
            updated = 'updated_at' }: SchemaData
    ) {
        this.tableName = tableName;
        this.primaryKey = primaryKey;
        this.fillable = fillable;
        this.hidden = hidden;
        this.timestamps = timestamps;
        this.created = created;
        this.updated = updated;
    }

    private getFields(): string[] {
        //elimino los campos que esta en hidden del array de fillable
        const fields = this.fillable.filter((item: string) => !this.hidden.includes(item));
        //agregar los campos de timestamps si es true
        if (this.timestamps) {
            fields.push(this.created, this.updated);
        }
        //agregar el campo primaryKey
        fields.push(this.primaryKey);
        return fields;
    }

    async all(): Promise<RowDataPacket[]> {
        try {
            const fields = this.getFields().join(', ');
            //armamos la consulta
            const sql = `SELECT ${fields} FROM ${this.tableName}`;
            const rows = await (await db).query(sql);
            const data = rows[0].constructor === Array ? rows[0] : rows;
            return data as RowDataPacket[];
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async find(id: string): Promise<RowDataPacket> {
        try {
            const fields = this.getFields().join(', ');
            //armamos la consulta
            const sql = `SELECT ${fields} FROM ${this.tableName} WHERE ${this.primaryKey} = ${id}`;
            const rows = await (await db).query(sql);
            const data = rows[0].constructor === Array ? rows[0][0] : rows[0];
            return data as RowDataPacket;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async last(): Promise<RowDataPacket> {
        try {
            const fields = this.getFields().join(', ');
            //armamos la consulta
            const sql = `SELECT ${fields} FROM ${this.tableName} ORDER BY ${this.primaryKey} DESC LIMIT 1`;
            const rows = await (await db).query(sql);
            const data = rows[0].constructor === Array ? rows[0][0] : rows[0];
            return data as RowDataPacket;

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async create(data: Record<string, any>) {
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

            const connect = await db;
            const [result] = await connect.execute(sql, values);
            const lastInsertId = (result as any).insertId;

            //agregar el id al objeto data
            data[this.primaryKey] = lastInsertId;

            //eliminar de dara los campos que estan en hidden
            this.hidden.forEach((item: string) => delete data[item]);

            return data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async update(id: string, data: Record<string, any>) {
        try {
            this.validateFillable(data);

            //agregar los campos de timestamps si es true al objeto data
            if (this.timestamps) {
                data[this.updated] = new Date();
            }

            //obtenemos los campos de data fields = campo1 = ?, campo2 = ?
            const fields = Object.keys(data).map((item: string) => `${item} = ?`).join(', ');

            //obtenemos los valores de data y almacenamos en un array
            const values = Object.values(data);
            //agregamos el id al array de values
            values.push(id);

            //armamos la consulta
            const sql = `UPDATE ${this.tableName} SET ${fields} WHERE ${this.primaryKey} = ?`;

            const connect = await db;
            const [result] = await connect.execute(sql, values);
            const affectedRows = (result as any).affectedRows;

            if (affectedRows === 0) {
                throw new Error('El registro no existe');
            }

            //agregar el id al objeto data
            data[this.primaryKey] = id;

            //eliminar de data los campos que estan en hidden
            this.hidden.forEach((item: string) => delete data[item]);

            return data;
        } catch (error) {
            // throw new Error(error.message);
            const err = error as CustomError;
            throw new Error(err.message);
        }
    }

    async delete(id: string) {
        try {
            //armamos la consulta
            const sql = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;

            // console.log(this.timestamps);
            // console.log(sql);
            // console.log(values);

            const connect = await db;
            const [result] = await connect.execute(sql, [id]);
            const affectedRows = (result as any).affectedRows;

            if (affectedRows === 0) {
                throw new Error('El registro no existe');
            }

            return true;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    validate(data: object): void {
        //verificar que data tenga los campos de fillable caso contrario lanzar error y detener la ejecucion
        const validate = this.fillable.every((item: string) => Object.keys(data).includes(item));
        if (!validate) {
            throw new Error('Los nombres campos no coinciden con los campos de la tabla');
        }
    }

    validateFillable(data: object): void {
        //validar que lo que se envia en data exista en fillable caso contrario lanzar error y detener la ejecucion
        const validate = Object.keys(data).every((item: string) => this.fillable.includes(item));
        if (!validate) {
            throw new Error('Los nombres campos no coinciden con los campos de la tabla');
        }
    }

    select(...fields: string[]) {
        this.selectt = fields.join(', ');
        return this;
    }

    where(columna: string, operadorOvalor: string, valor: string = '') {
        this.existWhere = true;
        if (valor === '') {
            this.wheree.push(`${columna} = ?`);
            this.values.push(operadorOvalor);
        } else {
            this.wheree.push(`${columna} ${operadorOvalor} '${valor}'`);
        }
        return this;
    }

    whereBetween(columna: string, valor1: string, valor2: string) {
        this.existWhere = true;
        this.wheree.push(`${columna} BETWEEN ? AND ?`);
        this.values.push(valor1);
        this.values.push(valor2);
        return this;
    }

    whereConcat(columna: string, operadorOvalor: string, valor: string = '') {
        this.existWhere = true;
        if (valor === '') {
            this.wheree.push(`CONCAT(${columna}) = ?`);
            this.values.push(operadorOvalor);
        } else {
            this.wheree.push(`CONCAT(${columna}) ${operadorOvalor} ?`);
            this.values.push(valor);
        }
        return this;
    }

    andWhere(columna: string, operadorOvalor: string, valor: string = '') {
        if (valor === '') {
            this.wheree.push(`AND ${columna} = ?`);
            this.values.push(operadorOvalor);
        } else {
            this.wheree.push(`AND ${columna} ${operadorOvalor} ?`);
            this.values.push(valor);
        }
        return this;
    }

    orWhere(columna: string, operadorOvalor: string, valor: string = '') {
        if (valor === '') {
            this.wheree.push(`OR ${columna} = ?`);
            this.values.push(operadorOvalor);
        } else {
            this.wheree.push(`OR ${columna} ${operadorOvalor} ?`);
            this.values.push(valor);
        }
        return this;
    }

    join(tabla: string, columna1: string, operador: string, columna2: string, tipo: string = "INNER") {
        this.joinn.push(`${tipo} JOIN ${tabla} ON ${columna1} ${operador} ${columna2}`);
        return this;
    }

    orderBy(columna: string, orden: string) {
        this.orderby = `ORDER BY ${columna} ${orden}`;
        return this;
    }

    limit(limit: number) {
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

    protected async executeResult(query: string) {
        const connect = await db;
        const result = await connect.execute(query, this.values);

        this.joinn = [];
        this.selectt = '*';
        this.wheree = [];
        this.orderby = '';
        this.values = [];

        return result;
    }


    async first(): Promise<RowDataPacket> {
        try {
            const select = this.selectt;
            const join = this.joinn.join(" ");
            const where = this.wheree.join(" ");
            const orderby = this.orderby;

            if (this.existWhere) {
                this.query = `SELECT ${select} FROM ${this.tableName} ${join} WHERE ${where} ${orderby} LIMIT 1`;
            } else {
                this.query = `SELECT ${select} FROM ${this.tableName} ${join} ${orderby} LIMIT 1`;
            }

            const result = await this.executeResult(this.query);
            const data = result[0].constructor === Array ? result[0][0] : result[0];
            return data as RowDataPacket;

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async get(): Promise<RowDataPacket[]> {
        try {
            const select = this.selectt;
            const join = this.joinn.join(" ");
            const where = this.wheree.join(" ");
            const orderby = this.orderby;
            const limit = this.limitt;

            if (this.existWhere) {
                this.query = `SELECT ${select} FROM ${this.tableName} ${join} WHERE ${where} ${orderby} ${limit}`;
            } else {
                this.query = `SELECT ${select} FROM ${this.tableName} ${join} ${orderby} ${limit}`;
            }

            console.log(this.query);

            const result = await this.executeResult(this.query);
            const data = result[0].constructor === Array ? result[0] : result;
            return data as RowDataPacket[];

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async max() {
        const select = this.selectt;
        if (select === '*') {
            throw new Error("no agregó ninguna columna para obtener el valor máximo Model.select('columna').max()");
        }

        const join = this.joinn.join(" ");
        const where = this.wheree.join(" ");
        const orderby = this.orderby;

        if (this.existWhere) {
            this.query = `SELECT MAX(${select}) FROM ${this.tableName} ${join} WHERE ${where} ${orderby}`;
        } else {
            this.query = `SELECT MAX(${select}) FROM ${this.tableName} ${join} ${orderby}`;
        }

        const result = await this.executeResult(this.query);
        const maxResult = result[0] as RowDataPacket;

        const maxColumn = `MAX(${select})`;

        if (!maxResult[0] || !(maxColumn in maxResult[0])) {
            throw new Error(`No se encontró el valor máximo para la columna ${select}`);
        }

        return maxResult[0][maxColumn];
    }

    async min() {
        const select = this.selectt;
        if (select === '*') {
            throw new Error("no agregó ninguna columna para obtener el valor mínimo Model.select('columna').min()");
        }

        const join = this.joinn.join(" ");
        const where = this.wheree.join(" ");
        const orderby = this.orderby;

        if (this.existWhere) {
            this.query = `SELECT MIN(${select}) FROM ${this.tableName} ${join} WHERE ${where} ${orderby}`;
        } else {
            this.query = `SELECT MIN(${select}) FROM ${this.tableName} ${join} ${orderby}`;
        }

        const result = await this.executeResult(this.query);
        const minResult = result[0] as RowDataPacket;

        const minColumn = `MIN(${select})`;

        if (!minResult[0] || !(minColumn in minResult[0])) {
            throw new Error(`No se encontró el valor mínimo para la columna ${select}`);
        }

        return minResult[0][minColumn];
    }

    async sum() {
        const select = this.selectt;
        if (select === '*') {
            throw new Error("no agregó ninguna columna para obtener la suma Model.select('columna').sum()");
        }

        const join = this.joinn.join(" ");
        const where = this.wheree.join(" ");
        const orderby = this.orderby;

        if (this.existWhere) {
            this.query = `SELECT SUM(${select}) FROM ${this.tableName} ${join} WHERE ${where} ${orderby}`;
        } else {
            this.query = `SELECT SUM(${select}) FROM ${this.tableName} ${join} ${orderby}`;
        }

        const result = await this.executeResult(this.query);
        const sumResult = result[0] as RowDataPacket;

        const sumColumn = `SUM(${select})`;

        if (!sumResult[0] || !(sumColumn in sumResult[0])) {
            throw new Error(`No se encontró el valor mínimo para la columna ${select}`);
        }

        return sumResult[0][sumColumn];
    }

    async avg() {
        const select = this.selectt;
        if (select === '*') {
            throw new Error("no agregó ninguna columna para obtener el promedio Model.select('columna').avg()");
        }

        const join = this.joinn.join(" ");
        const where = this.wheree.join(" ");
        const orderby = this.orderby;

        if (this.existWhere) {
            this.query = `SELECT AVG(${select}) FROM ${this.tableName} ${join} WHERE ${where} ${orderby}`;
        } else {
            this.query = `SELECT AVG(${select}) FROM ${this.tableName} ${join} ${orderby}`;
        }

        const result = await this.executeResult(this.query);
        const avgResult = result[0] as RowDataPacket;

        const avgColumn = `AVG(${select})`;

        if (!avgResult[0] || !(avgColumn in avgResult[0])) {
            throw new Error(`No se encontró el valor mínimo para la columna ${select}`);
        }

        return avgResult[0][avgColumn];
    }

    async veryfyEmail(email: string) {
        try {
            const sql = `SELECT * FROM ${this.tableName} WHERE email = ?`;
            const connect = await db;
            const result = await connect.execute(sql, [email]);
            const data = result[0].constructor === Array ? result[0][0] : result[0];
            return data as RowDataPacket;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }


    async customQuery(query: string) {
        try {
            const connect = await db;
            const result = await connect.execute(query);
            const data = result[0].constructor === Array ? result[0] : result;
            return data as RowDataPacket[];
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default Model;