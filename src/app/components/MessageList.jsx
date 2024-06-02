import React, { useRef, useEffect } from 'react';
import MessageItem from './MessageItem';

const MessageList = ({ messages, userId, optionsIndex, handleToggleOption, handleEdit, handleCopyClick, deletMessage }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="conversation-list px-4 overflow-y-scroll" ref={containerRef}>
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          userId={userId}
          optionsIndex={optionsIndex}
          handleToggleOption={handleToggleOption}
          handleEdit={handleEdit}
          handleCopyClick={handleCopyClick}
          deletMessage={deletMessage}
        />
      ))}
      <div ref={containerRef} />
    </div>
  );
};

export default MessageList;
