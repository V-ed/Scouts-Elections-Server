import Queue from 'sync-queue';

const queue = new Queue();

export function sync() {

	return (_req, _res, next) => {
		
		queue.place(function() {
			
			next();
			
			queue.next();
			
		})
		
	};

}

export default sync;
