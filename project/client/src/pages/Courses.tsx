import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UserButton from '../components/UserButton';
import { getCourseList } from '../services/services';

interface Course {
    CRN: string;
    CourseName: string;
}

const SelectYourCourses: React.FC = () => {
    const [showSidebar] = useState(true);
    const [showUserButton] = useState(true);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const courseList: any[] = await getCourseList();
                const formattedCourses = courseList.map(item => ({
                    CRN: item.CRN,
                    CourseName: item.CourseName
                }));
                formattedCourses.sort((a, b) => a.CRN.localeCompare(b.CRN));
                setCourses(formattedCourses);
            } catch (error) {
                console.error('Error fetching course list:', error);
                alert('Failed to load courses. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleSelect = (crn: string) => {
        if (selectedCourses.includes(crn)) {
            setSelectedCourses(selectedCourses.filter((c) => c !== crn));
        } else {
            setSelectedCourses([...selectedCourses, crn]);
        }
    };

    const handleConfirm = () => {
        if (selectedCourses.length === 0) {
            alert('Please select at least one course!');
            return;
        }

        sessionStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
        navigate('/find-jobs-cour');
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {showSidebar && <Sidebar />}
            <div className="flex-1 relative">
                <div className="container mx-auto p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
                            Select Your Courses
                            <span className="block text-lg font-normal text-gray-600 mt-2">
                                Choose the courses you have taken or plan to take
                            </span>
                        </h1>
                        {showUserButton && <UserButton />}
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Course Selection Panel */}
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                                    <span className="mr-2">Available Courses</span>
                                    {loading && (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                    )}
                                </h2>
                                
                                {!loading && (
                                    <div className="max-h-[500px] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50">
                                        {courses.map((course) => (
                                            <label
                                                key={course.CRN}
                                                className="flex items-center px-4 py-3 hover:bg-blue-50 transition-colors duration-150 cursor-pointer border-b border-gray-200 last:border-b-0"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                    checked={selectedCourses.includes(course.CRN)}
                                                    onChange={() => handleSelect(course.CRN)}
                                                />
                                                <span className="ml-3 text-gray-700 flex-1">
                                                    <span className="font-medium">{course.CRN}</span>
                                                    <span className="mx-2">-</span>
                                                    <span>{course.CourseName}</span>
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Selected Courses Panel */}
                            <div>
                                <div className="bg-blue-50 p-6 rounded-lg mb-6 border border-blue-100">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Selected Courses</h3>
                                    <div className="space-y-2">
                                        {selectedCourses.length > 0 ? (
                                            selectedCourses.map(crn => (
                                                <div key={crn} className="flex items-center justify-between bg-white p-2 rounded">
                                                    <span className="text-gray-700">{crn}</span>
                                                    <button
                                                        onClick={() => handleSelect(crn)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 italic">No courses selected</p>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={handleConfirm}
                                    className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                                             transition-all duration-200 font-medium shadow-md transform hover:scale-[1.02]
                                             disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={selectedCourses.length === 0}
                                >
                                    {selectedCourses.length === 0 ? 'Please Select Courses' : 'Confirm Selection & Find Jobs'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectYourCourses;
