export type Task<ReturnValue> = () => Promise<ReturnValue>

export const createQueue = (): {
	enqueueTask: <ReturnValue>(task: Task<ReturnValue>) => Promise<ReturnValue>
} => {
	type Item<ReturnValue> = {
		task: Task<ReturnValue>
	}
	// @TODO: add discardPendingTasks function
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
			try {
				const result = await task()
				triggerResolve(result)
			} catch (error) {
				triggerReject(error)
			}
		}
		items.push({ task: wrappedTask })

		if (items.length === 1) {
			runNextItem()
		}

		return promise
	}

	const runNextItem = async () => {
		const item = items.at(0)
		if (!item) {
			return
		}
		try {
			await item.task()
		} catch (error) {
			console.error(error)
		}
		items.shift()
		runNextItem()
	}

	return { enqueueTask }
}
