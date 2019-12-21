const { ElectionController } = require('./app');
const cors = require('cors');
const express = require('express');

exports.setup = (app, route) => {
	
	app.options(route('/*'), cors());
	
	app.post(route('/create'), express.json({ limit: '3mb' }), cors(), ElectionController.create);
	
	app.get(route('/join/:electionCode([A-Z1-9]{6})'), cors(), ElectionController.join);
	
	app.put(route('/vote/:electionCode([A-Z1-9]{6})'), express.json({ limit: '10kb' }), cors(), ElectionController.vote);
	
	app.get(route('/seat/:electionCode([A-Z1-9]{6})'), cors(), ElectionController.takeSeat);
	
	app.put(route('/skip/:electionCode([A-Z1-9]{6})'), cors(), ElectionController.skip);
	
	app.get(route('/retrieve/:electionCode([A-Z1-9]{6})'), cors(), ElectionController.retrieve);
	
	app.delete(route('/delete/:electionCode([A-Z1-9]{6})'), cors(), ElectionController.delete);
	
}
