export type Task<ReturnValue> = () => Promise<ReturnValue>

export const createQueue = (): {
	enqueueTask: <ReturnValue>(task: Task<ReturnValue>) => Promise<ReturnValue>
} => {
	type Item<ReturnValue> = {
		task: Task<ReturnValue>
		markDone: (returnValue: ReturnValue) => void
	}
	// @TODO: add discardPendingTasks function
	const items: Item<unknown>[] = []
	const enqueueTask = <ReturnValue>(
		task: Task<ReturnValue>,
	): Promise<ReturnValue> => {
		let markDone: (returnValue: ReturnValue) => void = () => {
			// Placeholder
		}
		const promise = new Promise<ReturnValue>((resolve) => {
			markDone = resolve
		})
		items.push({ task, markDone })

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

const q = createQueue()

const task1 = async () => {
	return 5
}
const task2 = async () => {
	return 'asda'
}
const task3 = async () => {
	return new Promise<string>((resolve) => {
		resolve('Míša')
	})
}

const result1 = q.enqueueTask(task1)
console.log(result1)

const result2 = q.enqueueTask(task2)
console.log(result2)

const result3 = q.enqueueTask(task3)
console.log(result3)
