import { listenable } from 'custom-listenable'

type Task<R extends unknown> = () => Promise<R>
type WrappedTask<R extends unknown> = { task: Task<R> }

export const createQueue = () => {
	const queue = {
		tasksCountListenable: listenable<number>(),
		tasks: [] as WrappedTask<unknown>[],
		enqueue: async <R extends unknown>(
			task: Task<R>,
			options = {
				clearOtherPendingTasks: false,
			},
		) => {
			const wrappedTask: WrappedTask<R> = { task }
			queue.tasks.push(wrappedTask)
			queue.tasksCountListenable.emit(queue.tasks.length)
		},
	}
	const enqueueTask = () => {}
	const clearPendingTasks = () => {}
	const countTasks = {
		get: () => queue.tasks.length,
		addListener: queue.tasksCountListenable.addListener,
		removeListener: queue.tasksCountListenable.removeListener,
	}

	return {
		enqueueTask,
		clearPendingTasks,
		countTasks,
	}
}
