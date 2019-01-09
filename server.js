var server = require("ws").Server; 
var s = new server({port: 5001}); // s = Lista de todos usuários conectados

console.log("Rodando...");

var online = 0;

const cores = ['#b13b3b', '#1662a6', '#8c36a4', '#b13b94', '#70a231', '#3bb1a4'];

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

s.on('connection', function(ws) {
	
	ws.on('message', function(message){ // ws = Conexão particular de cada um

		message = JSON.parse(message);

		if(message.type == "message"){

			console.log("Mensagem Recebida de #" + ws.clientsid + ": " + message.value);
	
			s.clients.forEach(function e(client){
				if(client != ws){
					//client.send(message.value);
					client.send(JSON.stringify({
						type: 'message',
						value: message.value,
						username: ws.username,
						idCliente: ws.clientsid,
						clientcolor: ws.clientcolor,
						image: message.image,
					}));
				}
			});

		}else if(message.type == "username"){
			if(message.value)
				ws.username = message.value;
			else
				ws.username = "Sem nome #" + ws.clientsid;

			s.clients.forEach(function e(client){
				if(client != ws){
					client.send(JSON.stringify({
						type: 'notice',
						value: ws.username +' entrou',
						amountOnline: (online-1),
					}));
				}else{
					client.send(JSON.stringify({
						type: 'notice',
						value: 'Você entrou',
						amountOnline: (online-1),
					}));
				}
			});

		}else if(message.type == "typing"){

			if(message.value == true){
				console.log(ws.username + " está digitando...");
				s.clients.forEach(function e(client){
					if(client != ws){
						client.send(JSON.stringify({
							type: 'istyping',
							username: ws.username,
							typing: true,
						}));
					}
				});
			}else{
				console.log(ws.username + " parou de digitar...");
				s.clients.forEach(function e(client){
					if(client != ws){
						client.send(JSON.stringify({
							type: 'istyping',
							username: ws.username,
							typing: false,
						}));
					}
				});
			}

		}
		
	});

	ws.on('close', function(){
		online--;
		console.log(" - Cliente desconectado! --Online: " + online);

		s.clients.forEach(function e(client){
			client.send(JSON.stringify({
				type: 'notice',
				value: 'Alguem saiu',
				amountOnline: (online-1),
			}));
		});

	});

	online++;
	ws.clientsid = online;

	var colornumber = parseInt(getRandomArbitrary(0, cores.length));
	ws.clientcolor = cores[colornumber];

	ws.send(JSON.stringify({
		type: 'notice',
		value: 'AVISO: Nenhuma mensagem é salva aqui. Quando sair do chat todas mensagens serão perdidas',
		amountOnline: (online-1),
	}));

	console.log(" + Novo Cliente conectado! #" + ws.clientsid + " --Online: " + online);

})

