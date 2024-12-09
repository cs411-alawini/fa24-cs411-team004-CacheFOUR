// src/components/UserButton.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserButton: React.FC = () => {
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    const handleProfileClick = () => {
        setShowMenu(!showMenu);
    };

    const handleLogout = () => {
        setShowMenu(false);
        sessionStorage.clear();
        navigate('/login');
    };

    const handleUserProfile = () => {
        setShowMenu(false);
        navigate('/userprofile');
    };

    return (
        <div className="relative">
            <button
                onClick={handleProfileClick}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
                <span className="text-lg font-bold">U</span>
            </button>

            {showMenu && (
                <div className="absolute right-0 mt-3 w-48 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-2xl transform transition-all duration-300">
                    <button
                        onClick={handleUserProfile}
                        className="block w-full px-6 py-3 text-left text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-t-lg transition-all duration-300 font-medium"
                    >
                        User Profile
                    </button>
                    <button
                        onClick={handleLogout}
                        className="block w-full px-6 py-3 text-left text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-b-lg transition-all duration-300 font-medium"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserButton;
