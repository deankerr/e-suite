import { Message, nanoid } from 'ai'
import { useState } from 'react'

export type MessageBubble = {
  entity: 'message'
  actual: Message
  id: string // derived
}

const ENTITIES = {
  message: 'message',
  error: 'error',
  awaiting: 'awaiting',
  streaming: 'streaming',
  widget: 'widget',
} as const

function createMessageBubbles(...messages: Message[]): MessageBubble[] {
  return messages.map((m) => {
    // console.log('new msgbub:', m.id)
    return { id: m.id, entity: ENTITIES.message, actual: m }
  })
}

function createMessageBubble(message: Message): MessageBubble {
  // console.log('new msgbub:', message.id)
  return { id: message.id, entity: ENTITIES.message, actual: message }
}

export type ErrorBubble = {
  entity: 'error'
  errText: string
  id: string
}

function createErrorBubble(errText: string): ErrorBubble {
  const bub: ErrorBubble = {
    id: nanoid(),
    entity: 'error' as const,
    errText,
  }
  // console.log('new errorBub', bub.id)
  return bub
}
//* pre-create the bubble for message, becomes message entity
export type AwaitingBubble = {
  entity: 'awaiting'
  actual: null
  id: string
}
function createAwaitingBubble(): AwaitingBubble {
  const bub: AwaitingBubble = {
    id: nanoid(),
    entity: 'awaiting' as const,
    actual: null,
  }
  // console.log('new awaitingBub', bub.id)
  return bub
}

export type StreamingMessageEntity = {
  entity: 'streamingMessage'
  actual: Message
  id: string
}

export type WidgetEntity = {
  entity: 'widget'
  id: string
  widget: React.ReactElement
}

export type BubbleEntities =
  | MessageBubble
  | ErrorBubble
  | AwaitingBubble
  | StreamingMessageEntity
  | WidgetEntity

const getIds = (...bubs: BubbleEntities[]) => bubs.map((b) => b.id)

export function useBubbles(messages: Message[]) {
  // cant store bubbles due to streaming - they could change value
  const [bubbles, setBubbles] = useState<BubbleEntities[]>([])
  const [order, setOrder] = useState<string[]>(() => messages.map((m) => m.id))

  let messageQueue = [...messages]
  const orderedBubbles: BubbleEntities[] = []
  for (const id of order) {
    // our bubs
    const bub = bubbles.find((b) => b.id === id)
    if (bub) {
      orderedBubbles.push(bub)
      continue
    }

    // msg derived bub
    const msg = messageQueue.find((m) => m.id === id)
    if (msg) {
      orderedBubbles.push(createMessageBubble(msg))
      messageQueue = messageQueue.filter((m) => m !== msg)
      continue
    }

    console.error(`bubble ${id} not found?`)
  }

  // remaining messages are new
  if (messageQueue.length > 0) {
    const newMsgBubs = createMessageBubbles(...messageQueue)
    setOrder([...order, ...getIds(...newMsgBubs)])
    orderedBubbles.push(...newMsgBubs)
    // console.log('new messages:', ...getIds(...newMsgBubs))
  }

  const createBubble = {
    error: (errText: string) => {
      const bub = createErrorBubble(errText)
      setBubbles([...bubbles, bub])
      setOrder([...order, bub.id])
    },
    awaiting: () => {
      const bub = createAwaitingBubble()
      setBubbles([...bubbles, bub])
      setOrder([...order, bub.id])
    },
  }

  const clearAwaiting = () => {
    const awaitingBubs = bubbles.filter((bub) => bub.entity === 'awaiting').map((abub) => abub.id)
    const newOrder = order.filter((id) => !awaitingBubs.includes(id))
    setOrder([...newOrder])
  }

  return { orderedBubbles, bubbles, createBubble, clearAwaiting }
}
export type CreateBubble = ReturnType<typeof useBubbles>['createBubble']

/* 
DERIVE!
derive message bubbles, state others

Start with first sys message
check if first other on pile refers to this message
  - if so, its next
    - check if next other refers to this others
      -if so its next (...)
  - push next message, check other pile (...)
*/

// const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 7)
