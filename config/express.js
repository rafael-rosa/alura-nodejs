/*
  O express load permite o carregamento dos modulos da aplicacao ja na inicializacao da applicacao.
  Como o app.js chama o express.js, a ideia e que aqui ele carregue os modulos que o app precisa.
  Isto evita ficar espalhando um monte de 'require' pela aplicacao
*/
var express 		= require("express");
var load 			= require("express-load");
var bodyParser 		= require("body-parser");
var methodOverride 	= require("method-override");
var expressValidator= require("express-validator");

module.exports = function(){

	var app = express();

	app.use(express.static("./app/public"));
	app.set("view engine","ejs");
	app.set("views","./app/views");

	/*
	  extented true permite fazer o tratamento de requisicoes de forms mais complexos (como objeto dentro de obj por exemplo) 

	  O use recebe funcoes que serao aplicadas ao request na ordem que definirmos. Isto e conhecido como Midleware.
	  o use aplica estas funcoes que serao executadas no momento em que a requisicao estiver trafegando da view (html) para o controller (rota)
	  req -> midlewareBodyParser -> midlewareDeAutenticacao -> funcao que trata a requisiao
	*/
	app.use(bodyParser.urlencoded({extended : true})); 
	app.use(bodyParser.json()); //necessario para receber um json no cadastro de produtos 
	app.use(expressValidator());

	/*
      É importante que essa chamada fique depois do uso do bodyParser,
      pois somente após os parâmetros da requisição serem devidamente
      incluídos nos devidos objetos é que o method_override poderá realizar
      “sua mágica”.
	*/
	app.use(methodOverride('_method'));

	/*
	  O express load carrega o objeto e ja instancia ele, chamando a funcao de inicializacao ()
	  No modulo de infra, que possui a conexao com o banco, isto pode nao ser o comportamento 
	  desejado, pois criara uma conexao com o banco ja na inicializacao. Por este motivo,
	  no objeto connectionFactory a funcao de inicializacao foi encapsulada em outra funcao (wrapper)
	*/
	load('routes',{cwd:'app'}) //passar o cwd facilita o trabalho do exprress-load que nao precisa procurar a pasta routes por toda as pastas
		.then('infra') //o cwd e opcional
		.into(app);

	/*Construindo nossos próprios middlewares.
	  O middleware que trata páginas não encontradas deve vir depois da função load que trata as rotas, porque o devemos dar a chance
	  de o sistema procurar a rota adequada.
	  Tem que colocar na ordem, caso contrário ele passa pelo middleware e ainda não vai ter acontecido nenhum erro.
	*/
	app.use(function(request,response,next){
		response.status(404).render('erros/404');
		next();
	});

	/*O middleware que trata exceções na aplicação (uma base de dados indisponível por ex) deve conter o parametro erro em primeiro
	  lugar, porque dai o express trata de direcionar automaticamente para a o middleware que tem 4 parametros. O erro deve ser o primeiro
	  parametro*/
	app.use(function(erros,request,response,next){
		/*No ambiente de producao exibe uma tela de erro amigável, nos demais exibe o erro para facilitar o debug*/
		if (process.env.NODE_ENV === 'production') {
			response.status(500).render('erros/500');
			return;
		}
		next(erros);
	});

	return app;
}