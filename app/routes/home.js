module.exports = function(app){
	app.get('/',function(request,response,next){

		//var connection = app.infra.connectionFactory();
		//var produtosDAO = new app.infra.ProdutosDAO(connection); 
		var produtosDAO = new app.infra.ProdutosDAO(app); 

		produtosDAO.lista(function(error,results){
			if (error) {
				return next(error);
			}
			response.render('home/index',{livros : results});
		});
		//connection.end();
	});
}