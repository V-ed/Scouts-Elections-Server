const { SQLiteDatabase } = require('./database');

const dbWrapper = new SQLiteDatabase(`${__dirname}/db/elections.db`, db => {
	db.prepare("CREATE TABLE elections(id TEXT PRIMARY KEY, numberOfJoined INTEGER DEFAULT 0, lastUsed DATE DEFAULT (datetime('now','localtime')), numberOfDownload INTEGER DEFAULT 0, data TEXT NOT NULL, picture TEXT)").run();
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
				
				const row = db.prepare("SELECT id FROM elections WHERE id = ?").get(code);
				
				// If row present, code is invalid
				if (row) {
					code = undefined;
				}
				
			} while (!code);
			
			let jsonData = JSON.parse(formData.data);
			
			const pictureData = jsonData.groupImage;
			delete jsonData.groupImage;
			
			const dbJsonData = JSON.stringify(jsonData);
			
			db.prepare("INSERT INTO elections(id, data, picture) VALUES(?, ?, ?)").run(code, dbJsonData, pictureData);
			
			res.json({ code: code, data: jsonData });
			
		}
		
	}
	
	static join(req, res) {
		
		const db = dbWrapper.get();
		
		const code = req.params.electionCode;
		
		const row = db.prepare("SELECT * FROM elections WHERE id = ?").get(code);
		
		if (row) {
			
			db.prepare("UPDATE elections SET numberOfJoined = numberOfJoined + 1, lastUsed = (datetime('now','localtime')) WHERE id = ?").run(code);
			
			const electionData = JSON.parse(row.data);
			
			electionData.groupImage = row.picture;
			
			res.json({ code: code, data: electionData });
			
		}
		else {
			res.status(400);
			res.send(`No election with code ${code} found!`);
		}
		
	}
	
	static vote(req, res) {
		res.json({ code: req.params.electionCode });
	}
	
	static retrieve(req, res) {
		
		const code = req.params.electionCode;
		
		const db = dbWrapper.get();
		
		const row = db.prepare("SELECT * FROM elections WHERE id = ?").get(code);
		
		if (row) {
			
			if (req.method != "DELETE") {
				db.prepare("UPDATE elections SET numberOfDownload = numberOfDownload + 1, lastUsed = (datetime('now','localtime')) WHERE id = ?").run(code);
			}
			
			const electionData = JSON.parse(row.data);
			
			electionData.groupImage = row.picture;
			
			res.json({ code: code, data: electionData });
			
			return true;
			
		}
		else {
			
			res.status(400);
			res.send(`No election with code ${code} found!`);
			
			return false;
			
		}
		
	}
	
	static delete(req, res) {
		
		const hasRetrieved = ElectionController.retrieve(req, res);
		
		if (hasRetrieved) {
			
			dbWrapper.get().prepare("DELETE FROM elections WHERE id = ?").run(req.params.electionCode);
			
		}
		
	}
	
}

module.exports = {
	ElectionController: ElectionController
};
