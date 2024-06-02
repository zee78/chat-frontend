import React from 'react';
import Image from 'next/image';
import { formatDateTime } from '../../../utils/formatDate';
import '@/app/style.css';

const UserList = ({ conversations, activeIndex, handleGetConversationsMessage }) => {
  return (
    <div className="user-list bg-[#F9F8F8] h-screen">
      <div className="flex items-center pl-2 py-2">
        <Image src={'/assets/images/user2.png'} alt="Demo User" width={48} height={48} />
        <h4 className="pl-3 font-bold">Demo User</h4>
      </div>
      <div className="pl-2 pr-2 py-3 border border-gray-300">
        <input
          type="search"
          className="border-2 w-full py-2 rounded-xl px-2 text-gray-900 ring-1 ring-inset ring-[#e1dede] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Search User here"
        />
      </div>
      <ul className="list-none h-full overflow-y-scroll">
        {conversations.map((conversation) => (
          <li
            className={`flex justify-between pr-2 py-4 my-3 rounded-md pl-2 mx-2 ${conversation.id === activeIndex ? 'active' : ''}`}
            onClick={() => handleGetConversationsMessage(conversation.id)}
            key={conversation.id}
          >
            <div className="flex">
              <div className="border-2 border-gray-300 rounded-full p-px">
                <Image src={'/assets/images/user1.png'} alt="User" width={48} height={48} />
              </div>
              <div className="pl-2">
                <p className="mb-0">
                  {conversation.title ? conversation.title : `Zeeshan ${conversation.id}`}
                </p>
                <span className="text-sm">Message</span>
              </div>
            </div>
            <div>
              <span className="text-xs">{formatDateTime(conversation.updatedAt)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
