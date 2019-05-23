"use strict";

var ws 		= require('ws')
var Server 	= new ws.Server({port: _CONFIG.port})

var countConnections = 0

module.exports = Server


/*
*
*	When a new user connect
*
*/
Server.on('connection', function(Client) 
{

	
	/*
	*	When the user send a message
	*/
	Client.on('message', function(message){

		message = JSON.parse(message);

		/*
		*	We have some types of messages on 'message.type' and they can by:
		*	
		*	'username': The first thing what a client need send
		*	'typing': When the client is typing or not. Your value can by 'true' or 'false' when the user start and stop to typing
		*	'message': When the client send a message
		*	
		**/

		switch(message.type){
			case 'username':
			
				clientsArrayContent[Client.idCode].username = message.value
				
				Client.isBlocked 	= false
				Client.username 	= message.value

				if(_CONFIG.logLevel == "console" || _CONFIG.logLevel == "console-full")
					console.log("+ '" + Client.username + "' enter in the Chat. " + Server.clients.size + " online")
				else if(_CONFIG.logLevel == "list-users")
					printCurrentUsers()
			break;
			case 'typing':
				if(_CONFIG.logLevel == "console-full")
					if(message.value)
						console.log("'" + Client.username + "' esta digitando")
					else
						console.log("'" + Client.username + "' parou de digitar")
			break;
			case 'message':
				if(_CONFIG.logLevel == "console-full")
					console.log("New message from '" + Client.username + "': '" + message.value + "'")
			break;
		}

	})

	/*
	*	When the user disconnect
	*/
	Client.on('close', function(){
		

		clientsArrayContent.forEach(function(valueArray, keyArray){
			
			if(valueArray.isConnect != false){
				
				let fount = false

				Server.clients.forEach(function(valueServer, keyServer) {

					if(valueServer.idCode == valueArray.idCode)
						fount = true
				});

				if(fount == false){
					if(_CONFIG.logLevel == "console" || _CONFIG.logLevel == "console-full")
						console.log("- User '" + valueArray.username + "' disconnect! " + Server.clients.size + " online")
					
					valueArray.isConnect = false
				}
			}
		})

		if(_CONFIG.logLevel == "list-users")
			printCurrentUsers()
	})


	/*
	* 	When the user just connect to the WebSocket
	*/
	if(_CONFIG.logLevel == "console-full")
		console.log("A new user conneted! " + Server.clients.size + " online")
	
	Client.idCode = countConnections++

	Client.isBlocked = true // Block the user because he not send his name yet

	clientsArrayContent[Client.idCode] = {idCode: Client.idCode, isConnect: true}

})

if(_CONFIG.logLevel == "list-users"){
	printCurrentUsers(Server)
}


function printCurrentUsers() 
{

	console.clear()

	console.log("********************** USERS ONLINE NOW *****************************\n")
	console.log("Server running on " + _CONFIG.ip + ":" + _CONFIG.port)
	console.log("The web interface is avaliable at http://" + _CONFIG.ip + "..." )
	console.log("\n*********************** " +Server.clients.size + " online now ********************************\n")

	clientsArrayContent.forEach(function(value, key) {
		if(value.isConnect == true)
			console.log(value.idCode +": " + value.username)
	})

}