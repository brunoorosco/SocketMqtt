const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const mosca = require('mosca')
const mqtt = require('mqtt');
const bodyParser = require('body-parser');
var topic = 'casa/L1';

var mqtt_url = process.env.CLOUDMQTT_URL || 'mqtt://192.168.10.105:1883';
var client = mqtt.connect(mqtt_url);

///// PORTA express
const PORT = 3005
const app = express();
app.use(express.json());

//responsavel pelo MQTT
var broker = new mosca.Server(settings);
//configuração do mosca
var settings = {
    port: 1883,
    type: 'mqtt',
}
//variavel de Leitura do Broker
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


broker.on('clientConnected', function () {
    app.get('/publish', function (req, res) {

        var topic = req.query.topic
        var msg = req.query.id


        client.publish(topic, msg, function () {
            console.log('clientPublished', msg);
            ws(msg)
            res.writeHead(200, { 'Connection': 'keep-alive' });
            res.end();
        });
    });
})


// //SERVIÇO DE LEITURA DO BROKER
// broker.on('ready', function () {
//     console.log("ready Broker ok!");
//     //  var sub = require('./src/mqtt/sub');

// });

// broker.on('clientConnected', function (client) {
//     var sub = require('./src/mqtt/sub');

// });

// //enviar informações Mqtt Publish
// broker.on('published', function (packet, client) {
//     console.log('Published', packet.payload.toString());
// });

// broker.subscribe(topic, (client, message, text) =>{
//     console.log("subsBroker : " + message, client, text)
// }
// )

// broker.on('message', (topic, message) => {
//    context = message.toString();
//    console.log("subsBroker : " + context)
// })

///aqui eu envio a informação via websocket utilizando link 
app.get('/', (req, res) => {
    ws("teste")
})

//funciona a publicação
app.get('/d', (req, res) => {
    ws("novo")
    var message = {
        topic: 'casa/L2',
        payload: 'abcde', // or a Buffer
        qos: 0, // 0, 1, or 2
        retain: false // or true
    };

    broker.publish(message, function () {
        console.log(message);
    });
    res.writeHead(204, { 'Connection': 'keep-alive' }); //informação retorna para o cliente de executado mas não retorno conteudo
    res.end();
})
server.listen(PORT, () => console.log(`Servidor rodando porta ${PORT}`))