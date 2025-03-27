import React from 'react';
import { Clock, User, Check, Calendar } from 'lucide-react';

export const TaskCard = ({ 
  title, 
  description, 
  dueDate, 
  assignee, 
  priority, 
  status,
   
}) => {
  // Priority color mapping
  const getPriorityColor = (priorityLevel) => {
    switch(priorityLevel) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Status color mapping
  const getStatusColor = (taskStatus) => {
    switch(taskStatus) {
      case 'done': return 'bg-green-500';
      case 'inProgress': return 'bg-blue-500';
      case 'todo': return 'bg-red-500';
      case 'inReview': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-sm w-full bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-4">
        {/* Task Title */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-gray-800 truncate pr-2">{title}</h2>
          
          {/* Priority Badge */}
          {priority && (
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(priority)}`}>
              {priority}
            </span>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {description}
          </p>
        )}

        {/* Task Details */}
        <div className="space-y-2">
          {/* Due Date */}
          {dueDate && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span>
              {new Date(dueDate).toLocaleDateString("en-US", {
               month: "long",
               day: "numeric",
              year: "numeric",
               })}
              </span>
            </div>
          )}

          {/* Assignee */}
          {assignee && (
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-2 text-gray-500" />
              <span>{assignee}</span>
            </div>
          )}
        </div>

        {/* Status Indicator */}
        {status && (
          <div className="mt-3 flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(status)}`}></div>
            <span className="text-xs text-gray-600"> {status.toUpperCase()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

