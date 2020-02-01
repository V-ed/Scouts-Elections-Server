const express = require('express');

const app = express();

const PORT_HTTP = 5678;

const scoutElectionModule = require('../router');

const router = path => {
	const resolvedPath = path == '/' ? '' : path;
	return `/${resolvedPath}`;
}

scoutElectionModule.setup(app, router);

// All other routes will lead to a 404 Not Found error
app.use(function(req, res) {
	res.status(404).end();
});

app.listen(PORT_HTTP, () => {
	
	const dateFormat = require('dateformat');
	const currentDateText = dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT");
	
	console.log(`[${currentDateText}] Listening for HTTP requests on port ${PORT_HTTP}!`);
	
});
