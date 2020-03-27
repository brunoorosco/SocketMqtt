const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const mosca = require('mosca')
const mqtt = require('mqtt');
const bodyParser = require('body-parser');


var mqtt_url = process.env.CLOUDMQTT_URL || 'mqtt://192.168.10.105:1883';
var client = mqtt.connect(mqtt_url);

///// PORTA express
const PORT = 3005
const app = express();
app.use(express.json());


//configuração do mosca
var settings = {
    port: 1883,
    type: 'mqtt',
 }
var broker = new mosca.Server(settings);

const Broker = require('./src/mqtt/broker')
const publish = require('./src/mqtt/publish')

//variavel de Leitura do Broker
Broker(broker);

const server = http.createServer(app);
const io = socketIO(server)

//SERVIÇO DE SOCKET
function ws(inf) {
    io.sockets.emit('infoEvent', inf)
}


io.on('connection', socket => {
    console.log('New user connected.');

    socket.on('infoEvent', (informacao) => {
        console.log(informacao)
        io.sockets.emit('infoEvent', informacao)
    })

    socket.on('disconnect', () => {
        console.log('User disconnected')
    })

})



///aqui eu envio a informação via websocket utilizando link 
app.get('/', (req, res) => {
    ws("teste")
})

///funciona a publicação
app.get('/d', (req, res) => {
    ws("novo")
    var message = {
        topic: 'casa/L2',
        payload: '0', // or a Buffer
        qos: 0, // 0, 1, or 2
        retain: false // or true
    };
    publish(broker, message)
    res.writeHead(204, { 'Connection': 'keep-alive' }); //informação retorna para o cliente de executado mas não retorno conteudo
    res.end();
})
server.listen(PORT, () => console.log(`Servidor rodando porta ${PORT}`))