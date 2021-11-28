import sqllite from '../database/sql-lite';
import md5 from 'md5';

function startDatabase(): Promise<any>;
function startDatabase(insertFirstRows?: boolean | undefined) {
    return new Promise((resolve, reject) => {
        const listCreateTables: Array<Promise<any>> = [];
        listCreateTables.push(createUsers(insertFirstRows));

        Promise.all(listCreateTables).finally(() => resolve(undefined));
    });
}

function createUsers(insertFirstRows: boolean | undefined) {
    return new Promise((resolve, reject) => {
        const tableName = 'Users';
        const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name text, 
        email text UNIQUE, 
        password text, 
        CONSTRAINT email_unique UNIQUE (email)
        )`;

        if (insertFirstRows) {
            sqllite.runQuery(createTableQuery)
                .then(createTableResult => {
                    let user1 = {
                        name: 'Bruno',
                        email: 'bruno.carvalho@email.com',
                        password: md5('Bruno'),
                    };
                    let user2 = {
                        name: 'Henrique',
                        email: 'henrique.carvalho@email.com',
                        password: md5('Henrique'),
                    };
                    const user1Promise = sqllite.insert(tableName, user1);
                    const user2Promise = sqllite.insert(tableName, user2);

                    Promise.all([user1Promise, user2Promise]).finally(() => {
                        resolve(undefined)
                    });
                });
        } else {
            resolve(undefined);
        }
    });
}

export default startDatabase;