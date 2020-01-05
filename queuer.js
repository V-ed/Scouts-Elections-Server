const Queue = require('sync-queue');

const queue = new Queue();

function sync() {

	return (_req, _res, next) => {
		
		queue.place(function() {
			
			next();
			
			queue.next();
			
		})
		
	};

}

module.exports = {
	sync: sync
};
