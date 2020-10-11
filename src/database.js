import fs from 'fs';
import DatabaseConstructor from 'better-sqlite3';

export class SQLiteDatabase {
	
	/**
	 * @param {string} filePath
	 * @param {false | ((db: import('better-sqlite3').Database) => *)} [onCreateExecuteCallback]
	 */
	constructor(filePath, onCreateExecuteCallback) {
		
		// Math below is the total milliseconds for an hour
		this.timeout = 1 * 1000 * 60 * 60;
		
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
	
	/**
	 * @param {string} filePath
	 * @param {false | ((db: import('better-sqlite3').Database) => *)} [onCreateExecuteCallback]
	 */
	_openConnection(filePath, onCreateExecuteCallback) {
		
		function initDb() {
			return new DatabaseConstructor(filePath);
		}
		
		/** @type { import('better-sqlite3').Database } */
		let db = undefined;
		
		try {
			
			if (!this.db) {
				
				if (onCreateExecuteCallback === false && !fs.existsSync(filePath)) {
					return;
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
		
		clearTimeout(this._closingTimeout);
		this._closingTimeout = setTimeout(() => {
			this.close();
		}, this.timeout);
		
		return this.db;
		
	}
	
	/**
	 * 
	 * @param {(db: import('better-sqlite3').Database) => *} callback 
	 * @param {import('better-sqlite3').Database} [database] 
	 */
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
	
	/**
	 * 
	 * @param {import('better-sqlite3').Database} [db] 
	 */
	close(db) {
		
		clearTimeout(this._closingTimeout);
		
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

export default SQLiteDatabase;
