const Broker = (broker) => {
    //responsavel pelo MQTT
    // var broker = new appBroker.Server(settings);
    // //configuração do mosca
    // var settings = {
    //     port: 1883,
    //     type: 'mqtt',
    // }

    //SERVIÇO DE LEITURA DO BROKER
    broker.on('ready', () => {
        console.log("ready Broker ok!");
       // var sub = require('./sub');
    });

    broker.on('clientConnected', (client) => {       
        console.log("New conect Client : " + client.id )
    });

    //enviar informações Mqtt Publish
    broker.on('published', (packet) => {
        console.log('brokerPublished: ', packet.topic +' - ' + packet.payload.toString());
      
    });

    // broker.subscribe("", (client, message, text) => {
    //     console.log("subsBroker : " + message, client, text)
    // });
}

module.exports = Broker