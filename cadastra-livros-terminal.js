var http = require('http');
var configuracoes = {
	hostname	:'localhost',
	port 	 	:3000,
	path		:'/produtos',
	method		:'post',
	headers		:{
		'Accept':'application/json', //'text/html' ou 'application/json'
		'Content-Type':'application/json'
	}
};

var client = http.request(configuracoes,function(res){
	
	console.log(res.statusCode);

	res.on('data',function(body){
		console.log('Corpo: ' + body); //Sem a string concatenada, o resultado e um binario
	});

});

var produto = {
	titulo		: 'livro de node com http e javascript',
	descricao	: 'Livro muito legal',
	preco		: ''
};

client.end(JSON.stringify(produto)); //e aqui que a requisicao e de fato enviada.