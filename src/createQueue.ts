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
		const { promise, resolve, reject } = (Promise<ReturnValue>).withResolvers()
		const wrappedTask = async () => {
			try {
				const result = await task()
				resolve(result)
			} catch (error) {
				// @TODO: make configurable if queue should proceed when some item fails
				reject(error)
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
