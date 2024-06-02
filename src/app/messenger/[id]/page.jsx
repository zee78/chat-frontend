// app/[id]/page.js

'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import useSocket from '../../../../hooks/useSocket';
import UserList from '../../components/UserList';
import ChatWindow from '../../components/ChatWindow';
import '@/app/style.css';

const MainPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    file: null,
    text: '',
  });
  const [fileName, setFileName] = useState(null);
  const [inputFile, setInputFile] = useState(null);
  const [messages, setMessages] = useState([]);
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
  const containerRef = useRef(null);
  const socket = useSocket('http://localhost:3000');

  useEffect(() => {
    setUserId(parseInt(id));
    getAllConversations();
    if (socket) {
      socket.on('message', (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      return () => {
        socket.off('message');
      };
    }
  }, [id, socket]);

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

  const handleToggleOption = (id) => {
    if (optionsIndex === id) {
      setOptionsIndex(null);
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

  const handleEdit = async (text, id) => {
    setEditMessageId(id);
    setText(text);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setInputFile(file);
  };

  const handleStartChat = async (user) => {
    if (socket) {
      socket.emit('message', 'message');
    }
    try {
      const conversationData = {
        title: '',
        is_group: false,
        status: 'active',
        participants: [
          {
            user_id: user.id,
          },
          {
            user_id: 4,
          },
        ],
      };
      const response = await fetch('http://localhost:3000/conversations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(conversationData),
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
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const handleGetConversationsMessage = async (id) => {
    setActiveIndex(id);
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
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleChange = (e) => {
    setText(e);
  };

  const handleSendMessage = async () => {
    const msgData = {
      content: text,
      conversationId: conversationId,
      sender_id: userId,
    };

    const data = new FormData();
    data.append('sender_id', userId);
    data.append('conversation_id', conversationId);
    if (inputFile !== null) {
      data.append('content', inputFile);
    } else {
      data.append('content', text);
    }

    if (!editMessageId) {
      try {
        const response = await fetch('http://localhost:3000/messages/create', {
          method: 'POST',
          body: data,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Success:', result);
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      try {
        const response = await fetch(`http://localhost:3000/messages/${editMessageId}`, {
          method: 'PATCH',
          body: data,
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const responseBody = await response.text();
        console.log('Success:', responseBody);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    setEditMessageId(null);
    handleGetConversationsMessage(conversationId);
  };

  const deletMessage = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/messages/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseBody = await response.text();
      console.log('Success:', responseBody);
      handleGetConversationsMessage(conversationId);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <div className="grid grid-cols-2 chatGrid h-screen">
      <UserList
        conversations={conversations}
        activeIndex={activeIndex}
        handleGetConversationsMessage={handleGetConversationsMessage}
      />
      <ChatWindow
        conversationId={conversationId}
        conversationMessages={conversationMessages}
        userId={userId}
        optionsIndex={optionsIndex}
        handleToggleOption={handleToggleOption}
        handleEdit={handleEdit}
        handleCopyClick={handleCopyClick}
        deletMessage={deletMessage}
        text={text}
        handleChange={handleChange}
        handleSendMessage={handleSendMessage}
        handleFileChange={handleFileChange}
      />
    </div>
  );
};

export default MainPage;
