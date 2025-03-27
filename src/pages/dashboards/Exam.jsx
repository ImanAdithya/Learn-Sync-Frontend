import React, { useState } from 'react';
import { Check, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Exam = () => {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [examStarted, setExamStarted] = useState(false);

  const naviagte=useNavigate();

  const gradeSubjects = {
    '1-5': {
      title: 'Primary Level',
      subjects: ['Maths', 'Science']
    },
    '6-11': {
      title: 'Middle School',
      subjects: ['Maths', 'Science', 'History', 'ICT']
    },
    '12-13': {
      title: 'High School Specialization',
      subjects: [
        'Biology', 
        'Physical Science', 
        'Science for Technology', 
        'Information Technology', 
        'Media', 
        'Business Studies'
      ]
    }
  };

  // Determine grade range
  const getGradeRange = (grade) => {
    if (grade >= 1 && grade <= 5) return '1-5';
    if (grade >= 6 && grade <= 11) return '6-11';
    if (grade >= 12 && grade <= 13) return '12-13';
    return '';
  };

  const GradeCard = ({ grade }) => {
    const gradeRange = getGradeRange(grade);
    const isSelected = selectedGrade === grade;

    return (
      <div 
        onClick={() => {
          setSelectedGrade(grade);
          setSelectedSubject(null);
        }}
        className={`
          relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-300
          ${isSelected 
            ? 'border-blue-500 bg-blue-50 shadow-lg' 
            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'}
        `}
      >
        {isSelected && (
          <div className="absolute top-2 right-2 text-blue-500">
            <Check size={24} />
          </div>
        )}
        <div className="text-center">
          <h3 className="font-bold text-xl">Grade {grade}</h3>
          {gradeRange && (
            <p className="text-sm text-gray-600">
              {gradeSubjects[gradeRange].title}
            </p>
          )}
        </div>
      </div>
    );
  };


  const SubjectCard = ({ subject }) => {
    const isSelected = selectedSubject === subject;

    return (
      <div 
        onClick={() => setSelectedSubject(subject)}
        className={`
          relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-300
          ${isSelected 
            ? 'border-green-500 bg-green-50 shadow-lg' 
            : 'border-gray-200 hover:border-green-300 hover:bg-green-50/30'}
        `}
      >
        {isSelected && (
          <div className="absolute top-2 right-2 text-green-500">
            <Check size={24} />
          </div>
        )}
        <div className="text-center">
          <h3 className="font-bold text-lg">{subject}</h3>
        </div>
      </div>
    );
  };

  // Handle exam start
  const handleStartExam = () => {
    naviagte('/quiz');
    console.log(`Starting Exam for Grade ${selectedGrade} - ${selectedSubject}`);
  };

  // Determine available subjects based on selected grade
  const availableSubjects = selectedGrade 
    ? gradeSubjects[getGradeRange(selectedGrade)].subjects 
    : [];


  return (
    <div className="mx-auto p-6 bg-white font-anek">
      <h2 className="text-3xl font-bold text-center mb-8">Exam Subject Selection</h2>
      
      {/* Grade Selection Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Select Your Grade</h3>
        <div className="grid grid-cols-7 gap-4">
          {[...Array(13).keys()].map((index) => (
            <GradeCard key={index + 1} grade={index + 1} />
          ))}
        </div>
      </div>

      {/* Subject Selection Section */}
      {selectedGrade && (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Select Your Subject for Grade {selectedGrade}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {availableSubjects.map((subject) => (
              <SubjectCard key={subject} subject={subject} />
            ))}
          </div>
        </div>
      )}

      {/* Selection Summary with Start Exam Button */}
      {selectedSubject && (
        <div className="mt-8 p-6 bg-blue-50 rounded-lg text-center">
          <h4 className="text-2xl font-bold text-blue-800 mb-2">
            Your Selection
          </h4>
          <p className="text-xl mb-4">
            Grade: {selectedGrade} | Subject: {selectedSubject}
          </p>
          <button 
            onClick={handleStartExam}
            className="
              flex items-center justify-center 
              mx-auto px-6 py-3 
              bg-green-500 text-white 
              rounded-lg 
              hover:bg-green-600 
              transition-colors 
              duration-300
            "
          >
            <Play className="mr-2" size={24} />
            Start Exam
          </button>
        </div>
      )}
    </div>
  );
};

export default Exam;