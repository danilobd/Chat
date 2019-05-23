
_CONFIG = require("./config")


if(_CONFIG.logLevel == "console" || _CONFIG.logLevel == "console-full"){
  console.clear()
  console.log("******************************** " + _CONFIG.logLevel +" *************************\n")
  console.log(" Server running on " + _CONFIG.ip + ":" + _CONFIG.port)
  console.log(" The web interface is avaliable at http://" + _CONFIG.ip + "..." )
  console.log("\n***********************************************************************\n")
}


// The users informations object. Is needed to now who user is disconneted
clientsArrayContent = []

const WebSocket = require('./src/ws')

//console.log("Rodando...")