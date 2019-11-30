const multer = require('multer');
const { ElectionController } = require('./app');

const upload = multer();

exports.setup = (app, route) => {
	
	app.get(route('/create'), upload.none(), ElectionController.create);
	
	app.put(route('/:electionCode/vote/:candidateId(\\d+)'), ElectionController.vote);
	
	app.get(route('/:electionCode/retrieve'), ElectionController.retrieve);
	
}
