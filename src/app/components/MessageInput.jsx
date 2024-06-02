import React, { useRef } from 'react';
import InputEmoji from 'react-input-emoji';
import { FiSend, FiPaperclip } from 'react-icons/fi';

const MessageInput = ({ text, handleChange, handleSendMessage, handleFileChange }) => {
  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="send-message shadow-lg pr-2 flex items-center shadow-lg">
      <div className="bg-white flex w-[95%] rounded-full items-center relative px-3">
        <InputEmoji
          name="text"
          value={text}
          onChange={handleChange}
          cleanOnEnter
          placeholder="Type a message here"
          className="m-0"
        />
        <div className="mr-3 ml-2 flex">
          <button type="button" onClick={handleIconClick} className="text-2xl">
            <FiPaperclip size={24} color="#858585" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>
      <div className="pl-3 w-[5%]">
        <button
          type="button"
          onClick={handleSendMessage}
          className="btn rounded-full bg-[#44D7B6] p-3 text-white w-[48px] h-[48px] text-center flex items-center justify-center"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
