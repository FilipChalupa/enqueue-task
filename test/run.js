import { queue } from '../dist/index.js'

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
	await delay(100)
	log('Task 5')
}

queue.enqueueTask(task1)
queue.enqueueTask(task2)
queue.enqueueTask(task3)
queue.enqueueTask(task4)
queue.enqueueTask(task5)
