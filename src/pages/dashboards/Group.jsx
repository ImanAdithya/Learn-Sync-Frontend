import React, { useState } from 'react';
import { RiSettings5Fill, RiAddLine, RiGroupLine, RiCloseLine, RiSearchLine } from "react-icons/ri";
import { GroupChatForm, NewGroupModal } from '../../components/GroupChatForm';

// Dummy data for system users
const systemUsers = [
  { id: 1, name: "John Doe", avatar: "/api/placeholder/50/50", username: "johndoe" },
  { id: 2, name: "Jane Smith", avatar: "/api/placeholder/50/50", username: "janesmith" },
  { id: 3, name: "Mike Johnson", avatar: "/api/placeholder/50/50", username: "mikejohnson" },
  { id: 4, name: "Emily Brown", avatar: "/api/placeholder/50/50", username: "emilybrown" },
];

// Dummy data for groups
const initialGroups = [
  { id: 1, name: "Work Team", members: [1, 2, 3] },
  { id: 2, name: "Project Alpha", members: [2, 4] },
  { id: 3, name: "Family Group", members: [1, 4] },
];

// Dummy messages for chat
const initialMessages = {
  1: [
    { id: 1, sender: 2, text: "Hey, how's the project going?", timestamp: "10:30 AM" },
    { id: 2, sender: 1, text: "Making good progress!", timestamp: "10:35 AM" },
  ],
  2: [
    { id: 1, sender: 4, text: "We need to discuss the timeline", timestamp: "11:15 AM" },
    { id: 2, sender: 2, text: "Sure, let's schedule a meeting", timestamp: "11:20 AM" },
  ],
};



export const Group = () => {
  const [groups, setGroups] = useState(initialGroups);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  
  // New state for new group creation modal
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const createGroup = () => {
    if (newGroupName && groupMembers.length > 0) {
      const newGroup = {
        id: groups.length + 1,
        name: newGroupName,
        members: groupMembers
      };
      
      // Initialize messages for the new group
      setMessages(prev => ({
        ...prev,
        [newGroup.id]: []
      }));

      setGroups([...groups, newGroup]);
      setNewGroupName("");
      setGroupMembers([]);
      setIsNewGroupModalOpen(false);
      setSelectedGroup(newGroup.id);
      setSearchQuery(""); // Reset search query
    }
  };

  const addGroupMember = (userId) => {
    if (!groupMembers.includes(userId)) {
      setGroupMembers([...groupMembers, userId]);
    }
  };

  const removeGroupMember = (userId) => {
    setGroupMembers(groupMembers.filter(id => id !== userId));
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedGroup) {
      const updatedMessages = {
        ...messages,
        [selectedGroup]: [
          ...(messages[selectedGroup] || []),
          {
            id: (messages[selectedGroup]?.length || 0) + 1,
            sender: 1, // Current user
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      };
      setMessages(updatedMessages);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col font-anek p-5 gap-5 relative">
      {/* Header */}
      <div className="flex border-1 border-gray-300 rounded-xl p-3 items-center">
        <div className="flex flex-col border-r-1 border-gray-400 pr-10">
          <h1 className="text-[20px] font-semibold">May</h1>
          <h4 className="text-[15px] font-medium text-gray-700">Today is Saturday, May 9th, 2025</h4>
        </div>
        <div className="flex pl-5 items-center gap-2 flex-1">
          <h1 className="text-[23px] font-semibold">Group Chat</h1>
          <div className="text-[19px] font-medium text-gray-700">-</div>
          <h4 className="text-[19px] font-medium text-gray-700">Collaboration Space</h4>
        </div>
        <div>
          <button 
            onClick={() => {
              setIsNewGroupModalOpen(true);
              setNewGroupName("");
              setGroupMembers([]);
              setSearchQuery("");
            }}
            className="text-[19px] font-semibold bg-black text-white rounded-xl w-[124px] justify-center pt-2"
          >
            New Chat
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-5">
        {/* Groups List */}
        <div className="flex flex-col border border-gray-300 rounded-xl h-[690px] p-5 gap-5 w-1/3 overflow-auto">
          {groups.map((group) => (
            <div 
              key={group.id}
              onClick={() => setSelectedGroup(group.id)}
              className={`border border-gray-300 rounded-xl text-[18px] font-semibold py-2 pl-2 cursor-pointer 
                ${selectedGroup === group.id ? 'bg-gray-100' : ''}`}
            >
              {group.name}
              <div className="text-[14px] text-gray-500 flex items-center gap-1">
                <RiGroupLine />
                {group.members.length} members
              </div>
            </div>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex flex-col border border-gray-300 rounded-xl h-[690px] flex-1 p-5">
          {selectedGroup ? (
            <>
              <div className="border border-gray-300 rounded-xl py-2 px-5 flex items-center justify-between">
                <h1 className="text-[18px] font-semibold">
                  {groups.find(g => g.id === selectedGroup)?.name}
                </h1>
                <RiSettings5Fill className="w-[25px] h-[25px]"/>
              </div>
              <div className="flex gap-20 p-5 justify-between h-[600px] overflow-auto">
                <div className="flex flex-col gap-3 w-full">
                  {messages[selectedGroup]?.length > 0 ? (
                    messages[selectedGroup].map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex items-end gap-2 ${message.sender === 1 ? 'self-end flex-row-reverse' : ''}`}
                      >
                        {message.sender !== 1 && (
                          <img 
                            src={systemUsers.find(u => u.id === message.sender)?.avatar} 
                            alt="Avatar" 
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <div 
                          className={`
                            p-2 rounded-lg max-w-[250px] 
                            ${message.sender === 1 
                              ? 'bg-black text-white self-end' 
                              : 'bg-gray-100 text-black'}
                          `}
                        >
                          <p>{message.text}</p>
                          <span className={`text-xs ${message.sender === 1 ? 'text-gray-300' : 'text-gray-500'}`}>
                            {message.timestamp}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500">No messages yet</div>
                  )}
                </div>
              </div>
              <input 
                type="text" 
                placeholder="Type your message...."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="border border-gray-300 rounded-2xl p-3 w-full focus:outline-none"
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <RiGroupLine className="w-24 h-24 mb-4"/>
              <h2 className="text-2xl font-semibold mb-2">Select a Group</h2>
              <p>Or create a new group to start chatting</p>
            </div>
          )}
        </div>
      </div>

      {/* New Group Creation Modal */}
      {isNewGroupModalOpen && (
        <GroupChatForm 
          isOpen={isNewGroupModalOpen} 
          onClose={() => setIsNewGroupModalOpen(false)}
          newGroupName={newGroupName}
          setNewGroupName={setNewGroupName}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          systemUsers={systemUsers}
          groupMembers={groupMembers}
          addGroupMember={addGroupMember}
          removeGroupMember={removeGroupMember}
          createGroup={createGroup}
        />
      )}
    </div>
  );
};

export default Group;