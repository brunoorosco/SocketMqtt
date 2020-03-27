var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://localhost:1883')
var topic = ['casa/L1', 'casa/L2', 'casa/L3']
var texto;

client.on('connect', () => {
    
    client.subscribe(topic)

     texto = client.on('message', (topic, message, data) => {
        context = message.toString();
        console.log("sub : " + context, topic, data.cmd, data.payload)
    })
})

