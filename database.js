const fs = require('fs');
const Database = require('better-sqlite3');

class SQLiteDatabase {
	
	constructor(filePath, onCreateExecuteCallback) {
		
		this._filePath = filePath;
		this._onCreateExecuteCallback = onCreateExecuteCallback;
		
		const db = this._openConnection(filePath, onCreateExecuteCallback);
		
		this.isOpen = !!db;
		
		if (db) {
			db.close();
		}
		
		process.on('exit', () => this.close());
		process.on('SIGHUP', () => process.exit(128 + 1));
		process.on('SIGINT', () => process.exit(128 + 2));
		process.on('SIGTERM', () => process.exit(128 + 15));
		
	}
	
	_openConnection(filePath, onCreateExecuteCallback) {
		
		function initDb() {
			return new Database(filePath);
		}
		
		let db = undefined;
		
		try {
			
			if (!this.db) {
				
				if (onCreateExecuteCallback === false && !fs.existsSync(filePath)) {
					return false;
				}
				else if (onCreateExecuteCallback && !fs.existsSync(filePath)) {
					db = initDb();
					this.execute(onCreateExecuteCallback, db);
				}
				
			}
			
		}
		catch (err) {
			console.error(err);
		}
		
		return db || initDb();
		
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
		
		if (db) {
			
			db.close();
			
			if (this.db) {
				this.db = undefined;
			}
			
		}
		
	}
	
}

module.exports = {
	SQLiteDatabase: SQLiteDatabase
};
