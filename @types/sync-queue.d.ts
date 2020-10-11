declare module 'sync-queue' {
	
	class Queue extends Array<() => void> {
		active: boolean;
		place(command: () => void): void;
		next(): void;
		clear(): void;
	}
	export default Queue;
	
}