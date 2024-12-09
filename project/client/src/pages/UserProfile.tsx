import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UserButton from '../components/UserButton';
import { updateUserInfo, deleteUser, createExperienceTrigger } from '../services/services';

const UserProfile: React.FC = () => {
    const navigate = useNavigate();

    const [showSidebar] = useState(true);
    const [showUserButton] = useState(true);

    const [name, setName] = useState(sessionStorage.getItem('name') || 'N/A');
    const [userId] = useState(sessionStorage.getItem('userId'));
    const [experience, setExperience] = useState(sessionStorage.getItem('experience') || 'N/A');
    const [education, setEducation] = useState(sessionStorage.getItem('education') || 'N/A');
    const [idealCompany] = useState(sessionStorage.getItem('idealCompany') || 'N/A');

    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const initializeTrigger = async () => {
        try {
            await createExperienceTrigger();
            console.log('Trigger created successfully.');
        } catch (error: any) {
            if (error.response?.data?.message === 'Trigger already exists') {
                console.log('Trigger already exists, skipping creation.');
            } else {
                console.error('Failed to create trigger:', error);
            }
        }
    };

    useEffect(() => {
        initializeTrigger();
    }, []);

    const handleSave = async () => {
        setError('');

        // const currentExperience = parseInt(sessionStorage.getItem('experience') || '0', 10);
        const newExperience = parseInt(experience, 10);

        if (!name || !experience || !education || !idealCompany) {
            setError('Required fields missing.');
            return;
        }

        if (isNaN(newExperience) || newExperience < 0) {
            setError('Years of Work Experience must be a non-negative integer.');
            return;
        }

        /*if (newExperience < currentExperience) {
            setError('You cannot decrease your work experience.');
            return;
        }*/

        try {
            await updateUserInfo({
                userId: parseInt(userId || '0'),
                name,
                experience: newExperience,
                education,
                idealcom: idealCompany,
            });

            sessionStorage.setItem('name', name);
            sessionStorage.setItem('experience', experience);
            sessionStorage.setItem('education', education);
            sessionStorage.setItem('idealCompany', idealCompany);

            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            setError('An error occurred while updating your profile. Please try again.');
            console.error(error);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteUser(parseInt(userId || '0', 10));
            sessionStorage.clear();
            alert('Your account has been deleted.');
            navigate('/login');
        } catch (error) {
            setError('An error occurred while deleting your account. Please try again.');
            console.error(error);
        }
    };

    const handleCompanySelection = () => {
        navigate('/company-selection', {
            state: {
                showSidebar: true,
                showUserButton: true,
                showUpdateCom: true,
            },
        });
    };

    const handleFindJobs = () => {
        navigate('/find-jobs-com');
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className="w-64">
                {showSidebar && <Sidebar />}
            </div>
            <div className="flex-1 container mx-auto p-8">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
                        {showUserButton && <UserButton />}
                    </div>
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    <div className="space-y-8">
                        {/* Basic Information Section */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-600">Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    ) : (
                                        <p className="text-gray-800 py-2">{name}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-600">User ID</label>
                                    <p className="text-gray-800 py-2">{userId}</p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Details Section */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Profile Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-600">Years of Experience</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={experience}
                                            onChange={(e) => setExperience(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            min={0}
                                        />
                                    ) : (
                                        <p className="text-gray-800 py-2">{experience}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-600">Education Level</label>
                                    {isEditing ? (
                                        <select
                                            value={education}
                                            onChange={(e) => setEducation(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="N/A">N/A</option>
                                            <option value="High School">High School</option>
                                            <option value="B.Com">B.Com</option>
                                            <option value="B.Tech">B.Tech</option>
                                            <option value="BA">BA</option>
                                            <option value="BBA">BBA</option>
                                            <option value="BCA">BCA</option>
                                            <option value="M.Com">M.Com</option>
                                            <option value="M.Tech">M.Tech</option>
                                            <option value="MBA">MBA</option>
                                            <option value="MCA">MCA</option>
                                            <option value="PhD">PhD</option>
                                        </select>
                                    ) : (
                                        <p className="text-gray-800 py-2">{education}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* User Preferences Section */}
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-700 mb-6">User Preferences</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-600">Ideal Company</label>
                                    {isEditing ? (
                                        <button
                                            onClick={handleCompanySelection}
                                            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                                        >
                                            Choose Company
                                        </button>
                                    ) : (
                                        <p className="text-gray-800 py-2">{idealCompany}</p>
                                    )}
                                </div>
                                <button
                                    onClick={handleFindJobs}
                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    <span>Find your jobs here</span>
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-10 flex flex-col items-center space-y-4">
                        {!isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Update Profile
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="w-full md:w-auto px-8 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors"
                                >
                                    Delete Account
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleSave}
                                className="w-full md:w-auto px-8 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
                            >
                                Save Changes
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
