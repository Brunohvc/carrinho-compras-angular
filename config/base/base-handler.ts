import sqllite from '../database/sql-lite';

function createBaseHandler(options: { tableName: string }) {
    function insert(properties: { [key: string]: any }) {
        return sqllite.insert(options.tableName, properties);
    }

    function update(id: number, properties: { [key: string]: any }) {
        return sqllite.update(options.tableName, id, properties);
    }

    function _delete(id: number) {
        return sqllite.delete(options.tableName, id);
    }

    function get(): Promise<any>;
    function get(id: number): Promise<any>;
    function get(properties: Array<string>, id: number): Promise<any>;
    function get(properties: Array<string>): Promise<any>;
    function get(condition: string, parameters: Array<any>): Promise<any>;
    function get(properties: Array<string>, condition: string, parameters: Array<any>): Promise<any>;
    function get(param1?: string | Array<string> | number, param2?: Array<any> | string | number, param3?: Array<any>) {
        console.log(param1, param2, param3);
        if (typeof (param1) === 'undefined' && typeof (param2) === 'undefined' && typeof (param3) === 'undefined') {
            return sqllite.get(options.tableName);
        }
        if (typeof (param1) === 'number') {
            return sqllite.get(options.tableName, param1);
        }
        if (Array.isArray(param1) && typeof (param2) === 'number') {
            return sqllite.get(options.tableName, param1, param2);
        }
        if (Array.isArray(param1) && typeof (param2) === 'undefined' && typeof (param3) === 'undefined') {
            return sqllite.get(options.tableName, param1);
        }
        if (typeof (param1) === 'string' && Array.isArray(param2) && typeof (param3) === 'undefined') {
            return sqllite.get(options.tableName, param1, param2);
        }
        if (Array.isArray(param1) && typeof (param2) === 'string' && Array.isArray(param3)) {
            return sqllite.get(options.tableName, param1, param2, param3);
        }

        const error = new Error('Something as wrong when try get');
        return Promise.reject(error);
    }

    return {
        runQuery: sqllite.runQuery,
        insert,
        update,
        delete: _delete,
        get,
    };
}


export default createBaseHandler;