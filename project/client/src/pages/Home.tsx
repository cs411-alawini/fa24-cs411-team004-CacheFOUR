import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import UserButton from '../components/UserButton';

const HomePage: React.FC = () => {
    const [showSidebar] = useState(true);
    const [showUserButton] = useState(true);

    return (
        <div className="relative flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            {showSidebar && <Sidebar />}

            <div className="flex-1 relative overflow-hidden">
                <div className="container mx-auto p-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-5xl font-extrabold transition-all duration-500 transform hover:scale-105 hover:rotate-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 cursor-default">
                            Welcome to Unicareer
                        </h1>
                        {showUserButton && <UserButton />}
                    </div>

                    <div className="mt-32 text-center">
                        <h2 className="text-7xl font-bold mb-8 text-gray-800 transition-all duration-500 hover:text-purple-700 cursor-default animate-bounce">
                            Hello, CS411!
                        </h2>
                        <p className="text-2xl text-gray-600 max-w-2xl mx-auto transition-all duration-500 hover:text-gray-800 cursor-default p-6 bg-white/50 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                            Start your journey to discover your dream career path
                        </p>
                        
                        <div className="mt-16">
                            <img 
                                src="/images/Unicareer.png" 
                                alt="Unicareer Logo" 
                                className="mx-auto rounded-lg shadow-lg transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
                                style={{
                                    width: '40%',
                                    maxWidth: '500px',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
