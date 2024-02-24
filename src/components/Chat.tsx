'use client'
import { useEffect, useState } from 'react'
import ChatMessages, { Message } from './ChatMessages'

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMessage, setCurrentMessage] = useState<string>('')
  const [loadingResponse, setLoadingResponse] = useState<boolean>(false)
  const [currentResponse, setCurrentResponse] = useState<string>('')
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessages((prevMessages) => [
      ...prevMessages,
      { content: currentMessage, owner: 'user' },
    ])
    setCurrentMessage('')
    setLoadingResponse(true)
    await makeOllamaRequest(currentMessage)
    setLoadingResponse(false)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentResponse) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { content: currentResponse, owner: 'bot' },
        ])
        setCurrentResponse('')
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [currentResponse])

  const makeOllamaRequest = async (message: string) => {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2',
        prompt: message,
      }),
    })
    if (!res.body) return
    const reader = res.body.pipeThrough(new TextDecoderStream()).getReader()
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      setCurrentResponse(
        (prevResponse) => prevResponse + JSON.parse(value).response,
      )
    }
  }
  return (
    <div className='flex flex-col items-center w-full'>
      <h1 className='text-4xl font-bold m-5'>Chat</h1>
      <ChatMessages messages={messages} currentResponse={currentResponse} />
      <form
        onSubmit={handleSubmit}
        className='flex items-center justify-center w-full'
      >
        <input
          type='text'
          className='h-12 px-4 mt-4 text-lg border border-gray-300 rounded-l-md text-black w-full'
          placeholder='Type your message...'
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          disabled={loadingResponse}
        />
        <button
          type='submit'
          disabled={loadingResponse}
          className='h-12 px-4 mt-4 text-lg bg-blue-500 text-white rounded-r-md'
        >
          Send
        </button>
      </form>
    </div>
  )
}
