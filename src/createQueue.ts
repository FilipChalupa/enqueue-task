export type Task<ReturnValue> = () => Promise<ReturnValue>

export const createQueue = (): {
	enqueueTask: <ReturnValue>(task: Task<ReturnValue>) => Promise<ReturnValue>
} => {
	type Item<ReturnValue> = {
		task: Task<ReturnValue>
	}
	let isRunningTask = false
	const items: Item<unknown>[] = []
	const enqueueTask = <ReturnValue>(
		task: Task<ReturnValue>,
	): Promise<ReturnValue> => {
		let triggerResolve: (returnValue: ReturnValue) => void = () => {
			// Placeholder
		}
		let triggerReject: (reason?: unknown) => void = () => {
			// Placeholder
		}
		const promise = new Promise<ReturnValue>((resolve, reject) => {
			triggerResolve = resolve
			triggerReject = reject
		})
		const wrappedTask = async () => {
			isRunningTask = true
			try {
				const result = await task()
				triggerResolve(result)
			} catch (error) {
				// @TODO: make configurable if queue should proceed when some item fails
				triggerReject(error)
			}
			isRunningTask = false
		}
		items.push({ task: wrappedTask })

		if (items.length === 1 && !isRunningTask) {
			runNextItem()
		}

		return promise
	}

	const runNextItem = async () => {
		const item = items.shift()
		if (!item) {
			return
		}
		try {
			await item.task()
		} catch (error) {
			console.error(error)
		}
		runNextItem()
	}

	return { enqueueTask }
}
