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