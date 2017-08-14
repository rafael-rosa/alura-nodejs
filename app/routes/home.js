module.exports = function(app){
	app.get('/',function(request,response,next){

		console.log('abrindo a home');

		var connection = app.infra.connectionFactory();
		var produtosDAO = new app.infra.ProdutosDAO(connection); 

		produtosDAO.lista(function(error,results){
			if (error) {
				return next(error);
			}
			response.render('home/index',{livros : results});
		});
		connection.end();
	});
}