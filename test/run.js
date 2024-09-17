import { DismissError, queue } from '../dist/index.js'

const delay = (milliseconds) =>
	new Promise((resolve) => setTimeout(resolve, milliseconds))

const log = (message) => {
	const now = new Date()
	console.log(
		`[${now.toLocaleTimeString('en-GB', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		})}.${now.getMilliseconds().toString().padStart(3, '0')}]`,
		message,
	)
}

const task1 = async () => {
	await delay(500)
	log('Task 1')
}
const task2 = async () => {
	await delay(350)
	log('Task 2')
}
const task3 = async () => {
	await delay(400)
	log('Task 3')
}
const task4 = async () => {
	await delay(200)
	log('Task 4')
}
const task5 = async () => {
	await delay(200)
	log('Task 5')
}
const task6 = async () => {
	await delay(150)
	log('Task 6')
	throw new Error('Error from task 6')
}

queue.dismissPendingTasks() // Nothing to dismiss. Should be ok.

setTimeout(() => {
	queue.dismissPendingTasks() // Should dismiss task 4.
}, 1200)

queue.enqueueTask(task1)
queue.enqueueTask(task2)
queue.enqueueTask(task3)
await queue.enqueueTask(task4).catch((error) => {
	if (error instanceof DismissError) {
		console.log('Task 4 has been dismissed as expected.')
	} else {
		throw error
	}
})
queue.enqueueTask(task5)
queue.enqueueTask(task6).catch(() => {
	console.log('Task 6 has thrown error as expected.')
})
