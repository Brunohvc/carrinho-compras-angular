const sqlite3 = require('sqlite3').verbose();
const DBSOURCE = "db.sqlite";

const db = new sqlite3.Database(DBSOURCE, (err: any) => {
    if (err) {
        console.error(err.message)
    } else {
        console.info('Connected to the SQLite database.')
    }
});

function runQuery(query: string): Promise<any>;
function runQuery(query: string, parameters: Array<any> | undefined): Promise<any>;
function runQuery(query: string, parameters?: Array<any> | undefined) {
    return new Promise((resolve, reject) => {
        let type;
        if (query.startsWith('CREATE TABLE')) type = 'RUN';
        if (query.startsWith('INSERT INTO') && parameters) type = 'RUN';
        if (query.startsWith('UPDATE') && parameters) type = 'RUN';
        if (query.startsWith('DELETE') && parameters) type = 'RUN';
        if (query.startsWith('SELECT') && !parameters) type = 'ALL';
        if (query.startsWith('SELECT') && parameters) type = 'GET';

        console.log(type, query, parameters);

        if (type == 'RUN') {
            db.run(query, parameters, (err: any, result: any, row: any) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        } else if (type == 'ALL') {
            db.all(query, parameters, (err: any, result: any, row: any) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        } else if (type == 'GET') {
            db.get(query, parameters, (err: any, result: any, row: any) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        }
    });
}

function insert(tableName: string, properties: { [key: string]: any }) {
    return new Promise((resolve, reject) => {
        const columns = `(${Object.keys(properties).toString()})`;
        const values: Array<any> = [];
        Object.keys(properties).forEach((columnsName: string) => values.push(properties[columnsName]));
        const valuesReplace = `(${values.map(() => '?').toString()})`;

        const insert = `INSERT INTO ${tableName} ${columns} VALUES ${valuesReplace}`;
        runQuery(insert, values).then(resolve).catch(reject);
    });
}

function update(tableName: string, id: number, properties: { [key: string]: any }) {
    return new Promise((resolve, reject) => {
        const columns: Array<string> = [];
        Object.keys(properties).forEach((columnsName: string) => {
            const column = `${columnsName} = COALESCE(?,${columnsName})`;
            columns.push(column);
        })
        const values: Array<any> = [tableName];
        Object.keys(properties).forEach((columnsName: string) => values.push(properties[columnsName]));
        values.push(id);
        const insert = `UPDATE ? set ${columns.toString()} WHERE id = ?`;
        runQuery(insert, values).then(resolve).catch(reject);
    });
}

function get(tableName: string): Promise<any>;
function get(tableName: string, id: number): Promise<any>;
function get(tableName: string, properties: Array<string>, id: number): Promise<any>;
function get(tableName: string, properties: Array<string>): Promise<any>;
function get(tableName: string, condition: string, parameters: Array<any>): Promise<any>;
function get(tableName: string, properties: Array<string>, condition: string, parameters: Array<any>): Promise<any>;
function get(tableName: string, param1?: string | Array<string> | number, param2?: Array<any> | string | number, param3?: Array<any>) {
    return new Promise((resolve, reject) => {
        let properties = Array.isArray(param1) ? param1 : '*';
        let query = `SELECT ${properties} FROM ${tableName}`;
        let parameters = undefined;

        if (typeof (param1) === 'number') {
            if (param1.toString() === 'NaN') return reject('Not Found!');
            query = query + ' WHERE id = ?';
            parameters = [param1];
        };

        if (Array.isArray(param1) && typeof (param2) === 'number') {
            if (param2.toString() === 'NaN') return reject('Not Found!');
            query = query + ' WHERE id = ?';
            parameters = [param2];
        };

        if (typeof (param1) === 'string' && (typeof (param2) === 'undefined' || Array.isArray(param2))) {
            query = query + ' ' + param1;
            parameters = param2;
        };

        if (Array.isArray(param1) && typeof (param2) === 'string' && (typeof (param3) === 'undefined' || Array.isArray(param3))) {
            query = query + ' ' + param2;
            parameters = param3;
        };

        runQuery(query, parameters).then(resolve).catch(reject);
    });
}

function _delete(tableName: string, id: number) {
    return new Promise((resolve, reject) => {
        let query = `DELETE FROM ${tableName} WHERE id = ?`;
        runQuery(query, [id]).then(resolve).catch(reject);
    });
}


export default {
    runQuery,
    insert,
    update,
    get,
    delete: _delete
}