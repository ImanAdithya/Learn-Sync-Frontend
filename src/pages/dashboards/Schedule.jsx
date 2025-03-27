import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from "axios";
import { MdOutlineTune } from "react-icons/md";

const localizer = momentLocalizer(moment);

export const Schedule = () => {
  const [date, setDate] = useState(new Date());
  const userId = localStorage.getItem("userId");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getAllTasks();
  }, []);

  const getAllTasks = () => {
    axios.get(`http://localhost:4000/api/task/${userId}`)
      .then((response) => {
        // Transform tasks to match react-big-calendar event format
        const formattedTasks = response.data.map(task => ({
          title: task.taskTitle,
          start: new Date(task.dueDate),
          end: new Date(task.dueDate),
          description: task.description,
          priority: task.priority,
          status: task.status,
          completed: task.completed
        }));
        setTasks(formattedTasks);
        console.log("FETCHED TASKS", formattedTasks);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  };

  // Custom event rendering based on priority and status
  const eventStyleGetter = (event) => {
    let backgroundColor = '#3B82F6'; // default blue
    
    // Color code based on priority
    switch(event.priority) {
      case 'High':
        backgroundColor = '#EF4444'; // red for high priority
        break;
      case 'Medium':
        backgroundColor = '#F59E0B'; // yellow for medium priority
        break;
      case 'Low':
        backgroundColor = '#10B981'; // green for low priority
        break;
    }

    // Adjust style for completed tasks
    const style = {
      backgroundColor: event.completed ? '#6B7280' : backgroundColor, // gray if completed
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: 'none',
      display: 'block',
      padding: '2px 5px'
    };
    return { style };
  };

  // Custom event component to show more details
  const CustomEvent = ({ event }) => (
    <div 
      title={`${event.description || 'No description'}\nPriority: ${event.priority}\nStatus: ${event.status}`}
    >
      <strong>{event.title}</strong>
      {event.completed && <span className="ml-1">(Completed)</span>}
    </div>
  );

  return (
    <div className="h-screen p-4 font-anek">

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
                  <h4 className="text-[17px] font-medium text-gray-700">Daily Schedule</h4>
                </div>
              </div>

      <Calendar
        localizer={localizer}
        events={tasks}
        startAccessor="start"
        endAccessor="end"
        date={date}
        onNavigate={(newDate) => setDate(newDate)}
        views={['month']}
        view={'month'}
        components={{
          event: CustomEvent
        }}
        eventPropGetter={eventStyleGetter}
        className="h-full mt-7"
        style={{ height: 'calc(100vh - 100px)' }}
      />
    </div>
  );
};

export default Schedule;