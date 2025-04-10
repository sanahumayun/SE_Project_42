// client/src/context/ChatContext.js
// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import io from 'socket.io-client';
// import axios from 'axios';

// const ChatContext = createContext();

// export const useChatContext = () => useContext(ChatContext);

// export const ChatProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [activeUsers, setActiveUsers] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [conversations, setConversations] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [isTyping, setIsTyping] = useState({});
//   const [loading, setLoading] = useState(true);

//   // Connect to socket server
//   useEffect(() => {
//     const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
//     setSocket(newSocket);

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   // Effect for socket event handlers
//   useEffect(() => {
//     if (!socket) return;

//     // Listen for active users updates
//     socket.on('activeUsers', (users) => {
//       setActiveUsers(users);
//     });

//     // Listen for private messages
//     socket.on('privateMessage', (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
      
//       // Update conversation with latest message
//       setConversations((prevConversations) => {
//         const existingConversationIndex = prevConversations.findIndex(
//           (conv) => conv.userId === message.from || conv.userId === message.to
//         );
        
//         if (existingConversationIndex >= 0) {
//           const updatedConversations = [...prevConversations];
//           updatedConversations[existingConversationIndex] = {
//             ...updatedConversations[existingConversationIndex],
//             lastMessage: message.content,
//             timestamp: message.timestamp
//           };
//           return updatedConversations;
//         }
        
//         // If conversation doesn't exist, create a new one
//         const otherUser = message.from === currentUser?.userId ? message.to : message.from;
//         const newConversation = {
//           userId: otherUser,
//           name: message.senderName,
//           lastMessage: message.content,
//           timestamp: message.timestamp
//         };
        
//         return [...prevConversations, newConversation];
//       });
//     });

//     // Listen for typing indicators
//     socket.on('userTyping', ({ isTyping: typing, from, senderName }) => {
//       setIsTyping((prev) => ({ ...prev, [from]: typing ? senderName : false }));
//     });

//     return () => {
//       socket.off('activeUsers');
//       socket.off('privateMessage');
//       socket.off('userTyping');
//     };
//   }, [socket, currentUser]);

//   // Join chat
//   const joinChat = useCallback((user) => {
//     if (!socket || !user) return;
    
//     setCurrentUser(user);
//     socket.emit('join', user);
    
//     // Fetch user conversations
//     axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/chat/conversations/${user.userId}`)
//       .then(response => {
//         setConversations(response.data.conversations);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error("Error fetching conversations:", error);
//         setLoading(false);
//       });
//   }, [socket]);

//   // Send message
//   const sendMessage = useCallback((content, to) => {
//     if (!socket || !currentUser) return;
    
//     const messageData = {
//       content,
//       to,
//       from: currentUser.userId,
//       senderName: currentUser.name
//     };
    
//     socket.emit('privateMessage', messageData);
//   }, [socket, currentUser]);

//   // Send typing indicator
//   const sendTypingIndicator = useCallback((isTyping, to) => {
//     if (!socket || !currentUser) return;
    
//     socket.emit('typing', {
//       isTyping,
//       to,
//       from: currentUser.userId,
//       senderName: currentUser.name
//     });
//   }, [socket, currentUser]);

//   // Load messages for a conversation
//   const loadMessages = useCallback((recipientId) => {
//     if (!currentUser) return;
    
//     setLoading(true);
    
//     axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/chat/messages/${currentUser.userId}/${recipientId}`)
//       .then(response => {
//         setMessages(response.data.messages);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error("Error fetching messages:", error);
//         setLoading(false);
//       });
//   }, [currentUser]);

//   // Select conversation
//   const selectConversation = useCallback((conversation) => {
//     setSelectedConversation(conversation);
//     loadMessages(conversation.userId);
//   }, [loadMessages]);

//   const value = {
//     socket,
//     activeUsers,
//     currentUser,
//     selectedConversation,
//     conversations,
//     messages,
//     isTyping,
//     loading,
//     joinChat,
//     sendMessage,
//     sendTypingIndicator,
//     selectConversation
//   };

//   return (
//     <ChatContext.Provider value={value}>
//       {children}
//     </ChatContext.Provider>
//   );
// };


"use client"

import { createContext, useContext, useState, useEffect } from "react"
import io from "socket.io-client"
import axios from "axios"


const ChatContext = createContext()


const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  reconnection: true,
})

export const ChatProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [activeUsers, setActiveUsers] = useState([])
  const [isTyping, setIsTyping] = useState({})
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {

    socket.on("connect", () => {
      console.log("Connected to socket server")
      setIsConnected(true)
    })

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server")
      setIsConnected(false)
    })

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
    })

    return () => {
      socket.off("connect")
      socket.off("disconnect")
      socket.off("connect_error")
    }
  }, [])


  useEffect(() => {
    socket.on("activeUsers", (users) => {
      console.log("Active users updated:", users)
      setActiveUsers(users)
    })

    return () => {
      socket.off("activeUsers")
    }
  }, [])


  useEffect(() => {
    socket.on("privateMessage", (message) => {
      console.log("Received message:", message)

    
      if (
        selectedConversation &&
        (message.from === selectedConversation.userId || message.to === selectedConversation.userId)
      ) {
        setMessages((prevMessages) => [...prevMessages, message])
      }


      setConversations((prevConversations) => {
        const updatedConversations = [...prevConversations]
        const conversationIndex = updatedConversations.findIndex(
          (conv) => conv.userId === (message.from === currentUser.userId ? message.to : message.from),
        )

        if (conversationIndex !== -1) {
          updatedConversations[conversationIndex] = {
            ...updatedConversations[conversationIndex],
            lastMessage: message.content,
            timestamp: message.timestamp,
          }
        } else if (message.from !== currentUser.userId) {
          const sender = activeUsers.find((user) => user.userId === message.from)
          if (sender) {
            updatedConversations.push({
              userId: message.from,
              name: message.senderName || sender.name,
              lastMessage: message.content,
              timestamp: message.timestamp,
            })
          }
        }

        return updatedConversations
      })
    })

    return () => {
      socket.off("privateMessage")
    }
  }, [selectedConversation, currentUser, activeUsers])


  useEffect(() => {
    socket.on("userTyping", ({ isTyping: typing, from, senderName }) => {
      if (typing) {
        setIsTyping((prev) => ({ ...prev, [from]: senderName }))
      } else {
        setIsTyping((prev) => {
          const updated = { ...prev }
          delete updated[from]
          return updated
        })
      }
    })

    return () => {
      socket.off("userTyping")
    }
  }, [])


  const joinChat = (user) => {
    setCurrentUser(user)


    socket.emit("join", user)

    fetchConversations(user.userId)
  }

  const fetchConversations = async (userId) => {
    try {
      const response = await axios.get(`/api/chat/conversations/${userId}`)
      if (response.data.success) {
        setConversations(response.data.conversations)
      }
    } catch (error) {
      console.error("Error fetching conversations:", error)
    }
  }

  const selectConversation = async (conversation) => {
    console.log("Selecting conversation:", conversation)
    setSelectedConversation(conversation)

    if (currentUser && conversation) {
      try {
        const response = await axios.get(`/api/chat/messages/${currentUser.userId}/${conversation.userId}`)
        if (response.data.success) {
          console.log("Fetched messages:", response.data.messages)
          setMessages(response.data.messages)
        } else {
          setMessages([])
        }
      } catch (error) {
        console.error("Error fetching messages:", error)
        setMessages([])
      }
    }
  }

  const sendMessage = (content, to) => {
    if (!currentUser || !to) return

    const messageData = {
      content,
      to,
      from: currentUser.userId,
      senderName: currentUser.name,
    }

    socket.emit("privateMessage", messageData)
  }

  const sendTypingIndicator = (isTyping, to) => {
    if (!currentUser || !to) return

    socket.emit("typing", {
      isTyping,
      to,
      from: currentUser.userId,
      senderName: currentUser.name,
    })
  }

  return (
    <ChatContext.Provider
      value={{
        currentUser,
        conversations,
        selectedConversation,
        messages,
        activeUsers,
        isTyping,
        isConnected,
        joinChat,
        selectConversation,
        sendMessage,
        sendTypingIndicator,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => useContext(ChatContext)
