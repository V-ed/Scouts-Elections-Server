import express from 'express';
import dateFormat from 'dateformat';
import { setup } from '../src/router.js';

const app = express();

const PORT_HTTP = 5678;

/**
 * @param {string} path
 */
const router = path => {
    const resolvedPath = path == '/' ? '' : path;
    
    return `/${resolvedPath}`;
};

setup(app, router);

// All other routes will lead to a 404 Not Found error
app.use(function(req, res) {
    res.status(404).end();
});

app.listen(PORT_HTTP, () => {
    const currentDateText = dateFormat(new Date(), 'dddd, mmmm dS, yyyy, h:MM:ss TT');
    
    console.log(`[${currentDateText}] Listening for HTTP requests on port ${PORT_HTTP}!`);
});
