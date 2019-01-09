function playNotifySound() {

	var audio = document.getElementById('turnDownForWhat');

	if (!audio) {
		var body = document.getElementsByTagName('body')[0];
		audio = document.createElement('audio');
		audio.volume = 1;
		audio.id = 'turnDownForWhat';
		audio.setAttribute('src', 'notify.mp3');
		audio.style.display = "none";
		body.append(audio);
	}

	audio.play();

};

function verifyNotify() {
  // Verifica se o browser suporta notificações
  if (!("Notification" in window)) {
    alert("Este browser não suporta notificações de Desktop");
  }
  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      console.log("Usuário aceitou notificações");
    });
  }else if (Notification.permission == 'denied') {
  	alert("Você negou aviso de novas mensagens :(");
  }

  // At last, if the user has denied notifications, and you 
  // want to be respectful there is no need to bother them any more.
}
verifyNotify();


function notifyMe(title, text) {
  
	playNotifySound();

  	if (Notification.permission === "granted") {
		//var notification = new Notification("Hi there!");
		var opcoes = {
	    	body: text,
	    	//icon: icone
	    	lang: 'pt-BR',
	  	}
	  	var n = new Notification(title,opcoes);
	}

	Notification.onclick = function(event) {
		myWindow.focus();
	}

}

// http://jsfiddle.net/LhEEE/1/
var hidden, visibilityChange;

function verifyVisibility(){

	if (typeof document.hidden !== "undefined") {
	    hidden = "hidden";
	    visibilityChange = "visibilitychange";
	} else if (typeof document.mozHidden !== "undefined") {
	    hidden = "mozHidden";
	    visibilityChange = "mozvisibilitychange";
	} else if (typeof document.msHidden !== "undefined") {
	    hidden = "msHidden";
	    visibilityChange = "msvisibilitychange";
	} else if (typeof document.webkitHidden !== "undefined") {
	    hidden = "webkitHidden";
	    visibilityChange = "webkitvisibilitychange";
	}
}
verifyVisibility();

document.addEventListener(visibilityChange, acao, false);

function acao() {
    console.log("Visivel: " + document.hidden);
}

function cretateMessage(TEXTVALUE, TYPE, USERNAME, COLOR, IMAGE){
	
	/* 

	<li class="notice">Notificação teste</li>
	
	<li class="me">
		<div>Oi</div>
	</li>

	<li class="otherperson">
			<div class='nomedapessoa'>Danilo</div>
			<br>
			<div>Oi</div>
	</li>

	<li class="otherperson">
		<div class='nomedapessoa'>Danilo</div>
		<div class="msgimg"><img src="http://localhost/chat/10686.jpg" alt=""></div>
		<div>Oi</div>
	</li>

	*/

	// Cria o <li>
	var node 		= document.createElement("LI");       // Create a <li> node

	// Coloca a classe no <li>
	if(TYPE == 1)
		node.classList.add("notice");
	else if(TYPE == 2)
		node.classList.add("otherperson");
	else if(TYPE == 3)
		node.classList.add("me");

	// Verifica se tem o usuário
	if(USERNAME && TYPE == 2){
		// Cria a <div> que contém o nome do usuário
		var nomedapessoaDiv = document.createElement('DIV');
		
		// Coloca a classe na <div>
		nomedapessoaDiv.classList.add("nomedapessoa");

		// Cria o texto com o nome da pessoa
		var nomedapessoa = document.createTextNode(USERNAME);

		// Coloca o texto dentro da <div>
		nomedapessoaDiv.appendChild(nomedapessoa);

		// Coloca a <div><li>Nome</li></div> dentro do <li>
		node.appendChild(nomedapessoaDiv);
		
		// Cria um <br> e coloca depois da div do nome
		node.appendChild(document.createElement('BR'));
	}

	if(IMAGE){
		
		// Cria <div> de imagem
		var imageDiv = document.createElement('DIV');
		
		// Adiciona a classe na <div>
		imageDiv.classList.add("msgimg");

		// Cria a tag IMG
		var imageTag = document.createElement('IMG');

		// Adiciona a imagem na tag IMG
		imageTag.setAttribute("src", IMAGE);

		// Coloca <img> dentro da <div>
		imageDiv.appendChild(imageTag);

		// Adiciona a div na mensagem
		node.appendChild(imageDiv);
	}

	// Cria a <div> que fica a menssagem
	var textDiv = document.createElement('DIV');

	// Cria o texto da menssagem
	var textnode 	= document.createTextNode(TEXTVALUE);
	
	// Coloca o texto dentro da <div>
	textDiv.appendChild(textnode);

	// Coloca a <div>texto</div> no <li>
	node.appendChild(textDiv);
	
	// Coloca a cor no <li>
	if(COLOR)
		node.style.backgroundColor = COLOR;

	// Pega e coloca o <li> dentro da div que fica as menssagens
	var contentbox = document.getElementById("contentbox")
	contentbox.appendChild(node);
}

//var sock = new WebSocket("ws://localhost:5001");
var sock;
function conect(){
	sock = new WebSocket("ws://192.168.1.47:5001");
	//cretateMessage("Tentado conectar...", 1);
	console.log("Tentado conectar...");
}

conect();

var UserNome;

sock.onopen = function(event) {
	console.log("conectado");
	cretateMessage("Conectado", 1);
	document.getElementById("texto").disabled = false;
	document.getElementById("enviar").disabled = false;

	UserNome = prompt("Qual é seu nome?");

	sock.send(JSON.stringify({
		type: 'username',
		value: UserNome,
	}));

}

sock.onclose = function(event) {
	console.log("desconectado");
	cretateMessage("Desconectado", 1);
	document.getElementById("texto").disabled = true;
	document.getElementById("enviar").disabled = true;
	document.getElementById("onlinevalue").value = 0;
	conect();
}

function sendMenssage(TEXT, IMG){
	
	sock.send(JSON.stringify({
		type: 'message',
		value: TEXT,
		image: IMG,
	}));
}

function stopTyping(){
	console.log("Parou de digitar...");
	sock.send(JSON.stringify({
		type: 'typing',
		value: false,
	}));
}

function startTyping(e) {

	console.log(e);

	if(e.keyCode != 13){

		console.log("Digitando...");		
		sock.send(JSON.stringify({
			type: 'typing',
			value: true,
		}));
		clearTimeout(this.interval);
		this.interval = setTimeout(stopTyping, 1000);

	}

	
}

document.getElementById("texto").addEventListener("keypress", startTyping, false);


sock.onmessage = function(event){

	var responce = JSON.parse(event.data);

	if(responce.type == "message"){

		cretateMessage(responce.value, 2, responce.username, responce.clientcolor, responce.image);

		if (document.hidden) {
			notifyMe(responce.username + " mandou mensagem", responce.value);
		}else{
			contentbox.scrollTop = contentbox.scrollHeight;
		}

	}else if(responce.type == "notice"){
		console.log(responce.value);
		cretateMessage(responce.value, 1);
		contentbox.scrollTop = contentbox.scrollHeight;
		
	}else if(responce.type == "istyping"){
		var digi = document.getElementById("typing")
		
		if(responce.typing == true){
			digi.style.display = "block";
			digi.innerText = responce.username + " está digitando...";
		}else{
			digi.style.display = "none";
			digi.innerText = responce.username + " parou de digitando...";
		}
	}
	else{
		alert('não é mensagem');
	}

	if(responce.amountOnline){
		document.getElementById("onlinevalue").innerText = responce.amountOnline;
	}

};

document.getElementById('form').addEventListener("submit", function(event){
	
	event.preventDefault();

	var text = document.getElementById('texto');
	
	if(text.value == ""){
		return false;
	}

	cretateMessage(text.value, 3, UserNome);

	sendMenssage(text.value);
	
	contentbox.scrollTop = contentbox.scrollHeight;

	text.value = '';

});

function Filecontent_upload(fileArea) {
	
	var self = this;

	this.fileArea = fileArea;

	this.init = function() {
	  // Registrando eventos de drag and drop
	  self.fileArea.addEventListener("dragleave", self.dragHover, false);
	  self.fileArea.addEventListener("dragover", self.dragHover, false);
	  self.fileArea.addEventListener("drop", self.drop, false);

	};

	this.dragHover = function(e) {
	  // Impede possíveis tratamentos dos arquivos
	  // arrastados pelo navegador, por exemplo, exibir
	  // o conteudo do mesmo.
	  e.stopPropagation();  
	  e.preventDefault();  

	  // Quando o arquivo está sobre área alteramos o seu estilo
	  self.fileArea.className = (e.type == "dragover" ? "hover" : "");  
	};

	this.drop = function(e) {
	  self.dragHover(e);  

	  // Volta um array com os arquivos arratados,
	  // porém neste exemplo iremos tratar apenas
	  // o primeiro arquivo
	  self.file = e.dataTransfer.files[0];  
	 
	  self.read(self.file);
	  
	};

	// Esse método irá ler o arquivo na memória,
	// depois iremos mostrá-lo no nosso content_upload
	this.read = function(file) {
	  // Iremos ler apenas imagens nesse exemplo
	  // e iremos exibi-lo no content_upload
	  if (file.type.match("image.*")) {
	    var reader = new FileReader();

	    // Callback que será executado após a leitura do arquivo
	    reader.onload = function(f) {

	      cretateMessage("", 3, UserNome, "", f.target.result);
	      sendMenssage("", f.target.result);

	    }

	    // Irá ler o arquivo para ser acessado através de uma url
	    reader.readAsDataURL(file);
	  }
	}

}

var area = document.getElementById("contentbox");

var filecontent_uploadArea = new Filecontent_upload(area);
filecontent_uploadArea.init();