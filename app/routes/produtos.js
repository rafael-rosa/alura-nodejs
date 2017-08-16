//var connectionFactory = require('../infra/connectionFactory'); //Carregado pelo express-load

module.exports = function(app){
	//boa pratica: o nome da operacao ja indica o que sera retornado. Como o verbo de acesso e GET e a url e /produtos, da pra saber que serao retornados produtos
	app.get("/produtos",function(request,response,next){ //next é uma função que é o fluxo das funções que foram executadas no express:
		
		//var connection = connectionFactory(); //sem o require, connectionFactory nao existe mais neste contexto
		var connection = app.infra.connectionFactory(); //o express-load disponibiliza o objeto desta forma apos carrega-lo
		var produtosDAO = new app.infra.ProdutosDAO(connection); 
		/*
		  A ideia do new é realmente criar um novo contexto de uso para a estrutura que está no arquivo produtosBanco.js. 
		  Caso contrario, o this na classe produtosBanco iria referenciar um contexto global (do express load)
		  (this descontextualizado)
		*/

		produtosDAO.lista(function(err, results){

			if(err){
				return next(err);
				//Chamando a função next, pedimos para o express executar a próxima funcao na cadeia, como passamos uma exceção para ela,
				//o express vai executar justamente a função que lida com erros
			}

			/*
			  Conceito de content negotiation: o cliente pode especificar o tipo de retorno desejado
			  Essa é mais uma questão abarcada pelo protocolo e abraçada na integração do rest. 
			  Usando o Accept nós podemos pedir por diferentes formatos de resposta e isso é o que chamamos no rest de Content Negociation
			*/

			response.format({
				html : function(){
					//response.send(results);
		            response.render('produtos/lista', {lista: results});					
				},

				json : function(){
					response.json(results);
				}
				

			});

			connection.destroy();
        });

		//connection.end();
		
	});


	//O codigo responsavel por tratar as requisicoes do sistema e conhecido como CONTROLLER (ou handles)
	app.get("/produtos/form",function(request,response){
		response.render('produtos/form',{
									errosValidacao:{}
									,produto:{}
								});
	});

	/*
	  O nome da operacao deve seguir a seguinte boa pratica: url + verbo de acesso (post ou get)
	  na operacao abaixo (/produtos/salva) o ideal e que seja somente /produtos, porque o verbo de acesso (post) ja indica que esta sendo gravado algo
	  isto serve para integracoes que funcionam somente via http (REST por exemplo)
	*/
	app.post("/produtos",function(request,response,next){ 
	//Repare no app.post - o metodo de envio tem que ser igual ao do form
	//always redirect after post - Para evitar que caso a pagina seja recarregada, o navegador faca outro post e grave informacao duplicada na base

		var produto = request.body;

		/*validationErrors() esta deprecated
		var validadorTitulo = request.assert('titulo','Título é obrigatório');
		validadorTitulo.notEmpty();
		
		var erros = request.validationErrors();
		console.log(erros);
		if(erros){
			response.render('produtos/form');
			return;
		}
		console.log('Gravando o produto: ' + produto.titulo);

		var connection = app.infra.connectionFactory; 
		var produtosDAO = new app.infra.ProdutosDAO(connection); 

		produtosDAO.salva(produto,function(err, results){
            response.redirect('/produtos');
        });
		*/

		//Nova forma de validacao
		request.check('titulo','Título é obrigatório').notEmpty();
		request.check('preco','Formato inválido').isFloat();
		request.getValidationResult().then(function(result){
			if(!result.isEmpty()){
				//var util = require('util');
				//response.status(400).send('There have been validation errors: ' + util.inspect(result.array()));
				//console.log(util.inspect(result.array()));
				
				response.format({
					html : function(){
						response.status(400).render('produtos/form',{errosValidacao:result.array(),produto:produto});					
					},

					json : function(){
						response.status(400).send(result.array());
					}
					

				});				
				
      			return;
			}else{

				var connection = app.infra.connectionFactory(); 
				var produtosDAO = new app.infra.ProdutosDAO(connection); 
				/*
				Tem que ficar esperto com a natureza assincrona do node, porque eu havia colocado este bloco achando que o return 
				da validacao acima iria parar a execucao e ele nao tentaria gravar no banco caso houvesse erro de validacao. Nao funcionou.
				Tentei gravar o erro em uma variavel e depois checar se ela estaria diferente de nulo para nao gravar na base. Nao funcionou
				*/
				produtosDAO.salva(produto,function(err, results){
					if (err) {
						connection.destroy();
						return next(err);
					}
					connection.destroy();
		            response.redirect('/produtos');
		        });


			}
		});


	});

	// Devido ao valor “DELETE" que passamos no parâmetro “_method”, o method-override tratou a requisição 
	// para nós e chamou o método DELETE ao invés do POST original.
	app.delete("/produtos",function(request,response){ 
		var idProduto = request.body.id;

		//var util = require('util');
		//console.log('Excluindo o produto: ' + util.inspect(idProduto));

		var connection = app.infra.connectionFactory(); 
		var produtosDAO = new app.infra.ProdutosDAO(connection); 

		produtosDAO.exclui(idProduto,function(err, results, next){
			if(err){
				connection.destroy();
				return next(err);
			}
			connection.destroy();
            response.redirect('/produtos');
        });

	});
}