const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

class SQLiteDatabase {
	
	constructor(filePath) {
		
		this._filePath = filePath;
		
		try {
			this.isNew = !fs.existsSync(filePath);
		}
		catch (err) {
			console.error(err);
		}
		
	}
	
	_openConnection(filePath) {
		
		return new sqlite3.Database(filePath, err => {
			if (err) {
				console.error(err.message);
			}
		});
		
	}
	
	get() {
		
		if (!this.db) {
			this.db = this._openConnection(this._filePath);
		}
		
		clearTimeout(this._timeout);
		this._timeout = setTimeout(() => {
			this.close();
		}, 1 * 1000 * 60 * 60);
		// Above math is the total milliseconds for an hour
		
		return this.db;
		
	}
	
	execute(callback) {
		
		if (!callback) {
			throw "Callback parameter is required for this function to run.";
		}
		
		if (!this.db) {
			this.db = this._openConnection(this._filePath);
		}
		
		callback(this.db);
		
		this.close();
		
	}
	
	close() {
		
		clearTimeout(this._timeout);
		
		if (this.db) {
			
			this.db.close(err => {
				if (err) {
					console.error(err.message);
				}
			});
			
			this.db = undefined;
			
		}
		
	}
	
}

module.exports = {
	SQLiteDatabase: SQLiteDatabase
};
