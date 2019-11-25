import express from 'express';
import multer from 'multer';
const sqlite3 = require('sqlite3').verbose();

const app = express();
const upload = multer();

let db = new sqlite3.Database("./db/elections.db", err => {
	if (err) {
		console.error(err.message);
	}
	else {
		// Connected to database successfully
		console.log("Connected to the elections database.");
	}
});

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.get("/create", (req, res) => {
	res.json({ code: Math.round(Math.random() * 10) });
});

app.get("/vote", upload.none(), (req, res) => {
	
	const formData = req.body;
	
	let jsonData = JSON.parse(formData.data);
	
	res.json({ code: formData.code, data: jsonData });
	
});

app.listen(3000, () => {
	console.log("Scouts Elections Server app listening on port 3000!");
});
