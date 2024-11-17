import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, addDoc, serverTimestamp, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebaseConfig'; // Import your configured Firestore and auth

export default function MessagingPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [usernames, setUsernames] = useState({}); // Store usernames by userId

  // Fetch conversations from Firestore
  useEffect(() => {
    const q = query(collection(db, 'conversations'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convos = snapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data, participants: data.participants || [] }; // Add fallback for participants
      });
      setConversations(convos);
    });
    return unsubscribe;
  }, []);

  // Fetch user names and store them
  useEffect(() => {
    const fetchUsernames = async () => {
      const users = {};
      const usersRef = collection(db, 'users'); // assuming you have a users collection
      const snapshot = await onSnapshot(usersRef);
      snapshot.forEach(doc => {
        const user = doc.data();
        users[doc.id] = user.username; // Assuming 'username' is a field in your user document
      });
      setUsernames(users);
    };

    fetchUsernames();
  }, []);

  // Fetch messages for the selected conversation
  useEffect(() => {
    if (selectedConversation) {
      const messagesRef = collection(db, 'conversations', selectedConversation.id, 'messages');
      const q = query(messagesRef, orderBy('timestamp'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => doc.data());
        setMessages(msgs);
      });
      return unsubscribe;
    }
  }, [selectedConversation]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const messagesRef = collection(db, 'conversations', selectedConversation.id, 'messages');
    await addDoc(messagesRef, {
      senderId: auth.currentUser.uid,
      text: newMessage,
      timestamp: serverTimestamp(),
    });
    setNewMessage('');
  };

  const getUsername = (userId) => {
    return usernames[userId] || 'Unknown'; // Fallback in case username is not loaded
  };

  return (
    <div className=" flex h-screen">
      {/* Sidebar for conversations */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Conversations</h2>
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => handleSelectConversation(conversation)}
            className={`p-2 cursor-pointer hover:bg-gray-200 ${
              selectedConversation?.id === conversation.id ? 'bg-gray-300' : ''
            }`}
          >
            {conversation.participants.length > 0
              ? conversation.participants.map((participantId) => getUsername(participantId)).join(', ')
              : 'No participants'}
          </div>
        ))}
      </div>

      {/* Chat window */}
      <div className="w-3/4 flex flex-col p-4">
        {selectedConversation ? (
          <>
            <div className="flex-1 overflow-y-auto mb-4">
              {messages.map((message, index) => {
                const isCurrentUser = message.senderId === auth.currentUser.uid;
                const senderName = getUsername(message.senderId);

                return (
                  <div
                    key={index}
                    className={`mb-2 ${isCurrentUser ? 'text-right' : 'text-left'}`}
                  >
                    {!isCurrentUser && <div className="font-semibold">{senderName}</div>} {/* Display the sender's name */}
                    <p className="inline-block bg-blue-100 p-2 rounded">{message.text}</p>
                  </div>
                );
              })}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border p-2 rounded-l"
                placeholder="Type a message..."
              />
              <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2 rounded-r">
                Send
              </button>
            </div>
          </>
        ) : (
          <p className="text-center">Select a conversation to start chatting</p>
        )}
      </div>
    </div>
  );
}
