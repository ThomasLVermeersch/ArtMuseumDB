const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');


const db = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password: '',
	database: 'nodemysql'
});

//connect

db.connect((err) => {
	if(err){
		throw err;
	}
	console.log("MySQL connected...");
});

const app = express();

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Set static path
app.use(express.static(path.join(__dirname, 'public')));

//create art oject table
app.get('/createArtObjectsTable', (req, res) =>{
	let sql = 'CREATE TABLE ART_OBJECT(id int AUTO_INCREMENT,Artist varchar(255),Year int,Title varchar(255),Description text,Type varchar(255),Is_permanent int,Origin varchar(255), img varchar(255),Epoch varchar(255),PRIMARY KEY(id))';
	db.query(sql, (err, result)=>{
		if(err) throw err;
		console.log(result);
		res.send("ART_OBJECT table created")
	});
});
//Create db
app.get('/createdb', (req, res) =>{
	let sql = 'CREATE DATABASE nodemysql';
	db.query(sql, (err, result) => {
		if(err) throw err;
		console.log(result)
		res.send('database created');
	});
});

//Create all tables other than art object
app.get('/CreateTables', (req, res) => {
	let sql = ['CREATE TABLE PAINTING(id int,Paint_type varchar(255),paint_material varchar(255), style varchar(255), PRIMARY KEY(id))',
		'CREATE TABLE SCULPTURE(id int, Material varchar(255), height int, weight int, style varchar(255), PRIMARY KEY(id));',
		'CREATE TABLE STATUE(id int, Material varchar(255),height int,weight int,style varchar(255), PRIMARY KEY(id));',
		'CREATE TABLE OTHER(id int,type varchar(255),style varchar(255), PRIMARY KEY(id));',
		'CREATE TABLE PERMANENT_COLLECTION(id int,date_acquired date,status varchar(255),cost int, PRIMARY KEY(id));',
		'CREATE TABLE BORROWED_COLLECTION(id int,date_borrowed date, date_returned varchar(255), PRIMARY KEY(id));',
		'CREATE TABLE ARTIST(id int AUTO_INCREMENT, f_name varchar(255), date_born date, date_died date, origin_country varchar(255),a_epoch varchar(255),main_style varchar(255),description text, PRIMARY KEY(id));',
		'CREATE TABLE COLLECTIONS(id int AUTO_INCREMENT, name varchar(255),type varchar(255),description text,address varchar(255),phone varchar(255),contact_person varchar(255), PRIMARY KEY(id));',
		'CREATE TABLE EXHIBITION(id int AUTO_INCREMENT, name varchar(255), start_date date,end_date date, object_id int, PRIMARY KEY(id));',
		];
	for(var i = 0; i< sql.length; i++){
		db.query(sql[i], (err, result)=>{
			if(err) throw err;
			console.log(sql[i] + " " + result);
		});
	}
});

app.get('/getbyartist/:artist', (req, res) =>{
	let artist = req.params.artist;
	let sql = 'SELECT * FROM ARTIST WHERE f_name=?';
	let query = db.query(sql, artist, (err, result) => {
		if(err) throw err;
		console.log(result);
		res.json(result);
	});
})

app.get('/getartby/:artist', (req, res) =>{
	let artist = req.params.artist;
	let sql = 'SELECT * FROM ART_OBJECT WHERE artist=?';
	let query = db.query(sql, artist, (err, result) => {
		if(err) throw err;
		console.log(result);
		res.json(result);
	});
})

app.get('/getartist', (req, res) =>{
	let sql = 'SELECT * FROM ARTIST;';
	db.query(sql, (err, result)=> {
		if(err) throw err;
		console.log(result);
		res.json(result)
	});
});

app.post('/artist/add', (req, res) =>{
	var artist = {
		f_name : req.body.f_name,
		date_born : req.body.date_born,
		date_died : req.body.date_died,
		origin_country : req.body.origin_country,
		a_epoch : req.body.a_epoch, 
		main_style : req.body.main_style,
		description : req.body.a_description
	};
	let sql = 'INSERT INTO ARTIST SET ?';
	let query = db.query(sql, artist, (err, result) => {
		if(err) throw err;
		console.log(result);
	});
});

//add art
app.post('/art/add', (req, res) =>{
	var art_piece = {
		Artist : req.body.artist,
		Year : req.body.year,
		Title : req.body.title,
		Description : req.body.description, 
		Type : req.body.type,
		Is_permanent : parseInt(req.body.permanent),
		img : req.body.img,
		Origin : req.body.origin,
		Epoch : req.body.epoch
	};
	let sql = 'INSERT INTO ART_OBJECT SET ?';
	var lastID;
	let query = db.query(sql, art_piece, (err, result) => {
		if(err) throw err;
		nextQuery(result);
	});

	function setId(value){
		lastID = value;
	}
	function nextQuery(result){
		setId(result.insertId);
		var more_specific;
		var sql2;
		if(art_piece.Type == "statue"){
			sql2 = 'INSERT INTO STATUE SET ?';
			more_specific = {
				id : lastID,
				material : req.body.material,
				height: req.body.height,
				weight : req.body.weight,
				style : req.body.style
			}
		}
		if(art_piece.Type == "sculpture"){
			sql2 = 'INSERT INTO SCULPTURE SET ?';
			more_specific = {
				id : lastID,
				material : req.body.material,
				height: req.body.height,
				weight : req.body.weight,
				style : req.body.style
			}
		}
		if(art_piece.Type == "painting"){
			sql2 = 'INSERT INTO PAINTING SET ?';
			more_specific = {
				id : lastID,
				style: req.body.style,
				paint_type: req.body.paint_type,
				paint_material: req.body.paint_material
			}
		}
		if(art_piece.Type =="other"){
			sql2 = 'INSERT INTO OTHER SET ?';
			more_specific = {
				id : lastID,
				style : req.body.style,
				type : req.body.type2
			}
		}

		let query2 = db.query(sql2, more_specific, (err, result) => {
			if(err) throw err;
			console.log(result);
		});
		}

});

//add post
app.get('/addpost', (req, res) => {
	let post = {id: 100, type : 'type_test', style :'style_test'};
	let sql = 'INSERT INTO OTHER SET ?';
	let query = db.query(sql, post, (err, result) => {
		if(err) throw err;
		console.log(result);
		res.send('post added');
	});
});

//get the god exhibit

app.get('/getGodExhibit', (req, res) =>{
	let sql = 'SELECT * FROM ART_OBJECT JOIN EXHIBITION WHERE ART_OBJECT.id=EXHIBITION.object_id and EXHIBITION.name="The God"';
	let query = db.query(sql, (err,results) => {
		if(err) throw err;
		console.log(results);
		res.json(results);
	});
});

app.get('/getweekend', (req, res) =>{
	let sql = 'SELECT * FROM ART_OBJECT JOIN EXHIBITION WHERE ART_OBJECT.id=EXHIBITION.object_id and EXHIBITION.name="Ruined Sunday"';
	let query = db.query(sql, (err,results) => {
		if(err) throw err;
		console.log(results);
		res.json(results);
	});
});

//Add Artist
app.get('/addartist', (req, res) => {
	let post = {fname: "Thomas", lname: "Vermeersch", origin_country:"Antarctica", Epoch:"New", main_style:"SQL Bro", Description:"A Jabroni"};
	let sql = 'INSERT INTO ARTIST SET ?';
	let query = db.query(sql, post, (err, result) => {
		if(err) throw err;
		console.log(result);
		res.send('post added');
	});
});

//Add exhibits an objects to exhibit
app.get('/addExhibit', (req, res) => {
	let post = {name: "Ruined Sunday", object_id: 5};
	let sql = 'INSERT INTO EXHIBITION SET ?';
	let query = db.query(sql, post, (err, result) => {
		if(err) throw err;
		console.log(result);
		res.send('post added');
	});
});

//get posts

app.get('/getposts', (req, res) =>{
	let sql = '(SELECT Artist, Year, Title, Type, Description, img, Origin, Epoch, style FROM ART_OBJECT JOIN PAINTING ON ART_OBJECT.id=PAINTING.id) UNION'+
	'(SELECT Artist, Year, Title, Type, Description, img, Origin, Epoch, style FROM ART_OBJECT JOIN SCULPTURE ON ART_OBJECT.id=SCULPTURE.id) UNION'+
	'(SELECT Artist, Year, Title, Type, Description, img, Origin, Epoch, style FROM ART_OBJECT JOIN STATUE ON ART_OBJECT.id=STATUE.id) UNION'+
	'(SELECT Artist, Year, Title, "Normie Meme" as placeholder, Description, img, Origin, Epoch, style FROM ART_OBJECT JOIN OTHER ON ART_OBJECT.id=OTHER.id)';
	let query = db.query(sql, (err, results) => {
		if(err) throw err;
		console.log(results);
		res.json(results);
	});
});


//get all art objects
app.get('/getall', (req, res)=>{
	let sql = 'SELECT * FROM ART_OBJECT'
	let query = db.query(sql, (err, results) =>{
		if(err) throw err;
		console.log(results);
		res.json(results);
	});
});

//Get all paintings
app.get('/getpaintings', (req, res) =>{
	let sql = 'SELECT Artist, Year, Title, Type, Description, img, Origin, Epoch, style FROM ART_OBJECT JOIN PAINTING ON ART_OBJECT.id=PAINTING.id';
	let query = db.query(sql, (err, results) => {
		if(err) throw err;
		console.log(results);
		res.json(results);
	});
});

app.get('/getstatues', (req, res) =>{
	let sql = 'SELECT Artist, Year, Title, Type, Description, img, Origin, Epoch, style FROM ART_OBJECT JOIN STATUE ON ART_OBJECT.id=STATUE.id';
	let query = db.query(sql, (err, results) => {
		if(err) throw err;
		console.log(results);
		res.json(results);
	});
});

app.get('/getArtists', (req, res) => {
	let sql = 'SELECT * FROM ARTIST';
	let query = db.query(sql, (err, results) => {
		if(err) throw err;
		console.log(results);
		res.json(results);
	});
});

app.get('/getsculptures', (req, res) =>{
	let sql = 'SELECT Artist, Year, Title, Type, Description, img, Origin, Epoch, style FROM ART_OBJECT JOIN SCULPTURE ON ART_OBJECT.id=SCULPTURE.id';
	let query = db.query(sql, (err, results) => {
		if(err) throw err;
		console.log(results);
		res.json(results);
	});
});

app.get('/getother', (req, res) =>{
	let sql = 'SELECT Artist, Year, Title, "Normie Meme" as placeholder, Description, img, Origin, Epoch, style FROM ART_OBJECT JOIN OTHER ON ART_OBJECT.id=OTHER.id';
	let query = db.query(sql, (err, results) => {
		if(err) throw err;
		console.log(results);
		res.json(results);
	});
});

app.get('/dropdb', (req, res) =>{
	let sql = 'DROP DATABASE nodemysql';
	db.query(sql, (err, result) => {
		if(err) throw err;
		console.log(result)
		res.send('database dropped');
	});
});

app.get('/', (req, res) =>{
	res.render('index');
});

app.listen('3000', () =>{
	console.log('Server started on port 3000');
});