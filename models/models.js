var path=require('path');
//cargar modelo ORM
var Sequelize=require('sequelize');
//usar DB
var sequelize=new Sequelize(null, null, null, {
	dialect:"sqlite",
	storage: "quiz.sqlite"
});
//importar la definici�n de quiz.js
var Quiz=sequelize.import(path.join(__dirname, 'quiz'));
//exportar la definici�n de la tabla por si la requieren otras partes del c�digo
exports.Quiz=Quiz;
//aplicar la propiedad sync de sequelize para crear e inicializar la tabla de preguntas en la DB. Esto ocurrir� si no existen registros previos (count=0)

sequelize.sync().then(function(){
	Quiz.count().then(function(count){
		if (count===0){
			Quiz.create({
				pregunta:'Capital de Italia',
				respuesta:'Roma'
			})
			.then(function(){console.log('DB inicializada')});
		};
	});
});