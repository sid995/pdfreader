import React from "react"
import { Message } from "ai/react"
import { cn } from "@/lib/utils"

type Props = {
  messages: Message[],
  isLoading: boolean
}

const MessageList = ({ messages, isLoading }: Props) => {
  if (!messages) return <></>

  return (
    <div className="flex flex-col gap-2 px-4">
      {messages.map(message => (
        <div
          key={message.id}
          className={cn("flex", {
            'justify-end pl-10': message.role === "user",
            'justify-start pr-10': message.role === "assistant"
          })}
        >
          <div className={cn("rounded-lg py-1 px-3 text-sm shadow-md ring-gray-900/10", {
            "bg-blue-600 text-white": message.role === "user"
          })}>
            <p>{message.content}</p>
          </div>
        </div>
      ))}
      {isLoading && <p className="text-xs mt-1 py-1 px-3 text-gray-400">Response is being generated</p>}
    </div>
  )
}

export default MessageList