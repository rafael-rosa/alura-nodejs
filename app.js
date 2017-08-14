/*executar definindo a var de ambiente no Windows: 
1.set NODE_ENV=test ou development 
2.node app
*/
var app = require("./config/express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
/*
  O socket io exporta uma funcao que espera um handler de request de requisicoes. A funcao base do express e justamente isto. 
  Porem, ele precisa de um handler do próprio nodejs (http.Server instance)
*/

//var rotasProdutos = require("./app/routes/produtos")(app); //Carregado via express-load

app.set('io',io); //estamos fazendo isto para poder disponibilizar o objeto do socket io para toda a aplicacao (promocao.js)

//Apos passar o express como parametro para o http, podemos chamar a funcao listen do http ao inves da funcao do express (app.listen)
http.listen(3000,function(){
	console.log("Servidor rodando");
});