const express = require('express');
const multer = require('multer');
// const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const https = require('https');

const app = express();
const upload = multer();

const PORT = 3001;

// let db = new sqlite3.Database("./db/elections.db", err => {
// 	if (err) {
// 		console.error(err.message);
// 	}
// 	else {
// 		// Connected to database successfully
// 		console.log("Connected to the elections database.");
// 	}
// });

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

// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/ved.ddnsfree.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/ved.ddnsfree.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/ved.ddnsfree.com/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

// Starting server
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
	console.log(`HTTPS : Scouts Elections Server app listening on port ${PORT}!`);
});
