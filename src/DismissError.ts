export class DismissError extends Error {
	constructor() {
		super('Task has been dismissed.')
	}
}
