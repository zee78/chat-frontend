import React from 'react';
import Image from 'next/image';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatWindow = ({
  conversationId,
  conversationMessages,
  userId,
  optionsIndex,
  handleToggleOption,
  handleEdit,
  handleCopyClick,
  deletMessage,
  text,
  handleChange,
  handleSendMessage,
  handleFileChange
}) => {
  return (
    <div className="chat-window h-screen bg-white">
      {!conversationId ? (
        <div className="h-full flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold mb-6">Welcome for demo chat </h1>
          <p className="text-2xl">Pleae select any conversation to start chat 😊</p>
        </div>
      ) : (
        <div className="flex flex-col justify-between h-full">
          <div className="flex items-center border border-gray-300 px-2 py-1">
            <div className="border-2 border-gray-300 rounded-full p-px">
              <Image src={'/assets/images/profile.png'} alt="Profile" width={48} height={48} />
            </div>
            <div className="pl-3">
              <h4>Zeeshan</h4>
            </div>
          </div>
          <div className="chat-box">
            <MessageList
              messages={conversationMessages}
              userId={userId}
              optionsIndex={optionsIndex}
              handleToggleOption={handleToggleOption}
              handleEdit={handleEdit}
              handleCopyClick={handleCopyClick}
              deletMessage={deletMessage}
            />
            <MessageInput
              text={text}
              handleChange={handleChange}
              handleSendMessage={handleSendMessage}
              handleFileChange={handleFileChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
