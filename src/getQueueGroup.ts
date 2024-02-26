// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Deno requires extension hack
import { createGetQueueGroup } from './createGetQueueGroup.ts'

export const getQueueGroup: ReturnType<typeof createGetQueueGroup> =
	createGetQueueGroup()
