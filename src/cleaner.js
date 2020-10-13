import cron from 'cron';
import { SQLiteDatabase } from './database.js';
import { __dirname } from './variables.js';

const { CronJob } = cron;

const job = new CronJob(
    '0 * * * *',
    () => {
        const dbWrapper = new SQLiteDatabase(`${__dirname}/db/elections.db`);
        
        if (dbWrapper.isOpen) {
            dbWrapper.execute(db => {
                try {
                    db.prepare(`DELETE FROM elections WHERE last_used < datetime('now', '-1 day', 'localtime')`).run();
                } catch (error) {
                    console.log(error);
                }
            });
        }
    }
);

export function startCleanerCron() {
    job.start();
}

export default startCleanerCron;
