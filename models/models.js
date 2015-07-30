var path=require('path');
//cargar modelo ORM
// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;


// Cargar Modelo ORM
var Sequelize=require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

// Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);
//exportar la definición de la tabla por si la requieren otras partes del código
exports.Quiz=Quiz; // exportar tabla Quiz
//aplicar la propiedad sync de sequelize para crear e inicializar la tabla de preguntas en la DB. Esto ocurrirá si no existen registros previos (count=0)

sequelize.sync().then(function(){
	Quiz.count().then(function(count){
		if (count===0){
			Quiz.create({pregunta: 'Capital de Italia',   respuesta: 'Roma', tematica:'otro'});
			Quiz.create({pregunta: 'Capital de Portugal', respuesta: 'Lisboa', tematica:'otro'})
			.then(function(){console.log('DB inicializada')});
		};
	});
});
