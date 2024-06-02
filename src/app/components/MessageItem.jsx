import React from 'react';
import { FaFolder } from 'react-icons/fa';
import { GoKebabHorizontal, GoPencil } from 'react-icons/go';
import { PiArrowBendUpLeftLight, PiCopySimpleLight } from 'react-icons/pi';
import { RiDeleteBinLine } from 'react-icons/ri';
import { formatDateTime } from '../../../utils/formatDate';

const MessageItem = ({ message, userId, optionsIndex, handleToggleOption, handleEdit, handleCopyClick, deletMessage }) => {
  return message.sender_id === userId ? (
    <div className="right-col flex flex-col items-end mb-3" key={message.id}>
      <div className="flex items-center justify-center flex-row-reverse message-list">
        <div className={`bg-[#44D7B6] px-3 py-3 rounded-br-none max-w-xs message-content ${message.type === 'text' ? 'rounded-full' : 'shadow-0 rounded-lg'}`}>
          {message.type === 'text' && <p>{message.content}</p>}
          {message.type === 'image' && <img src={`http://localhost:3000/${message.content}`} alt="Message content" />}
          {message.type === 'video' && (
            <video src={`http://localhost:3000/${message.content}`} controls width="320" height="240">
              Your browser does not support the video tag.
            </video>
          )}
          {message.type === 'document' && <a href={`http://localhost:3000/${message.content}`} download>
            <FaFolder />
            Download File
          </a>}
        </div>
        <div className="relative menu-icons">
          <div className="mr-3 border-2 rounded-full h-[28px] w-[28px] flex items-center justify-center" onClick={() => handleToggleOption(message.id)}>
            <GoKebabHorizontal />
          </div>
          <div className={`shadow-lg rounded-lg p-3 pr-5 absolute bg-white right-0 mr-3 z-10 ${optionsIndex === message.id ? '' : 'hidden'}`}>
            <ul>
              <li className="text-xs flex items-center py-1 cursor-pointer" onClick={() => handleEdit(message.content, message.id)}><GoPencil /> <span className="pl-2">Edit</span></li>
              <li className="text-xs flex items-center py-1 cursor-pointer"><PiArrowBendUpLeftLight /> <span className="pl-2">Quote</span></li>
              <li className="text-xs flex items-center py-1 cursor-pointer" onClick={() => handleCopyClick(message.content)}><PiCopySimpleLight /> <span className="pl-2">Copy</span></li>
              <li className="text-xs flex items-center py-1 cursor-pointer" onClick={() => deletMessage(message.id)}><RiDeleteBinLine /> <span className="pl-2">Delete</span></li>
            </ul>
          </div>
        </div>
      </div>
      <span className="text-xs pt-2">{formatDateTime(message.createdAt)}</span>
    </div>
  ) : (
    <div className="left-col flex flex-col items-start mb-3" key={message.id}>
      <div className="flex items-center message-list">
        <div className={`bg-white px-3 py-3 rounded-bl-none max-w-xs message-content ${message.type === 'text' ? 'rounded-full' : 'shadow-0 rounded-lg'}`}>
          {message.type === 'text' && <p>{message.content}</p>}
          {message.type === 'image' && <img src={`http://localhost:3000/${message.content}`} alt="Message content" />}
          {message.type === 'video' && (
            <video src={`http://localhost:3000/${message.content}`} controls width="320" height="240">
              Your browser does not support the video tag.
            </video>
          )}
          {message.type === 'document' && <a href={`http://localhost:3000/${message.content}`} className="flex items-center" download>
            <FaFolder color="#44D7B6" size={24} />
            <span className="pl-2">Download File</span>
          </a>}
        </div>
        <div className="relative menu-icon">
          <div className="ml-3 border-2 rounded-full h-[28px] w-[28px] flex items-center justify-center" onClick={() => handleToggleOption(message.id)}>
            <GoKebabHorizontal />
          </div>
          <div className={`shadow-lg rounded-lg p-3 pr-5 absolute bg-white left-0 ml-3 z-10 ${optionsIndex === message.id ? '' : 'hidden'}`}>
            <ul>
              <li className="text-xs flex items-center py-1 cursor-pointer"><PiArrowBendUpLeftLight /> <span className="pl-2">Quote</span></li>
              <li className="text-xs flex items-center py-1 cursor-pointer" onClick={() => handleCopyClick(message.content)}><PiCopySimpleLight /> <span className="pl-2">Copy</span></li>
            </ul>
          </div>
        </div>
      </div>
      <span className="text-xs pt-2">{formatDateTime(message.createdAt)}</span>
    </div>
  );
};

export default MessageItem;
