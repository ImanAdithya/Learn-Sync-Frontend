import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Target, 
  Clock,
  BarChart2,
  BookOpen,
  Brain,
  Calculator,
  Microscope,
  Atom
} from 'lucide-react';

export const Dashboard = () => {
  const [username, setUsername] = useState('Emma Johnson');
  
  // Productivity Data for Chart
  const productivityData = [
    { date: 'Mar 20', studyHours: 3.5, quizScore: 75, taskCompleted: 4 },
    { date: 'Mar 21', studyHours: 4.2, quizScore: 82, taskCompleted: 5 },
    { date: 'Mar 22', studyHours: 3.8, quizScore: 79, taskCompleted: 3 },
    { date: 'Mar 23', studyHours: 4.5, quizScore: 85, taskCompleted: 6 },
    { date: 'Mar 24', studyHours: 4.0, quizScore: 80, taskCompleted: 5 },
    { date: 'Mar 25', studyHours: 4.7, quizScore: 88, taskCompleted: 7 },
    { date: 'Mar 26', studyHours: 4.3, quizScore: 83, taskCompleted: 5 }
  ];

  // MCQ Practice Sessions
  const [mcqSessions, setMcqSessions] = useState([
    {
      id: 1,
      subject: 'Mathematics',
      totalQuestions: 20,
      correctAnswers: 16,
      date: 'Mar 25, 2024',
      score: '80%',
      difficulty: 'Medium',
      icon: <Calculator className="text-blue-500" />
    },
    {
      id: 2,
      subject: 'Physics',
      totalQuestions: 15,
      correctAnswers: 12,
      date: 'Mar 26, 2024',
      score: '80%',
      difficulty: 'Hard',
      icon: <Atom className="text-green-500" />
    },
    {
      id: 3,
      subject: 'Biology',
      totalQuestions: 18,
      correctAnswers: 15,
      date: 'Mar 27, 2024',
      score: '83%',
      difficulty: 'Medium',
      icon: <Microscope className="text-purple-500" />
    }
  ]);

  // Study Breakdown
  const studyBreakdown = [
    { 
      subject: 'Mathematics', 
      time: '1h 30m', 
      progress: 85,
      icon: <Calculator className="text-blue-500" />
    },
    { 
      subject: 'Physics', 
      time: '1h 15m', 
      progress: 70,
      icon: <Atom className="text-green-500" />
    },
    { 
      subject: 'Biology', 
      time: '1h', 
      progress: 75,
      icon: <Microscope className="text-purple-500" />
    }
  ];

  // Productivity Metrics
  const productivityMetrics = [
    { 
      icon: <Clock />, 
      title: 'Study Time Today', 
      value: '4h 15m', 
      trend: 'up',
      color: 'text-blue-500'
    },
    { 
      icon: <BarChart2 />, 
      title: 'Productivity Score', 
      value: '78%', 
      trend: 'up',
      color: 'text-green-500'
    },
    { 
      icon: <Target />, 
      title: 'Daily Goal Progress', 
      value: '65%', 
      trend: 'up',
      color: 'text-yellow-500'
    },
    { 
        icon: <Target />, 
        title: 'Completed Tasks', 
        value: '75%', 
        trend: 'up',
        color: 'text-green-500'
      }
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {username}
          </h1>
          <p className="text-gray-600">Your academic growth journey</p>
        </div>

        {/* Productivity Metrics */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {productivityMetrics.map((metric, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 hover:shadow-lg transition-shadow"
            >
              <div className={`${metric.color} text-2xl`}>{metric.icon}</div>
              <div>
                <p className="text-gray-500 text-sm">{metric.title}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
            </div>
          ))}
        </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-3 gap-6">
          {/* MCQ Practice Sessions */}
          <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">MCQ Practice Sessions</h2>
              <button className="text-blue-500 hover:underline">Start New Quiz</button>
            </div>
            {mcqSessions.map(session => (
              <div 
                key={session.id} 
                className="flex justify-between items-center border-b py-3 last:border-b-0"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{session.icon}</div>
                  <div>
                    <p className="font-medium">{session.subject} MCQ</p>
                    <p className="text-sm text-gray-500">
                      {session.correctAnswers}/{session.totalQuestions} Correct
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span 
                    className={`px-2 py-1 rounded text-xs ${
                      session.difficulty === 'Hard'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {session.difficulty}
                  </span>
                  <span 
                    className={`px-2 py-1 rounded text-xs ${
                      session.score === '80%' 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {session.score}
                  </span>
                  <p className="text-sm text-gray-500">{session.date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Study Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Study Breakdown</h2>
            {studyBreakdown.map((study, index) => (
              <div 
                key={index} 
                className="mb-4 last:mb-0"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="text-xl">{study.icon}</div>
                    <p className="font-medium">{study.subject}</p>
                  </div>
                  <p className="text-sm text-gray-500">{study.time}</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{width: `${study.progress}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Productivity Insights */}
          <div className="bg-white p-6 rounded-lg shadow-md col-span-3">
            <h2 className="text-xl font-semibold mb-4">Productivity Insights</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">5</div>
                <p className="text-sm text-gray-600">Subjects Studied</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">24</div>
                <p className="text-sm text-gray-600">Study Hours</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">85%</div>
                <p className="text-sm text-gray-600">Avg. Quiz Score</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500">12</div>
                <p className="text-sm text-gray-600">Completed Tasks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Productivity Analytics Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Productivity Analytics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: '#f0f0f0', border: 'none' }}
                itemStyle={{ color: '#333' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="studyHours" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                name="Study Hours"
              />
              <Line 
                type="monotone" 
                dataKey="quizScore" 
                stroke="#82ca9d" 
                name="Quiz Score"
              />
              <Line 
                type="monotone" 
                dataKey="taskCompleted" 
                stroke="#ffc658" 
                name="Tasks Completed"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;