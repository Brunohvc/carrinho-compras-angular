const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 4201;
const api = require('./api/index');
console.clear();

function logger(req, res, next) {
    console.log('URL:', req.url);
    next();
}

function notFound(req, res) {
    const initUrl = req.url.substr(0, 5);
    console.log('initUrl:', initUrl);
    if (initUrl == '/api/') {
        res.status(404).send('Not Found Api!');
    } else {
        res.sendFile(path.resolve(__dirname, 'public/build/', 'index.html'));
    }
}

app.use(logger);
app.use('/api/', api);
app.use(express.static(path.join(__dirname, 'public/build/')));
app.use(notFound);


app.listen(port);
console.log('Server started at http://localhost:' + port);