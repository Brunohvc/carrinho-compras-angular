import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import apiRoutes from './api-routes';
import startDatabase from './config/start-database/sql-lite-start';
import sqllite from './config/database/sql-lite';


const app = express();
app.use(bodyParser.json())
const port = process.env.PORT || 4201;
console.clear();

startDatabase().then(() => {
    sqllite.get('Users').then(result => {
        console.log('RESULT GET:', result);
    })
});


function logger(req: Request, res: Response, next: NextFunction) {
    console.log('URL:', req.url);
    next();
}

function notFound(req: Request, res: Response) {
    const initUrl = req.url.substr(0, 5);
    if (initUrl == '/api/') {
        res.status(404).send('Not Found Api!');
    } else {
        res.sendFile(path.resolve(__dirname, 'public/build/', 'index.html'));
    }
}

app.use(logger);
app.use('/api/', apiRoutes);
app.use(express.static(path.join(__dirname, 'public/build/')));
app.use(notFound);


app.listen(port);
console.log('Server started at http://localhost:' + port);