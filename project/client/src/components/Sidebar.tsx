import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();

    const goToCompanySelection = () => {
        navigate('/company-selection', { state: {showSidebar: true, showUserButton: true} });
    };

    const goToJobExploration = () => {
        navigate('/job-exploration', { state: {showSidebar: true, showUserButton: true} });
    };

    const buttonClass = "mb-4 p-4 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-lg text-left transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg";

    return (
        <div className="w-72 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col p-6 shadow-2xl">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Main Menu
            </h2>
            
            <button
                onClick={() => navigate('/home')}
                className={buttonClass}
            >
                <span className="flex items-center space-x-3">
                    <span className="text-lg">🏠</span>
                    <span>Home</span>
                </span>
            </button>
            
            <button
                onClick={goToCompanySelection}
                className={buttonClass}
            >
                <span className="flex items-center space-x-3">
                    <span className="text-lg">🏢</span>
                    <span>Learn Companies</span>
                </span>
            </button>
            
            <button
                onClick={goToJobExploration}
                className={buttonClass}
            >
                <span className="flex items-center space-x-3">
                    <span className="text-lg">🏷️</span>
                    <span>Learn Tags</span>
                </span>
            </button>
            
            <button
                onClick={() => navigate('/courses')}
                className={buttonClass}
            >
                <span className="flex items-center space-x-3">
                    <span className="text-lg">✨</span>
                    <span>Explore Special</span>
                </span>
            </button>
        </div>
    );
};

export default Sidebar;
