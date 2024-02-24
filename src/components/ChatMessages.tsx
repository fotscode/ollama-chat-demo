export type Message = {
  content: string
  owner: string
}
type Props = {
  messages: Message[]
  currentResponse: string
}
export default function ChatMessages({ messages, currentResponse }: Props) {
  return (
    <div className='flex flex-col w-full'>
      {messages &&
        messages.map((message, index) => (
          <ul
            key={index}
            className={
              message.owner === 'user'
                ? 'bg-blue-200 p-4 my-2 rounded-md text-black ml-32 justify-between flex'
                : 'bg-gray-200 p-4 my-2 rounded-md text-black mr-32 justify-between flex'
            }
          >
            <li className={message.owner === 'user' ? 'order-2' : 'order-none'}>
              {message.content}
            </li>
            <li>
              <span className='text-xs text-red-500 ml-2'>{message.owner}</span>
            </li>
          </ul>
        ))}
      {currentResponse && (
        <div className='bg-gray-200 p-4 my-2 rounded-md text-black mr-32 justify-between flex'>
          {currentResponse}
          <span className='text-xs text-red-500 ml-2'>bot</span>
        </div>
      )}
    </div>
  )
}
