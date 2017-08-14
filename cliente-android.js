//Programa para simular diferentes tipos de requisicoes (html ou json por exemplo)

var http = require('http');
var configuracoes = {
	hostname	:'localhost',
	port 	 	:3000,
	path		:'/produtos',
	headers		:{
		'Accept':'text/html' //'text/html' ou 'application/json'
	}
};

http.get(configuracoes,function(res){
	
	console.log(res.statusCode);

	res.on('data',function(body){
		console.log('Corpo: ' + body); //Sem a string concatenada, o resultado e um binario
	});

});