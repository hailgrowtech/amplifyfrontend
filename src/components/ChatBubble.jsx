import React from 'react';
import { chatUser1, chatUser2 } from '../assets';

const ChatBubble = ({ isOwnSender, _id, sender, dateCreated, type, payload }) => {
  return (
    <div
      className={`max-w-[100%] relative mt-5 ${isOwnSender ? 'self-end text-right' : 'self-start'} px-4 pb-2`}
      key={_id}
    >
      <div className={`flex ${isOwnSender ? 'flex-row-reverse' : 'flex-row'} items-end w-full`}>
        <img
          src={isOwnSender ? chatUser1 : chatUser2}
          alt="Avatar"
          className="w-10 h-10 rounded-full z-10"
        />
        <div
          className={`relative p-4 mt-2 ${isOwnSender ? 'bg-[#282F3E] text-white' : 'bg-[#1D334B] text-white'} ${type === 'text' ? 'py-2.5' : ''} rounded-3xl`}
        >
          <div className={`absolute ${isOwnSender ? 'right-[-8px] bottom-0 rounded-bl-3xl bg-[#282F3E]' : 'left-[-8px] bottom-0 rounded-br-3xl bg-[#1D334B]'}`} style={{ width: '16px', height: '16px' }} />
          {
            type === 'text' && (
              <div
                style={{
                  display: 'inline-block',
                  textAlign: 'left',
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    payload.text.replace(/\n/g, '<br />')
                }}
              />
            )
          }
          {
            type === 'image' && (
              <a
                href={payload.image}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex" }}
              >
                <img
                  src={payload.image}
                  alt="chat"
                  className="h-[220px]"
                />
              </a>
            )
          }
          {
            type === 'audio' && (
              <audio controls className="block bg-white overflow-hidden rounded-full">
                <source src={payload.audio} type="audio/mpeg" />
              </audio>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default ChatBubble;