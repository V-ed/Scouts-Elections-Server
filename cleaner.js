import { SQLiteDatabase } from './src/database.js';

const dbWrapper = new SQLiteDatabase(`${__dirname}/db/elections.db`);

if (dbWrapper.isOpen) {
    dbWrapper.execute(db => {
        db.prepare('DELETE FROM elections WHERE last_used < datetime(\'now\', \'-1 day\', \'localtime\')').run();
    });
}

process.exit();
