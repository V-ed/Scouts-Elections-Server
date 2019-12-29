const { SQLiteDatabase } = require('./database');

const dbWrapper = new SQLiteDatabase(`${__dirname}/db/elections.db`, db => {
	db.pragma("encoding = 'UTF-16'");
	db.pragma("auto_vacuum = FULL");
	db.pragma("foreign_keys = ON");
	db.prepare("CREATE TABLE photos(id INTEGER PRIMARY KEY ASC, data TEXT DEFAULT NULL)").run();
	db.prepare(`
		CREATE TABLE elections(
					id TEXT PRIMARY KEY,
					number_of_joined INTEGER DEFAULT 0,
					last_used DATE DEFAULT (datetime('now', 'localtime')),
					photo_id INTEGER DEFAULT NULL,
					data TEXT NOT NULL,
					CONSTRAINT fk_photos FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE
		)
	`).run();
	
	db.prepare(`
		CREATE TRIGGER delete_photo
		AFTER DELETE ON elections
		WHEN NOT EXISTS (SELECT 1 FROM elections WHERE photo_id = OLD.photo_id)
		BEGIN
			DELETE FROM photos WHERE id = OLD.photo_id;
		END;
	`).run();
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
	
	static home(req, res) {
		
		res.status(200);
		res.send('This is the Scouts Elections API!');
		
	}
	
	static create(req, res) {
		
		const formData = req.body;
		
		if (!formData) {
			// No data given in body, send missing data error.
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
			
			const photoData = formData.groupImage;
			delete formData.groupImage;
			
			const jsonData = JSON.stringify(formData);
			
			const photoId = function() {
				
				if (!photoData) {
					return undefined;
				}
				
				const existingPhotoRow = db.prepare("SELECT id FROM photos WHERE data = ?").get(photoData);
				
				if (existingPhotoRow) {
					return existingPhotoRow.id;
				}
				
				return db.prepare("INSERT INTO photos(data) VALUES(?)").run(photoData).lastInsertRowid;
				
			}();
			
			db.prepare("INSERT INTO elections(id, data, photo_id) VALUES(?, ?, ?)").run(code, jsonData, photoId);
			
			res.json({ code: code, data: formData });
			
		}
		
	}
	
	static join(req, res) {
		
		const db = dbWrapper.get();
		
		const code = req.params.electionCode;
		
		const row = db.prepare("SELECT elections.data, photos.data AS photo_data FROM elections LEFT JOIN photos ON elections.photo_id = photos.id WHERE elections.id = ?").get(code);
		
		if (row) {
			
			db.prepare("UPDATE elections SET number_of_joined = number_of_joined + 1, last_used = (datetime('now', 'localtime')) WHERE id = ?").run(code);
			
			const electionData = JSON.parse(row.data);
			
			electionData.groupImage = row.photo_data;
			
			res.json({ code: code, data: electionData });
			
		}
		else {
			res.status(400);
			res.send(`No election with code ${code} found!`);
		}
		
	}
	
	static vote(req, res) {
		
		const formData = req.body;
		
		if (!formData) {
			// No data given in body, send missing data error.
			res.status(400);
			res.send('No data given!');
			
		}
		else {
			
			const code = req.params.electionCode;
			
			const db = dbWrapper.get();
			
			const row = db.prepare("SELECT data FROM elections WHERE id = ?").get(code);
			
			if (row) {
				
				const electionData = JSON.parse(row.data);
				
				let votersArray = formData;
				
				for (let i = 0; i < votersArray.length; i++) {
					
					const voterIndex = votersArray[i];
					
					electionData.candidates[voterIndex].voteCount++;
					
				}
				
				electionData.numberOfVoted++;
				
				const stringifiedData = JSON.stringify(electionData);
				
				db.prepare("UPDATE elections SET last_used = (datetime('now', 'localtime')), data = ? WHERE id = ?").run(stringifiedData, code);
				
				res.json({ data: electionData });
				
			}
			else {
				
				res.status(400);
				res.send(`No election with code ${code} found!`);
				
			}
			
		}
		
	}
	
	static takeSeat(req, res) {
		
		const code = req.params.electionCode;
		
		const db = dbWrapper.get();
		
		const row = db.prepare("SELECT data FROM elections WHERE id = ?").get(code);
		
		if (row) {
			
			const electionData = JSON.parse(row.data);
			
			electionData.numberOfSeatsTaken = electionData.numberOfSeatsTaken ? electionData.numberOfSeatsTaken + 1 : 1;
			
			const stringifiedData = JSON.stringify(electionData);
			
			db.prepare("UPDATE elections SET last_used = (datetime('now', 'localtime')), data = ? WHERE id = ?").run(stringifiedData, code);
			
			res.json({ data: electionData });
			
		}
		else {
			
			res.status(400);
			res.send(`No election with code ${code} found!`);
			
		}
		
	}
	
	static skip(req, res) {
		
		const code = req.params.electionCode;
		
		const db = dbWrapper.get();
		
		const row = db.prepare("SELECT data FROM elections WHERE id = ?").get(code);
		
		if (row) {
			
			const electionData = JSON.parse(row.data);
			
			electionData.hasSkipped = true;
			
			const stringifiedData = JSON.stringify(electionData);
			
			db.prepare("UPDATE elections SET last_used = (datetime('now', 'localtime')), data = ? WHERE id = ?").run(stringifiedData, code);
			
			res.json({ data: electionData });
			
		}
		else {
			
			res.status(400);
			res.send(`No election with code ${code} found!`);
			
		}
		
	}
	
	static retrieve(req, res, isForDeletion) {
		
		const code = req.params.electionCode;
		
		const db = dbWrapper.get();
		
		const hasRequestedImage = "groupImage" in req.query;
		
		const query = hasRequestedImage ? "SELECT elections.data, photos.data AS photo_data FROM elections LEFT JOIN photos ON elections.photo_id = photos.id WHERE elections.id = ?" : "SELECT data FROM elections WHERE id = ?";
		
		const row = db.prepare(query).get(code);
		
		if (row) {
			
			if (isForDeletion !== true) {
				db.prepare("UPDATE elections SET last_used = (datetime('now', 'localtime')) WHERE id = ?").run(code);
			}
			
			const electionData = JSON.parse(row.data);
			
			const queryKeys = Object.keys(req.query);
			
			let finalData = undefined;
			
			if (queryKeys.length > 0) {
				
				finalData = {};
				
				queryKeys.forEach(queryKey => finalData[queryKey] = electionData[queryKey]);
				// Also manually add photo if requested
				if (hasRequestedImage) {
					finalData.groupImage = row.photo_data;
				}
				
			}
			else {
				finalData = electionData;
			}
			
			res.json({ code: code, data: finalData });
			
			return true;
			
		}
		else {
			
			res.status(400);
			res.send(`No election with code ${code} found!`);
			
			return false;
			
		}
		
	}
	
	static delete(req, res) {
		
		const hasRetrieved = ElectionController.retrieve(req, res, true);
		
		if (hasRetrieved) {
			
			dbWrapper.get().prepare("DELETE FROM elections WHERE id = ?").run(req.params.electionCode);
			
		}
		
	}
	
}

module.exports = {
	ElectionController: ElectionController
};
