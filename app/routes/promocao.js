module.exports = function(app){

	app.get("/promocoes/form",function(request,response,next){

		var connection = app.infra.connectionFactory();
		var produtosDAO = new app.infra.ProdutosDAO(connection);

		produtosDAO.lista(function(error,results){
			if(error){
				return next(error);
			}
			response.render('promocoes/form',{lista:results});
		});

	});

	app.post("/promocoes",function(request,response){

		var promocao = request.body;
		var connection = app.infra.connectionFactory();
		var produtosDAO = new app.infra.ProdutosDAO(connection);
		var io = app.get('io');

		produtosDAO.consulta(promocao.livro.id,function(error,results){
			if(results.length > 0){
				promocao.titulo = results[0].titulo;
			
				console.log(promocao);
				io.emit('novaPromocao',promocao);
			}

		});

		response.redirect('promocoes/form');

	});

}