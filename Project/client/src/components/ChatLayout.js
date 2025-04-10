// // client/src/components/ChatLayout.js
// import React, { useState, useEffect } from 'react';
// import { useChatContext } from '../context/ChatContext';
// import ChatSidebar from './ChatSidebar';
// import ChatWindow from './ChatWindow';
// import LoginScreen from './LoginScreen';
// import './ChatLayout.css';

// const ChatLayout = () => {
//   const { currentUser } = useChatContext();
//   const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
//   const [showSidebar, setShowSidebar] = useState(true);

//   // Handle responsive design
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobileView(mobile);
//       if (!mobile) {
//         setShowSidebar(true);
//       }
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // If user is not logged in, show login screen
//   if (!currentUser) {
//     return <LoginScreen />;
//   }

//   return (
//     <div className="chat-layout">
//       {(!isMobileView || showSidebar) && (
//         <div className="chat-sidebar-container">
//           <ChatSidebar 
//             onConversationSelect={() => isMobileView && setShowSidebar(false)} 
//           />
//         </div>
//       )}
      
//       <div className="chat-window-container">
//         <ChatWindow 
//           onBackClick={() => setShowSidebar(true)}
//           showBackButton={isMobileView && !showSidebar}
//         />
//       </div>
//     </div>
//   );
// };

// export default ChatLayout;

// client/src/components/ChatLayout.js
import React, { useState, useEffect } from 'react';
import { useChatContext } from '../../../../../chat-app/client/src/context/ChatContext';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import LoginScreen from './LoginScreen';
import './ChatLayout.css';

const ChatLayout = () => {
  const { currentUser } = useChatContext();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (!mobile) {
        setShowSidebar(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <div className="chat-layout">
      {(!isMobileView || showSidebar) && (
        <div className="chat-sidebar-container">
          <ChatSidebar 
            onConversationSelect={() => isMobileView && setShowSidebar(false)} 
          />
        </div>
      )}
      
      <div className="chat-window-container">
        <ChatWindow 
          onBackClick={() => setShowSidebar(true)}
          showBackButton={isMobileView && !showSidebar}
        />
      </div>
    </div>
  );
};

export default ChatLayout;