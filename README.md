# Enqueue task [![npm](https://img.shields.io/npm/v/enqueue-task.svg)](https://www.npmjs.com/package/enqueue-task) ![npm type definitions](https://img.shields.io/npm/types/enqueue-task.svg) [![jsr](https://img.shields.io/badge/jsr-F7DF1E)](https://jsr.io/@onset/enqueue-task)

Queue for your project.

## Installation

```bash
npm install enqueue-task
```

## Usage

### Queue

```typescript
import { queue } from 'enqueue-task'

const delay = (milliseconds: number) =>
	new Promise((resolve) => setTimeout(resolve, milliseconds))

const task1 = async () => {
	await delay(5000)
	console.log('Task 1')
}
const task2 = async () => {
	await delay(3500)
	console.log('Task 2')
}
const task3 = async () => {
	await delay(4000)
	console.log('Task 3')
}

queue.enqueueTask(task1)
queue.enqueueTask(task2)
queue.enqueueTask(task3)
```

#### Console output

```js
'Task 1' // After 5 seconds
'Task 2' // After 8.5 seconds
'Task 3' // After 12.5 seconds
```

#### Custom queue

```typescript
import { createQueue } from 'enqueue-task'
const myQueue = createQueue()
```

#### Return value

```typescript
const task4 = async () => {
	await delay(1000)
	return 3.14159265358979
}
const result4 = await queue.enqueueTask(task4)
console.log(result4) // 3.14159265358979
```

### Group helper

```typescript
import { getQueueGroup } from 'enqueue-task'

getQueueGroup('apples').enqueueTask(task1)
getQueueGroup('apples').enqueueTask(task2)
getQueueGroup('pears').enqueueTask(task3)
```

#### Console output

```js
'Task 3' // After 4 seconds
'Task 1' // After 5 seconds
'Task 2' // After 8.5 seconds
```

#### Custom get queue group

```typescript
import { createGetQueueGroup } from 'enqueue-task'
const myGetQueueGroup = createGetQueueGroup()
```

### Dismiss pending tasks

All dismissed tasks will throw an instance of `DismissError`.

```typescript
queue.dismissPendingTasks()
```

#### Tip: ignore dismiss errors

```typescript
queue.enqueueTask(task1).catch((error) => {
	if (error instanceof DismissError) {
		return
	}
	throw error
})
```

### Development

See it in action:

```bash
npm ci
npm run build
npm test
```
