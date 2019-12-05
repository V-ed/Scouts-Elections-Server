const { SQLiteDatabase } = require('./database');

const dbWrapper = new SQLiteDatabase(`${__dirname}/db/elections.db`, db => {
	db.run('CREATE TABLE elections(id text PRIMARY KEY, data text NOT NULL, picture text, numberOfJoined DEFAULT 0)');
});

function createCode(length) {
	
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
	const charactersLength = characters.length;
	
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
	
}

class ElectionController {
	
	static create(req, res) {
		
		const formData = req.body;
		
		if (!formData) {
			// No data given in multipart form, send missing data error.
			res.status(400);
			res.send('No data given!');
			
		}
		else {
			
			let code;
			
			const db = dbWrapper.get();
			
			do {
				
				code = createCode(6);
				
				const sqlGetRowQuery = "SELECT id FROM elections WHERE id = ?";
				
				db.get(sqlGetRowQuery, [code], (err, row) => {
					
					if (err) {
						return console.error(err);
					}
					
					// If a row is present, code is invalid
					if (row) {
						code = undefined;
					}
					
				});
				
			} while (!code);
			
			let jsonData = JSON.parse(formData.data);
			
			const pictureData = jsonData.groupImage;
			delete jsonData.groupImage;
			
			const dbJsonData = JSON.stringify(jsonData);
			
			db.run(`INSERT INTO elections(id, data, picture) VALUES(?, ?, ?)`, [code, dbJsonData, pictureData]);
			
			res.json({ code: code, data: jsonData });
			
		}
		
	}
	
	static join(req, res) {
		res.json({ code: req.params.electionCode });
	}
	
	static vote(req, res) {
		res.json({ code: req.params.electionCode });
	}
	
	static retrieve(req, res) {
		res.json({ code: req.params.electionCode });
	}
	
}

module.exports = {
	ElectionController: ElectionController
};
