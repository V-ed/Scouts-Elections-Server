const multer = require('multer');
const { ElectionController } = require('./app');

const upload = multer();

exports.setup = (app, route) => {
	
	app.post(route('/create'), upload.none(), ElectionController.create);
	
	app.get(route('/:electionCode/join'), ElectionController.join);
	
	app.put(route('/:electionCode/vote'), upload.none(), ElectionController.vote);
	
	app.get(route('/:electionCode/retrieve'), ElectionController.retrieve);
	
}
