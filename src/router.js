import { ElectionController } from './app.js';
import { sync } from './queuer.js';
import cors from 'cors';
import express from 'express';

/**
 * @param {import("express").Express} app
 * @param {{ (path: string): string; (arg0: string): any; }} route
 */
export function setup(app, route) {
	
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
