import { DismissError } from './DismissError'
export type Task<ReturnValue> = () => Promise<ReturnValue>

// @TODO: add option to dismiss specific task

export const createQueue = (): {
	enqueueTask: <ReturnValue>(task: Task<ReturnValue>) => Promise<ReturnValue>
	dismissPendingTasks: () => void
} => {
	type Item<ReturnValue> = {
		task: Task<ReturnValue>
		dismiss: () => void
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
		const dismiss = () => {
			const index = items.indexOf(item)
			if (index === -1) {
				throw new Error(
					'This task cannot be dismissed because it is not queued.',
				)
			}
			items.splice(index, 1)
			triggerReject(new DismissError())
		}
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
		const item = { task: wrappedTask, dismiss }
		items.push(item)

		if (items.length === 1 && !isRunningTask) {
			runNextItem()
		}

		return promise
	}

	const dismissPendingTasks = () => {
		items.forEach((item) => item.dismiss())
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

	return { enqueueTask, dismissPendingTasks }
}
