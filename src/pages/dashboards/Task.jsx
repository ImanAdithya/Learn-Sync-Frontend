import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { MdOutlineTune } from "react-icons/md";
import { BsCaretRightFill } from "react-icons/bs";
import { HiOutlineDotsVertical, HiPlus } from "react-icons/hi";
import { TaskForm } from "../../components/TaskForm";

// Initial tasks with different statuses
const initialTasks = {
  todo: [{ id: "1", title: "Task 1" }, { id: "2", title: "Task 2" }],
  inProgress: [{ id: "3", title: "Task 3" }],
  inReview: [{ id: "4", title: "Task 4" }],
  done: [{ id: "5", title: "Task 5" }],
};

export const Task = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  // Function to handle drag updates (Logs while dragging)
  const onDragUpdate = (update) => {
    const { draggableId, destination } = update;
    
    if (destination) {
      console.log(`Dragging Task ID "${draggableId}" over "${destination.droppableId}"`);
    }
  };

  // Function to handle drag end (Updates task state)
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return; // Ignore if dropped outside

    // Get source & destination lists
    const sourceList = tasks[source.droppableId];
    const destinationList = tasks[destination.droppableId];

    // Find the dragged task
    const movedTask = sourceList.find(task => task.id === draggableId);

    // Remove from source & add to destination
    const newSourceList = sourceList.filter(task => task.id !== draggableId);
    const newDestinationList = [...destinationList, movedTask];

    // Update state
    setTasks({
      ...tasks,
      [source.droppableId]: newSourceList,
      [destination.droppableId]: newDestinationList,
    });

    // Log final status after drop
    console.log(`Task "${movedTask.title}" moved to "${destination.droppableId}"`);
  };

  const handleAddTask = (newTask) => {
    // Add task to the 'todo' list by default
    setTasks(prevTasks => ({
      ...prevTasks,
      todo: [...prevTasks.todo, newTask]
    }));
  };

  return (
    <div className="flex flex-col font-anek p-5 h-screen">
      {/* Header */}
      <div className="flex border border-gray-300 rounded-xl p-3 items-center">
        <div className="flex flex-col border-r border-gray-400 pr-10">
          <h1 className="text-[20px] font-semibold">May</h1>
          <h4 className="text-[15px] font-medium text-gray-700">
            Today is Saturday, May 9th, 2025
          </h4>
        </div>
        <div className="flex pl-5 items-center gap-2 flex-1">
          <h1 className="text-[23px] font-semibold">Board</h1>
          <div className="text-[19px] font-medium text-gray-700">-</div>
          <h4 className="text-[19px] font-medium text-gray-700">Daily Tasks</h4>
        </div>
        <div className="flex gap-5">
          <button className="text-[19px] font-semibold flex border-2 border-gray-300 rounded-xl w-[124px] justify-center pt-2">
            <MdOutlineTune className="h-[23px] w-[28px]" />
            Filters
          </button>
          <button 
                        onClick={() => setIsTaskFormOpen(true)}

            className="text-[19px] font-semibold bg-black text-white rounded-xl w-[124px] justify-center pt-2">
            Create
          </button>
        </div>
      </div>

      {/* Task Board */}
      <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
        <div className="flex items-start pt-5 gap-5 overflow-auto h-full">
          {Object.entries(tasks).map(([status, taskList]) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-col border border-gray-300 rounded-xl flex-1 min-h-[300px]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between border-b border-gray-300 h-full py-3 px-2">
                    <div className="flex text-gray-800 items-center gap-2">
                      <BsCaretRightFill className="w-[16px] h-[19px]" />
                      <h1 className="font-semibold text-[18px] pt-1.5 capitalize">{status.replace(/([A-Z])/g, ' $1')}</h1>
                    </div>
                    <div className="flex text-gray-700 items-center gap-2">
                      <HiPlus className="w-[19px] h-[19px]" />
                      <HiOutlineDotsVertical className="w-[18px] h-[18px]" />
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="p-3 overflow-auto">
                    {taskList.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white shadow-md rounded-lg p-4 mb-3 border border-gray-300 cursor-pointer"
                          >
                            {task.title}
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
        />
      )}
    </div>
  );
};
