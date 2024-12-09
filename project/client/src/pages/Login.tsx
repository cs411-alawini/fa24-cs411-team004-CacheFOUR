import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../services/services';

const LoginPage: React.FC = () => {
    const [name, setName] = useState('');
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError('');
        if (!name || !userId) {
            setError('Please enter both name and user ID.');
            return;
        }

        try {
            const userIdNumber = parseInt(userId, 10);
            if (isNaN(userIdNumber)) {
                setError('User ID must be a number.');
                return;
            }

            const user = await getUserInfo(userIdNumber, name);
            if (user) {
                // Store user information in sessionStorage
                sessionStorage.setItem('userId', user.userId.toString());
                sessionStorage.setItem('name', user.name);
                sessionStorage.setItem('experience', user.experience.toString());
                sessionStorage.setItem('education', user.education || '');
                sessionStorage.setItem('idealCompany', user.idealcom || '');

                navigate('/home');
            } else {
                setError('Invalid name or user ID. Please check your details or register first.');
            }
        } catch (error) {
            setError('An error occurred during login. Please try again.');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                            User ID
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="userId"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Enter your user ID"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogin}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                        Sign In
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <span 
                                onClick={() => navigate('/register')} 
                                className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer transition-colors"
                            >
                                Create one here
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
