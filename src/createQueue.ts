export type Task = () => Promise<void>

export const createQueue = () => {
	type Item = {
		task: Task
		markDone: () => void
	}
	const items: Item[] = []
	// @TODO: add discardPendingTasks option
	// @TODO: return return value of task
	const enqueueTask = async (task: Task) => {
		let markDone = () => {
			// Placeholder
		}
		const promise = new Promise<void>((resolve) => {
			markDone = resolve
		})
		items.push({ task, markDone })

		if (items.length === 1) {
			runNextItem()
		}

		await promise
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
