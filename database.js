const fs = require('fs');
const Database = require('better-sqlite3');

class SQLiteDatabase {
	
	constructor(filePath, onCreateExecuteCallback) {
		
		this._filePath = filePath;
		
		try {
			if (onCreateExecuteCallback && !fs.existsSync(filePath)) {
				this.execute(onCreateExecuteCallback);
			}
		}
		catch (err) {
			console.error(err);
		}
		
		process.on('exit', () => this.close());
		
	}
	
	_openConnection(filePath) {
		return new Database(filePath);
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
		
		const db = this.db || this._openConnection(this._filePath);
		
		callback(db);
		
		this.close(db);
		
	}
	
	close(db) {
		
		clearTimeout(this._timeout);
		
		if (!db) {
			db = this.db;
		}
		
		if (this.db) {
			
			this.db.close();
			this.db = undefined;
			
		}
		
	}
	
}

module.exports = {
	SQLiteDatabase: SQLiteDatabase
};
