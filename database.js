const fs = require('fs');
const Database = require('better-sqlite3');

class SQLiteDatabase {
	
	constructor(filePath, onCreateExecuteCallback) {
		
		this._filePath = filePath;
		this._onCreateExecuteCallback = onCreateExecuteCallback;
		
		this._openConnection(filePath, onCreateExecuteCallback).close();
		
		process.on('exit', () => this.close());
		
	}
	
	_openConnection(filePath, onCreateExecuteCallback) {
		
		const db = new Database(filePath);
		
		try {
			if (onCreateExecuteCallback && !this.db && !fs.existsSync(filePath)) {
				this.execute(onCreateExecuteCallback, db);
			}
		}
		catch (err) {
			console.error(err);
		}
		
		return db;
		
	}
	
	get() {
		
		if (!this.db) {
			this.db = this._openConnection(this._filePath, this._onCreateExecuteCallback);
		}
		
		clearTimeout(this._timeout);
		this._timeout = setTimeout(() => {
			this.close();
		}, 1 * 1000 * 60 * 60);
		// Above math is the total milliseconds for an hour
		
		return this.db;
		
	}
	
	execute(callback, database) {
		
		if (!callback) {
			throw "Callback parameter is required for this function to run.";
		}
		
		const db = database || this.db || this._openConnection(this._filePath, this._onCreateExecuteCallback);
		
		callback(db);
		
		if (!database) {
			this.close(db);
		}
		
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
