// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Deno requires extension hack
import { createQueue } from './createQueue.ts'

type Group = string | symbol | null | undefined

export const createGetQueueGroup = (): ((
	group: Group,
) => ReturnType<typeof createQueue>) => {
	const queues = new Map<Group, ReturnType<typeof createQueue>>()

	return (group: Group) => {
		const queue = queues.get(group)
		if (queue) {
			return queue
		}
		const newQueue = createQueue()
		queues.set(group, newQueue)
		return newQueue
	}
}
