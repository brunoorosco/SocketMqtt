
const Broker = (broker, message) => {
  
      //  console.log(broker, message)
   broker.publish(message, function () {
      // console.log(message);
    });

}

module.exports = Broker