const multer = require('multer');
const { ElectionController } = require('./app');
const cors = require('cors')

const upload = multer();

exports.setup = (app, route) => {
	
	app.post(route('/create'), upload.none(), cors(), ElectionController.create);
	
	app.get(route('/:electionCode([A-Z1-9]{6})/join'), cors(), ElectionController.join);
	
	app.put(route('/:electionCode([A-Z1-9]{6})/vote'), upload.none(), cors(), ElectionController.vote);
	
	app.put(route('/:electionCode([A-Z1-9]{6})/skip'), cors(), ElectionController.skip);
	
	app.get(route('/:electionCode([A-Z1-9]{6})/retrieve'), cors(), ElectionController.retrieve);
	
	app.delete(route('/:electionCode([A-Z1-9]{6})/delete'), cors(), ElectionController.delete);
	
}
