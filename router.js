const multer = require('multer');
const { ElectionController } = require('./app');

const upload = multer();

exports.setup = (app, route) => {
	
	app.post(route('/create'), upload.none(), ElectionController.create);
	
	app.get(route('/:electionCode([A-Z1-9]{6})/join'), ElectionController.join);
	
	app.put(route('/:electionCode([A-Z1-9]{6})/vote'), upload.none(), ElectionController.vote);
	
	app.get(route('/:electionCode([A-Z1-9]{6})/retrieve'), ElectionController.retrieve);
	
	app.delete(route('/:electionCode([A-Z1-9]{6})/delete'), ElectionController.delete);
	
}
