const { ElectionController } = require('./app');
const { sync } = require('./queuer');
const cors = require('cors');
const express = require('express');

exports.setup = (app, route) => {
	
	app.options(route('/'), cors());
	app.options(route('/*'), cors());
	
	app.get(route('/'), cors(), ElectionController.home);
	
	app.post(route('/create'), express.json({ limit: '3mb' }), cors(), sync(), ElectionController.create);
	
	app.get(route('/join/:electionCode([A-NP-Z1-9]{6})'), cors(), sync(), ElectionController.join);
	
	app.put(route('/vote/:electionCode([A-NP-Z1-9]{6})'), express.json({ limit: '10kb' }), cors(), sync(), ElectionController.vote);
	
	app.get(route('/seat/:electionCode([A-NP-Z1-9]{6})'), cors(), sync(), ElectionController.takeSeat);
	
	app.put(route('/skip/:electionCode([A-NP-Z1-9]{6})'), cors(), sync(), ElectionController.skip);
	
	app.get(route('/retrieve/:electionCode([A-NP-Z1-9]{6})'), cors(), sync(), ElectionController.retrieve);
	
	app.delete(route('/delete/:electionCode([A-NP-Z1-9]{6})'), cors(), sync(), ElectionController.delete);
	
}
