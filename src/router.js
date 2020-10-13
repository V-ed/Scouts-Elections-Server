import cors from 'cors';
import express from 'express';
import { ElectionController } from './app.js';
import { sync } from './queuer.js';
import startCleanerCron from './cleaner.js';

/**
 * @param {import("express").Express} app
 * @param {(path: string) => string} route
 */
export function setup(app, route) {
    startCleanerCron();
    
    app.options(route('/'), cors());
    app.options(route('/*'), cors());
    
    app.get(route('/'), cors(), ElectionController.home);
    
    app.post(route('/create'), express.json({ limit: '3mb' }), cors(), sync(), ElectionController.create);
    
    app.post(route('/create-virtual'), express.json({ limit: '3mb' }), cors(), sync(), ElectionController.createVirtual);
    
    app.get(route('/join/:electionCode([A-NP-Z1-9]{6})'), cors(), sync(), ElectionController.join);
    
    app.get(route('/join-virtual/:electionCode([A-NP-Z1-9]{6})'), cors(), sync(), ElectionController.joinVirtual);
    
    app.put(route('/vote/:electionCode([A-NP-Z1-9]{6})'), express.json({ limit: '10kb' }), cors(), sync(), ElectionController.vote);
    
    app.put(route('/vote-virtual/:electionCode([A-NP-Z1-9]{6})'), express.json({ limit: '10kb' }), cors(), sync(), ElectionController.voteVirtual);
    
    app.get(route('/seat/:electionCode([A-NP-Z1-9]{6})'), cors(), sync(), ElectionController.takeSeat);
    
    app.put(route('/skip/:electionCode([A-NP-Z1-9]{6})'), cors(), sync(), ElectionController.skip);
    
    app.get(route('/retrieve/:electionCode([A-NP-Z1-9]{6})'), cors(), sync(), ElectionController.retrieve);
    
    app.delete(route('/delete/:electionCode([A-NP-Z1-9]{6})'), cors(), sync(), ElectionController.delete);
}
