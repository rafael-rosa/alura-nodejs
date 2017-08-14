/*executar definindo a var de ambiente no Windows: 
1.set NODE_ENV=test ou development  -- Vai definir a var de ambiente somente daquele prompt de comando
2.node node_modules\mocha\bin\mocha
*/

var express = require('../config/express')(); 
//Estamos na pasta test e precisamos entrar na pasta config. Usamos () porque o express exporta uma funcao, se não a executarmos, não podemos usá-lo
var request = require('supertest')(express);

describe('#ProdutosController',function(){

	function limpaTabela(callback){
		/*Se nosso sistema tivesse várias tabelas, seria inviável limpá-las uma a uma. Pra isto existem bibliotecas como a NODE-DATABASE-CLEANER*/
		var conn = express.infra.connectionFactory();
		conn.query("delete from produtos",callback);
	}


	beforeEach(function(done){
		/*
		var conn = express.infra.connectionFactory();
		conn.query("delete from produtos",function(ex,results){
			if (!ex) {
				done();
			}
		});*/
		limpaTabela(function(ex,results){
			if (!ex) {
				done();
			}
		});
	});

	afterEach(function(done){
		limpaTabela(function(ex,results){
			if (!ex) {
				done();
			}
		});
	});

	it('#listagem json',function(done){

		request.get('/produtos')
			.set('Accept','application/json')
			.expect('Content-Type',/json/) // /json/ é uma expressao regular - verifica se tem json na resposta
			.expect(200,done)  // o supertest já é integrado com o mocha e chama a função done (funcao de finalizacao) quando terminar
	});

	it('#listagem html',function(done){

		request.get('/produtos')
			.set('Accept','text/html')
			.expect('Content-Type',/html/) 
			.expect(200,done) 
	});

	it('#cadastro de novo produto com dados invalidos',function(done){

		request.post('/produtos')
			.send({titulo:"",descricao:"novo livro de teste"})
			.expect(400,done) 
	});

	it('#cadastro de novo produto com dados validos',function(done){

		request.post('/produtos')
			.send({titulo:"livro de supertest",descricao:"novo livro de teste",preco:20.50})
			.expect(302,done) 
	});
});



/*OLD - Repare que o código do teste está muito poluído com codigos da requisicao http
var http = require('http');
var assert = require('assert');
*/
/*Utilizamos a lib assert para poder escrever o teste de maneira mais verbosa, sem ifs e tal ela também solta exceções que são entendidas por 
  todos os modulos de testes do mercado (jasmine, mocha e etc)*/
/*
describe('#ProdutosController',function(){
	it('#listagem json',function(done){
		var configuracoes = {
			hostname	:'localhost',
			port 	 	:3000,
			path		:'/produtos',
			headers		:{
				'Accept':'application/json' //'text/html' ou 'application/json'
			}
		};

		http.get(configuracoes,function(res){
			assert.equal(res.statusCode,200);
			assert.equal(res.headers['content-type'],'application/json; charset=utf-8') 
*/
			//['content-type'] precisa estar entre colchetes e aspas porque é uma propriedade que possui '-'' no nome
			//console.log(res.headers);
//			done(); 
			/*Done e uma funcao de finalizacao (vazia) que so e chamada quando as funcoes assincronas dentro do "it" finalizarem
		  	sem ela, o teste ia terminar sempre com sucesso, porque ao fazer a requisicao http assincrona, o node nao ia esperar ela finalizar
		  	e iria completar o teste.
		  	A função de finalização é necessária por causa do funcionamento assíncrono do Node.js. 
		  	Caso ela não seja utilizada é possível que o Mocha tente rodar o relatório final antes de realmente ter terminado
		  	a execução das funcionalidades testadas.
			*/
/*
		});
	});
});
*/