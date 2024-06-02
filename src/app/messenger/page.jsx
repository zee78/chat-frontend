'use client';

import { useRouter } from 'next/navigation'
import React,{useEffect, useState, useRef} from "react";
import Image from "next/image";
import useSocket from '../../../hooks/useSocket';
import { FiSend, FiPaperclip } from "react-icons/fi";
import { FaFolder } from "react-icons/fa";
import { GoKebabHorizontal, GoPencil } from "react-icons/go";
import { PiArrowBendUpLeftLight,PiCopySimpleLight } from "react-icons/pi";
import { RiDeleteBinLine } from "react-icons/ri";
import InputEmoji from "react-input-emoji"; 
import copy from 'clipboard-copy';
import { formatDateTime } from '../../../utils/formatDate';
import '@/app/style.css';

const MainPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    file: null,
    text: '',
  });
  const [message, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [editMessageId, setEditMessageId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [text, setText] = useState('');
  const [optionsIndex, setOptionsIndex] = useState(null);
  const fileInputRef = useRef(null);
  const menuRef = useRef();
  const socket = useSocket('http://localhost:3000');

  useEffect(() => {
    const { userId } = router.query;
    if (id) {
      setUserId(id);
    }
  }, [router]);
  
  console.log('parans', userId);

  useEffect(() => {
    if (socket) {
      const messageListener = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      };
      
      socket.on('message', messageListener);
      
      return () => {
        socket.off('message', messageListener);
      };
    }
    getAllConversations();
  }, [socket]);

  useEffect(() => {

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOptionsIndex(null);
      }
    };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };

  }, [menuRef]);

  const users = [
    {
      id: 1,
      name: 'Zeeshan',
    },
    {
      id: 2,
      name: 'Nabeel',
    },
    {
      id: 3,
      name: 'Sarfraz',
    }
  ];

  const handleToggleOption = (id) => {
    if(optionsIndex === id) {
      setOptionsIndex(null)
    } else {
      setOptionsIndex(id);
    }
  };

  const handleCopyClick = async (text) => {
    try {
      await copy(text);
    } catch (error) {
      console.error('Failed to copy text to clipboard', error);
    }
  };
  const handleEdit = async (text) => {
    console.log('text',text);
    setFormData({ ...formData, [text]: text });
    console.log('formData', formData);
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileChange(file);
    }
  };

  const handleStartChat = async (user) => {
    if (socket) {
      socket.emit('message', 'message');
    }
    try {
      const conversationData = {
        "title": "",
        "is_group": false,
        "status": "active",
        "participants": [
          {
            "user_id": user.id
          },
          {
            "user_id": 4
          }
        ]
      }
      const response = await fetch('http://localhost:3000/conversations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(conversationData)
      });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }
    
      const data = await response.json();
      console.log('Chat started:', data);
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };
  const getAllConversations = async () => {
    try {
      const response = await fetch('http://localhost:3000/conversations/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }
      const data = await response.json();
      setConversations(data);
      console.log('Chat starteds:', conversations);
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };
  const handleGetConversationsMessage = async (id, index) => {
    setActiveIndex(index);
    setConversationId(id);
    try {
      const response = await fetch(`http://localhost:3000/messages/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }
      const data = await response.json();
      setConversationMessages(data);
      console.log('Chat starteds:', conversationMessages);
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleSendMessage = async () => {
    console.log('event', userId);
    console.log('conversationId', formData);
    // e.preventDefault();
    const data = new FormData();
    data.append('sender_id', userId);
    data.append('conversation_id', conversationId);
    if(formData.file !== null){
      data.append('content', formData.file);
    } else {
      data.append('content', formData.text);
    }
    console.log(data);
    // try {
    //   const response = await fetch('http://localhost:3000/messages/create', {
    //     method: 'POST',
    //     body: data,
    //   });

    //   if (!response.ok) {
    //     throw new Error('Network response was not ok');
    //   }

    //   const result = await response.json();
    //   console.log('Success:', result);
    // } catch (error) {
    //   console.error('Error:', error);
    // }

  };
  const deletMessage = async(id) => {
    console.log('Deleting message', id);
    try{
      const response = await fetch(`http://localhost:3000/messages/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseBody = await response.text();
      const result = responseBody ? JSON.parse(responseBody) : {};
      console.log('Success:', result);
    } catch (error) {
      console.log('Error:', error);
    }
  }
  const handleToggle = async(id) => {
    setEditMessageId(id);
    setToggleEdit(true);
  }
  const EditMessage = async(id) => {
    console.log('Edit message', id);
    const data = new FormData();
    if(formData.file !== null){
      data.append('content', formData.file);
    } else {
      data.append('content', formData.text);
    }
    try{
      const response = await fetch(`http://localhost:3000/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      })
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseBody = await response.text();
      
      console.log('Success:', responseBody);
      
    } catch (error) {
      console.log('Error:', error);
    }
  }
  const updateConvo = async (id) => {
    console.log('convo id', id);
    const data = {
      title: 'Group Convo',
    }
    try{
      const response = await fetch(`http://localhost:3000/conversations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseBody = await response.text();
      
      console.log('Success:', responseBody);
      
    } catch (error) {
      console.log('Error:', error);
    }
  }
  return (
    <div className="grid grid-cols-2 chatGrid h-screen">
      <div className="user-list bg-[#F9F8F8] h-screen">
        <div className="flex items-center pl-2 py-2">
          <Image src={'/assets/images/user2.png'} alt="Demo User"  width={48} height={48}  />
          <h4 className="pl-3 font-bold">Demo User</h4>
        </div>
        <div className="pl-2 pr-2 py-3 border border-gray-300">
          <input type="search"className="border-2 w-full py-2 rounded-xl px-2 text-gray-900 ring-1 ring-inset ring-[#e1dede] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Search User here" />
        </div>
        <ul className="list-none h-full overflow-y-scroll">
        { conversations.map((conversation, index) => (
          <li className={`flex justify-between pr-2 py-4 my-3 rounded-md pl-2 mx-2 ${index === activeIndex ? 'active' : ''}`} 
            onClick={() => handleGetConversationsMessage(conversation.id,index)}  
            key={conversation.id}
            >
            <div className="flex">
              <div className="border-2 border-gray-300 rounded-full p-px">
                <Image src={'/assets/images/user1.png'} alt="User"  width={48} height={48} />
              </div>
              <div className="pl-2">
                <p className="mb-0">
                  { conversation.title ? (
                    conversation.title
                  ) : (
                    `Zeeshan ${conversation.id}`
                  )}
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
              <div className="conversation-list px-4 overflow-y-scroll">
              { conversationMessages.map((message) => (
                message.sender_id === userId ? (
                  <div className="right-col flex flex-col items-end mb-3" key={message.id}>
                    <div className="flex items-center justify-center flex-row-reverse message-list" onMouseOver={() => handleMouseOver(message.id)}>
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
                          Download File</a>}
                      </div>
                      <div className="relative menu-icons">
                        <div className="mr-3 border-2 rounded-full h-[28px] w-[28px] flex items-center justify-center" onClick={() => handleToggleOption(message.id)}>
                          <GoKebabHorizontal />
                        </div>
                        <div className={`shadow-lg rounded-lg p-3 pr-5 absolute bg-white right-0 mr-3 z-10 ${optionsIndex === message.id ? '' : 'hidden'}`}>
                          <ul>
                            <li className="text-xs flex items-center py-1 cursor-pointer"  onClick={() => handleEdit(message.content) }><GoPencil /> <span className="pl-2">Edit</span></li>
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
                        <div className="ml-3 border-2 rounded-full h-[28px] w-[28px] flex items-center justify-center"  onClick={() => handleToggleOption(message.id)}>
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
                ) 
                
              ))}
              </div>
              <div className="send-message shadow-lg pr-2 flex items-center shadow-lg">
                <div className="bg-white flex w-[95%] rounded-full items-center relative px-3">
                  <InputEmoji 
                      name='text' 
                      value={formData.text} 
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
                      onChange={handleChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
                <div className="pl-3 w-[5%]">
                  <div>
                    <button type="button" 
                       onClick={() => handleSendMessage()}
                      className="btn rounded-full bg-[#44D7B6] p-3 text-white w-[48px] h-[48px] text-center flex items-center justify-center">
                      <FiSend />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    // <div className='grid grid-cols-2 items-center justify-center h-screen'>
    //     <div className='col-start-1'>
    //       <div className='text-center'>
    //         <label className='font-bold text-2xl'>Please start chat</label>
    //       </div>
    //       { users.map((user) => (
    //         <div className='flex flex-row justify-between item-center  my-3' key={user.id}>
            
    //             <h2>{user.name}</h2>
    //             <button className="btn rounded-md border w-32 py-2.5 bg-violet-600 text-white font-bold" onClick={() => handleStartChat(user)}>Start Chat</button>
                
    //         </div>
    //       ))}
    //       <h3>Start Chat</h3>
    //       <div className='grid grid-cols-2 gap-4 chatGrid'>
    //         <div className='mt-5'>
    //           <ul className='list-none'>
    //             { conversations.map((conversation) => (
    //              <li key={conversation.id} onClick={() => handleGetConversationsMessage(conversation.id)} className="flex justify-between">
    //               <div>
    //                 Conversation {conversation.id}
    //               </div>
    //               <div>
    //                 <span className="pr-2 text-green-300" onClick={() => updateConvo(conversation.id)}>Edit</span>
    //                 <span className="pr-2 text-red-300">Delete</span>
    //                 <span className="text-yellow-300">Star</span>
    //               </div>
    //              </li>
    //             ))}
    //           </ul>
    //         </div>
    //         <div className='mt-5'>
    //           <div>
    //             <ul>
    //               { conversationMessages.map((message) => (
    //                 <li key={message.id} className='flex justify-between'>
    //                   <div>
    //                     {message.type === 'text' && <p>{message.content}</p>}
    //                     {message.type === 'image' && <img src={`http://localhost:3000/${message.content}`} alt="Message content" width="320" />}
    //                     {message.type === 'video' && (
    //                       <video src={`http://localhost:3000/${message.content}`} controls width="320" height="240">
    //                         Your browser does not support the video tag.
    //                       </video>
    //                     )}
    //                     {message.type === 'document' && <a href={`http://localhost:3000/${message.content}`} download>Download File</a>}
    //                   </div>
    //                   <div>
    //                     <span onClick={() => handleToggle(message.id)} className="pr-2">Edit</span>
    //                     <span onClick={() => deletMessage(message.id)} className="text-red-300">Del</span>
    //                   </div>
    //                 </li>
    //               ))}
    //             </ul>
    //             <div>
    //               <input type="text" name='text' value={formData.text} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600" placeholder="Please right message here" />
    //               <div>
    //                 <input type="file" name='file' onChange={handleChange} />
    //                 { toggleEdit ? (
    //                   <button type="button" className="bg-black px-4 text-white" onClick={() => EditMessage()}>Edit Message</button> 
    //                 ) : (
    //                   <button type="button" className="bg-black px-4 text-white" onClick={() => handleSendMessage()}>Send Message</button> 
    //                 )}
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    // </div>
  );
}

export default MainPage;
