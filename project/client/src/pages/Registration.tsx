import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signUpUser } from '../services/services';

const RegistrationPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 初始值从 sessionStorage 恢复
    const [name, setName] = useState(sessionStorage.getItem('name') || '');
    const [experience, setExperience] = useState(sessionStorage.getItem('experience') || '');
    const [education, setEducation] = useState(sessionStorage.getItem('education') || '');
    const [idealCompany, setIdealCompany] = useState(sessionStorage.getItem('idealCompany') || '');
    const [error, setError] = useState('');

    // 如果有从 CompanySelection 返回的 selectedCompany，则更新 idealCompany
    useEffect(() => {
        if (location.state && location.state.selectedCompany) {
            setIdealCompany(location.state.selectedCompany);
            sessionStorage.setItem('idealCompany', location.state.selectedCompany); // 保存到 sessionStorage
        }
    }, [location.state]);

    // 每次用户输入时更新 sessionStorage
    const handleInputChange = (key: string, value: string) => {
        sessionStorage.setItem(key, value);
        if (key === 'name') setName(value);
        if (key === 'experience') setExperience(value);
        if (key === 'education') setEducation(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError('');

        if (!name || !experience || !education || !idealCompany) {
            setError('Required fields missing.');
            return;
        }

        const experienceValue = parseInt(experience, 10);
        if (isNaN(experienceValue) || experienceValue < 0) {
            setError('Years of Work Experience must be a non-negative integer.');
            return;
        }

        try {
            const newUser = {
                name,
                experience: experienceValue,
                education,
                idealcom: idealCompany,
            };

            const response = await signUpUser(newUser);
            alert(`Form submitted successfully! Your user ID is: ${response.userId}`);
            sessionStorage.clear();
            navigate('/login');
        } catch (error) {
            setError('An error occurred during registration. Please try again.');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
            <div className="container mx-auto max-w-2xl bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
                    Create Your Account
                </h1>
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-gray-700 font-medium">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="experience" className="text-gray-700 font-medium">Years of Work Experience</label>
                        <input
                            type="number"
                            id="experience"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={experience}
                            onChange={(e) => handleInputChange('experience', e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="education" className="text-gray-700 font-medium">Education Level</label>
                        <select
                            id="education"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={education}
                            onChange={(e) => handleInputChange('education', e.target.value)}
                            required
                        >
                            <option value="">-- Select --</option>
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
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="idealCompany" className="text-gray-700 font-medium">Ideal Company</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="idealCompany"
                                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                                value={idealCompany}
                                placeholder="Choose your ideal company"
                                readOnly
                            />
                            <Link
                                to="/company-selection"
                                state={{ showConfirm: true }}
                                className="mt-2 inline-block text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                                Find your ideal companies
                            </Link>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300 mt-8"
                    >
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegistrationPage;
