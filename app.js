const multer = require('multer');
// const sqlite3 = require('sqlite3').verbose();

const upload = multer();

// let db = new sqlite3.Database(`${__dirname}/db/elections.db`, err => {
// 	if (err) {
// 		console.error(err.message);
// 	}
// 	else {
// 		// Connected to database successfully
// 		console.log("Connected to the elections database.");
// 	}
// });

exports.setup = (app, webroot) => {
	
	app.get(`${webroot}`, (req, res) => {
		res.send("Hello World!");
	});
	
	app.get(`${webroot}/create`, (req, res) => {
		res.json({ code: Math.round(Math.random() * 10) });
	});
	
	app.get(`${webroot}/vote`, upload.none(), (req, res) => {
		
		const formData = req.body;
		
		let jsonData = JSON.parse(formData.data);
		
		res.json({ code: formData.code, data: jsonData });
		
	});
	
}
