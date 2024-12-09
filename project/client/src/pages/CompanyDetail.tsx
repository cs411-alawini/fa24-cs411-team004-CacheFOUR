import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getCompanyInfoByName } from '../services/services';

const CompanyDetailPage: React.FC = () => {
    const { companyName } = useParams<{ companyName: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        showSidebar = false,
        showUserButton = false,
        showConfirm = false,
        showUpdateCom = false,
    } = location.state || {};

    const [companyDetails, setCompanyDetails] = useState({
        size: '',
        ceo: '',
        industry: '',
        website: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            if (companyName) {
                try {
                    const details = await getCompanyInfoByName(companyName);
                    setCompanyDetails({
                        size: details.size ? details.size.toString() : 'N/A',
                        ceo: details.ceo || 'N/A',
                        industry: details.industry || 'N/A',
                        website: details.website || 'N/A',
                    });
                } catch (error) {
                    setError('Failed to fetch company details. Please try again.');
                }
            }
        };

        fetchCompanyDetails();
    }, [companyName]);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                    <h1 className="text-3xl font-bold text-white">Company Details</h1>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 border-l-4 border-red-500">
                        {error}
                    </div>
                )}

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Company Name</p>
                            <p className="text-lg font-semibold text-gray-900">{companyName || 'N/A'}</p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Size</p>
                            <p className="text-lg font-semibold text-gray-900">{companyDetails.size}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">CEO</p>
                            <p className="text-lg font-semibold text-gray-900">{companyDetails.ceo}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Industry</p>
                            <p className="text-lg font-semibold text-gray-900">{companyDetails.industry}</p>
                        </div>

                        <div className="sm:col-span-2 bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Website</p>
                            <a
                                href={companyDetails.website !== 'N/A' 
                                    ? (companyDetails.website.startsWith('http') 
                                        ? companyDetails.website 
                                        : `https://${companyDetails.website}`)
                                    : '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                {companyDetails.website}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t">
                    <button
                        onClick={() =>
                            navigate('/company-selection', {
                                state: {
                                    showSidebar,
                                    showUserButton,
                                    showConfirm,
                                    showUpdateCom,
                                },
                            })
                        }
                        className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <span>←</span> Back to Company Selection
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetailPage;
