const app = require('../src/app');
const http = require('http');
const express = require('express');

const port = normalizePort(process.env.PORT || 3000);
app.set('port', port);

const server = http.createServer(app);
// const router = express.Router();

// const route = router.get('/', (req, res, next) => {
//     res.status(200).send({ 
//         title: "OK",
//         versão: "0.0.0.0.1.1"
//     });
// });

// app.use('/', route);

server.listen(port);
server.on('listenning', onListenning);
console.log("API rodando na porta:" + port);

function normalizePort(value){
    const port = parseInt(value, 10);
    if (isNaN(port)) {
        return value;
    }
    if (port >= 0) {
        return port;
    }    
    return false;
}

function onListenning(){
    const addr = server.address();
    const bind = typeof add === 'string'?
        'pipe ' + addr : 'port' + addr.port;

}