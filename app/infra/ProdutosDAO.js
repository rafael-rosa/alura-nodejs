/*
Chamando o arquivo de ProdutosDAO, estamos seguindo uma convencao da orientacao a objetos
*/
/*Desativado para utilizacao do pool de conexoes
function ProdutosDAO(connection){
	//this._connection = usar _ no nome de um atributo e uma convencao js para indicar que o atributo e privado e nao deve ser acessado por fora da classe
	this._connection = connection;
}
//prototype adiciona propriedades na estrutura padrao da classe. Neste caso adiciona uma propriedade que e uma funcao
//desta maneira evita que o node crie a estutura dinamicamente desta funcao toda vez que e feito um new (menos performatico)
ProdutosDAO.prototype.lista = function(callback){
	this._connection.query('select * from produtos',callback); //funciona sem o return tambem
}

ProdutosDAO.prototype.salva = function(produto,callback){
	//var util = require('util');
	//console.log('Gravando o produto: ' + util.inspect(produto));
	this._connection.query('insert into produtos set ?',produto,callback); //O set e suportado pelo driver do MySql que estamos usando
	//return this._connection.query('insert into produtos (titulo, preco, descricao) values (?, ?, ?)',  [produto.titulo, produto.preco, produto.descricao], callback);
}

ProdutosDAO.prototype.exclui = function(id,callback){
	this._connection.query('delete from produtos where id = ?',  [id], callback);
}

ProdutosDAO.prototype.consulta = function(id,callback){
	this._connection.query('select * from produtos where id = ?',  [id], callback);
}
*/

function ProdutosDAO(app) {
    this._app = app;
}

ProdutosDAO.prototype.lista = function(callback) {
    this._app.infra.connectionFactory(function(err, connection) {
        connection.query('select * from produtos', function(erros, results) {
            connection.release();
            callback(erros,results);
        });
    });
};

ProdutosDAO.prototype.salva = function(produto, callback) {
    this._app.infra.connectionFactory(function(err, connection) {
        connection.query('insert into produtos set ?', produto, function(erros, results) {
            connection.release();
            callback(erros,results);
        });
    });
};

ProdutosDAO.prototype.exclui = function(id,callback){
    this._app.infra.connectionFactory(function(err, connection) {
        connection.query('delete from produtos where id = ?',  [id], function(erros, results) {
            connection.release();
            callback(erros,results);
        });
    });
};

ProdutosDAO.prototype.consulta = function(id,callback){
    this._app.infra.connectionFactory(function(err, connection) {
        connection.query('select * from produtos where id = ?',  [id], function(erros, results) {
            connection.release();
            callback(erros,results);
        });
    });
};

module.exports = function(){
	return ProdutosDAO;
};


/*
A ideia era passar connection como parametro da funcao exports, mas o express-load carrega o modulo e passa o objeto do express
como parametro, o que daria erro. Explicação:
O problema é que o express-load já chama o que é atribuído ao export, no caso, a função. Mas, ele chama passando um objeto do express. Quando abrimos o produtosBanco.js temos o connection que na verdade é objeto do express e tenta chamar um método query que não está definido no objeto do express. Por isso, recebemos uma mensagem falando que está ocorrendo um erro.
Portanto, é preciso dar uma enganada no express-load. Dessa maneira, no arquivo produtosBanco.js nós vamos criar uma função que retorna uma outra função e essa sim receberá a connection como argumento!

module.exports = function(){
    return function(connection){
        this.lista = function(callback){
            connection.query('select * from produtos',callback);
        }
    return this;    
    };
}
*/