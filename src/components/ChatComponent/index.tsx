'use client'
import React from 'react'
import { Input } from '../ui/input'
import { useChat } from "ai/react"
import { Button } from '../ui/button'
import { Send } from 'lucide-react'
import MessageList from '../MessageList'

type Props = {}

const ChatComponent = (props: Props) => {
  const { input, handleInputChange, handleSubmit, messages, isLoading } = useChat({
    api: '/api/chat'
  })

  return (
    <div className="relative max-h-screen h-full">
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      <MessageList messages={messages} isLoading={isLoading} />

      <form
        onSubmit={handleSubmit}
        className="absolute bottom-0 inset-x-0 px-2 py-4 bg-white flex"
      >
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask any question..."
          className="w-full"
        />
        <Button className="bg-blue-600 ml-2">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  )
}

export default ChatComponent