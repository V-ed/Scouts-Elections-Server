const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const upload = multer();

let db = new sqlite3.Database('./db/elections.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the elections database.');
});

app.get('/', function (req, res) {
	res.send('Hello World!');
});

app.get('/create', function (req, res) {
	res.json({ code: Math.round(Math.random() * 10) });
});

app.get('/vote', upload.none(), function (req, res) {
	
	const formData = req.body;
	
	let jsonData = JSON.parse(formData.data);
	
	res.json({ code: formData.code, data: jsonData });
	
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});
