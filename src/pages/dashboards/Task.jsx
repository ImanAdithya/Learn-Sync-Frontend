import { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { MdOutlineTune } from "react-icons/md";
import { BsCaretRightFill } from "react-icons/bs";
import { HiOutlineDotsVertical, HiPlus } from "react-icons/hi";
import { TaskForm } from "../../components/TaskForm";
import { TaskCard } from "../../components/TaskCard";

export const Task = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    inReview: [],
    done: []
  });
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const userId = localStorage.getItem("userId");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);


  // Fetch tasks from API on component mount
  useEffect(() => {
      getAllTasks();
  }, []);

  const getAllTasks=()=>{
    axios.get(`http://localhost:4000/api/task/${userId}`)
    .then((response) => {
      const fetchedTasks = response.data;

      // Organize tasks into status categories
      const groupedTasks = {
        todo: fetchedTasks.filter(task => task.status === "todo"),
        inProgress: fetchedTasks.filter(task => task.status === "inProgress"),
        inReview: fetchedTasks.filter(task => task.status === "inReview"),
        done: fetchedTasks.filter(task => task.status === "done")
      };

      setTasks(groupedTasks);
    })
    .catch((error) => {
      console.error("Error fetching tasks:", error);
    });
  }

  // Handle drag end event to update state
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sourceList = tasks[source.droppableId];
    const destinationList = tasks[destination.droppableId];
    const movedTask = sourceList.find(task => task.taskId === draggableId);

    // Remove from source & add to destination
    const newSourceList = sourceList.filter(task => task.taskId !== draggableId);
    const newDestinationList = [...destinationList, { ...movedTask, status: destination.droppableId }];

    // Update state
    setTasks({
      ...tasks,
      [source.droppableId]: newSourceList,
      [destination.droppableId]: newDestinationList,
    });

    // Optionally update task status in backend
    axios.put(`http://localhost:4000/api/task/${draggableId}`, { status: destination.droppableId })
      .then(() => console.log(`Task "${movedTask.title}" updated to "${destination.droppableId}"`))
      .catch((error) => console.error("Error updating task:", error));
  };

  // Handle adding a new task
  const handleAddTask = (newTask) => {
    axios.post("http://localhost:4000/api/task", newTask)
      .then((response) => {
        const addedTask = response.data;
        setTasks(prevTasks => ({
          ...prevTasks,
          todo: [...prevTasks.todo, addedTask] // Default to 'todo' column
        }));
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  const handleTaskClick = (task) => {
    console.log(task);
    setIsUpdate(true);   
    setSelectedTask(task); 
    setIsTaskFormOpen(true);
  };

  const handleCreate = () => {
    setIsUpdate(false);   
    setIsTaskFormOpen(true);
  };




  return (
    <div className="flex flex-col font-anek p-5 h-screen">
      {/* Header */}
      <div className="flex border border-gray-300 rounded-xl p-3 items-center">
        <div className="flex flex-col border-r border-gray-400 pr-10">
          <h1 className="text-[17px] font-semibold">May</h1>
          <h4 className="text-[13px] font-medium text-gray-700">
              Today is {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </h4>
        </div>
        <div className="flex pl-5 items-center gap-2 flex-1">
          <h1 className="text-[20px] font-semibold">Board</h1>
          <div className="text-[17px] font-medium text-gray-700">-</div>
          <h4 className="text-[17px] font-medium text-gray-700">Daily Tasks</h4>
        </div>
        <div className="flex gap-5">
          <button className="text-[17px] font-semibold flex border-2 border-gray-300 rounded-xl w-[115px] justify-center pt-2">
            <MdOutlineTune className="h-[23px] w-[28px]" />
            Filters
          </button>
          <button 
            onClick={() => handleCreate()}
            className="text-[17px] font-semibold bg-black text-white rounded-xl w-[115px] justify-center pt-2">
            Create
          </button>
        </div>
      </div>

      {/* Task Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex items-start pt-5 gap-5 overflow-auto h-full">
          {Object.entries(tasks).map(([status, taskList]) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-col border border-gray-300 rounded-xl flex-1 min-h-[300px] w-[300px]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between border-b border-gray-300 h-full py-3 px-2">
                    <div className="flex text-gray-800 items-center gap-2">
                      <BsCaretRightFill className="w-[16px] h-[19px]" />
                      <h1 className="font-semibold text-[18px] pt-1.5 capitalize">
                        {status.replace(/([A-Z])/g, ' $1')}
                      </h1>
                    </div>
                    <div className="flex text-gray-700 items-center gap-2">
                      <HiPlus className="w-[19px] h-[19px]" />
                      <HiOutlineDotsVertical className="w-[18px] h-[18px]" />
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="p-3 overflow-auto space-y-3">
                    {taskList.map((task, index) => (
                      <Draggable key={task.taskId} draggableId={task.taskId} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => handleTaskClick(task)}
                          >
                            <TaskCard
                              title={task.taskTitle}
                              description={task.description}
                              dueDate={task.dueDate}
                              assignee="Adithya"
                              priority={task.priority}
                              status={task.status}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {isTaskFormOpen && (
        <TaskForm 
          onAddTask={handleAddTask}
          onClose={() => setIsTaskFormOpen(false)}
          getAllTasks={getAllTasks}
          task={selectedTask}
          isUpdate={isUpdate}
          
        />
      )}
    </div>
  );
};
