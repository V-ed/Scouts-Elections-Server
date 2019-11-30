// const sqlite3 = require('sqlite3').verbose();

// let db = new sqlite3.Database(`${__dirname}/db/elections.db`, err => {
// 	if (err) {
// 		console.error(err.message);
// 	}
// 	else {
// 		// Connected to database successfully
// 		console.log("Connected to the elections database.");
// 	}
// });

class ElectionController {
	
	static create(req, res) {
		
		const formData = req.body;
		
		let jsonData = JSON.parse(formData.data);
		
		res.json({ code: Math.round(Math.random() * 10), data: jsonData });
		
	}
	
	static vote(req, res) {
		res.json({ code: req.params.electionCode });
	}
	
	static retrieve(req, res) {
		res.send("Hello World!");
	}
	
}

module.exports = {
	ElectionController: ElectionController
};
