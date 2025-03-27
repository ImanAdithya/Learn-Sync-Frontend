import React, { useState } from 'react';
import { RiSettings5Fill, RiAddLine, RiGroupLine, RiCloseLine, RiSearchLine } from "react-icons/ri";

export const GroupChatForm = ({
  isOpen,
  onClose,
  newGroupName,
  setNewGroupName,
  searchQuery,
  setSearchQuery,
  systemUsers,
  groupMembers,
  addGroupMember,
  removeGroupMember,
  createGroup
}) => {
  if (!isOpen) return null;

  // Filter users based on search query and exclude already selected members
  const filteredUsers = systemUsers.filter(user => 
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     user.username.toLowerCase().includes(searchQuery.toLowerCase())) &&
    !groupMembers.includes(user.id)
  );

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[500px] max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Create New Group</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <RiCloseLine className="w-6 h-6" />
          </button>
        </div>

        {/* Group Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
          <input
            type="text"
            placeholder="Enter group name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        {/* Selected Members */}
        {groupMembers.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Selected Members</label>
            <div className="flex flex-wrap gap-2">
              {groupMembers.map(memberId => {
                const member = systemUsers.find(user => user.id === memberId);
                return (
                  <div 
                    key={memberId} 
                    className="flex items-center bg-gray-100 rounded-full px-2 py-1"
                  >
                    <span className="mr-2">{member.name}</span>
                    <button 
                      onClick={() => removeGroupMember(memberId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <RiCloseLine />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Search User Input */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Add Members</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or username"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 pl-10"
            />
            <RiSearchLine className="absolute left-3 top-3 text-gray-500"/>
          </div>

          {/* User List */}
          {searchQuery && (
            <div className="mt-2 border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div 
                    key={user.id} 
                    onClick={() => addGroupMember(user.id)}
                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500">No users found</div>
              )}
            </div>
          )}
        </div>

        {/* Create Group Button */}
        <div className="mt-4">
          <button
            onClick={createGroup}
            disabled={!newGroupName || groupMembers.length === 0}
            className="w-full bg-black text-white py-2 rounded-lg 
              disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
};