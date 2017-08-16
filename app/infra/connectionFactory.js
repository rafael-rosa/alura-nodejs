var mysql = require("mysql");

function createDBConnection(){
	if (!process.env.NODE_ENV || process.env.NODE_ENV === 'dev') { //Se nao defini o ambiente (== null), considere como DEV
		//=== compara dois valores CONSIDERANDO o tipo de dado ex: '1' === 1 = falso / '1' == 1 = verdadeiro
		return mysql.createConnection({
				host:'w7bdvm',
				user:'root',
				password:'1234',
				database:'casadocodigo_nodejs'
			});
	}
	if (process.env.NODE_ENV == 'test') {
		return mysql.createConnection({
				host:'w7bdvm',
				user:'root',
				password:'1234',
				database:'casadocodigo_nodejs_test'
			});
	}
	if (process.env.NODE_ENV == 'production') { //heroku define automaticamente como production

		//Se deixarmos os dados da conexao com o BD chapados no codigo e 
		//subirmos nosso projeto em um repositorio publico, todos terao acesso ao banco!!
		var urlDeConexao = process.env.CLEARDB_DATABASE_URL;
		var dadosConexao = urlDeConexao.match(/mysql:\/\/(.*):(.*)@(.*)\/(.*)\?reconnect=true/);
		/*
		Explicando a regex: toda regex deve comecar com / e finalizar com /
			1.Vai começar com mysql: com duas // escapadas \/\/
			2.Depois das barras vem o login (.*) indica que queremos pegar este grupo que tem qualquer caracter 
			  repetido um numero x de vezes até encontrar o :
			3.Depois dos : vem um outro grupo de caracteres que queremos pegar que é a senha (ate o @)
			4.Depois vem o host ate a /
			5.Depois vem o nome do banco (ate o ?)

			O match devolve um array e a primeira posicao e a string inteira, entao a 0 = 1
		*/

		return mysql.createConnection({
				host:dadosConexao[3],
				user:dadosConexao[1],
				password:dadosConexao[2],
				database:dadosConexao[4],
				connectionLimit: 60, /*default 10*/
				connectTimeout: 1000000,
        		/*queueLimit: 30,*/
				acquireTimeout: 1000000
			});
	}
}

/*
  O express load carrega o objeto e ja instancia ele, chamando a funcao de inicializacao ()
  No modulo de infra, que possui a conexao com o banco, isto pode nao ser o comportamento 
  desejado, pois criara uma conexao com o banco ja na inicializacao. Por este motivo,
  no objeto connectionFactory a funcao de inicializacao foi encapsulada em outra funcao (wrapper)
*/
module.exports = function(){
	return createDBConnection;

	//return createDBConnection();
	/*
	  Cuidado para nao exportar a conexao aberta, mas sim a funcao que cria a conexao. 
	  Isto causaria problemas porque uma unica conexao circularia pelo sistema inteiro, 
	  e qualquer connection.end faria a aplicacao parar de funcionar
	  No seu código dentro no return da função do module.exports, você está executando a função createDBConnection(). 
	  Já no código do Ícaro ele não executa a função createDBConnection. Essa é a diferença do seu código para o do Ícaro.
	  Por favor, retire os parênteses que vem depois da função para você retorno a a função em vez da execução da mesma.
	*/
}