const { ElectionController } = require('./app');
const cors = require('cors');
const express = require('express');

exports.setup = (app, route) => {
	
	app.post(route('/create'), express.json({ limit: '3mb' }), cors(), ElectionController.create);
	
	app.options(route('/*'), cors());
	
	app.get(route('/:electionCode([A-Z1-9]{6})/join'), cors(), ElectionController.join);
	
	app.put(route('/:electionCode([A-Z1-9]{6})/vote'), express.json({ limit: '10kb' }), cors(), ElectionController.vote);
	
	app.put(route('/:electionCode([A-Z1-9]{6})/skip'), cors(), ElectionController.skip);
	
	app.get(route('/:electionCode([A-Z1-9]{6})/retrieve'), cors(), ElectionController.retrieve);
	
	app.delete(route('/:electionCode([A-Z1-9]{6})/delete'), cors(), ElectionController.delete);
	
}
