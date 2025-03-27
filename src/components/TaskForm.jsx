import React, { useState,useEffect } from "react";
import { HiX } from "react-icons/hi";
import axios from "axios"; // Import Axios

export const TaskForm = ({ onAddTask, onClose, getAllTasks,task,isUpdate  }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    console.log("TASK USE EFFEXXR",task);
    
    if (isUpdate) {
      console.log("UPDATE DATA", task);
      setTitle(task.taskTitle || "");
      setDescription(task.description || "");
      setPriority(task.priority || "Medium");
      setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    } 
  }, [isUpdate]);
  

  const userId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(isUpdate){
      updateTask();
    }else{
      createTask();
    }
  };

  const createTask=()=>{
    if (!title.trim()) {
      alert("Task title is required");
      return;
    }

    const newTask = {
      "taskTitle":title,
      "description":description,
      "priority":priority,
      "dueDate":dueDate,
      "status":"todo",
      "completed": false,
      "userId":userId
    };

    axios
    .post("http://localhost:4000/api/task", newTask)
    .then((response) => {
      if (response.status === 201) {
        onAddTask(response.data); // Update UI with the saved task
        getAllTasks();
        alert("Task Added Succuss..");
        onClose(); // Close the modal
      } else {
        alert("Failed to save task");
      }
    })
    .catch((error) => {
      console.error("Error saving task:", error);
      alert("An error occurred while saving the task.");
    });

  }

  const updateTask=()=>{
    if (!title.trim()) {
      alert("Task title is required");
      return;
    }

    const updateTask = {
      "taskTitle":title,
      "description":description,
      "priority":priority,
      "dueDate":dueDate,
      "status":task.status,
      "completed": task.completed,
      "userId":task.userId
    };

    axios
    .put(`http://localhost:4000/api/task/${task.taskId}`, updateTask)
    .then((response) => {
      if (response.status === 200) {
       // onAddTask(response.data); // Update UI with the saved task
        getAllTasks();
        alert("Task Updated Succuss..");
        onClose(); // Close the modal
      } else {
        alert("Failed to update task");
      }
    })
    .catch((error) => {
      console.error("Error Updating task:", error);
      alert("An error occurred while Updating the task.");
    });
  }
  const onDeleteTask = () => {
    // Ask for confirmation before deleting
    const isConfirmed = window.confirm("Are you sure you want to delete this task?");
    
    if (isConfirmed) {
      axios
        .delete(`http://localhost:4000/api/task/${task.taskId}`)
        .then((response) => {
          if (response.status === 200) {
            getAllTasks();
            alert("Task Deleted Successfully.");
            onClose(); // Close the modal
          } else {
            alert("Failed to delete task.");
          }
        })
        .catch((error) => {
          console.error("Error deleting task:", error);
          alert("An error occurred while deleting the task.");
        });
    } else {
      // If the user cancels, do nothing
      console.log("Task deletion was canceled.");
    }
  };
  

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <HiX className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{isUpdate ? "Update Task" :"Create New Task" }</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Task Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional task description"
              rows="3"
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
             {isUpdate ? "Update" : "Create"}
            </button>
            {
              isUpdate ? (
                <button
                  type="button"
                  onClick={onDeleteTask}
                  className="w-full bg-red-600 text-white py-2.5 rounded-md hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete
                </button>
              ) : null // Or you can display something else here if you want
            }
          </div>
        </form>
      </div>
    </div>
  );
};
