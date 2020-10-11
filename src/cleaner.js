import { SQLiteDatabase } from './database.js';
import { CronJob } from 'cron';

const job = new CronJob(
    '0 * * * *',
    () => {
        const dbWrapper = new SQLiteDatabase(`${__dirname}/db/elections.db`);
        
        if (dbWrapper.isOpen) {
            dbWrapper.execute(db => {
                db.prepare('DELETE FROM elections WHERE last_used < datetime(\'now\', \'-1 day\', \'localtime\')').run();
            });
        }
    }
);

export function startCleanerCron() {
    job.start();
}

export default startCleanerCron;
