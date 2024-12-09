import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UserButton from '../components/UserButton';
import { getSOCDetailsByLevel} from '../services/services';  // Ensure correct import

const TagSelection: React.FC = () => {  // Renamed component to match file name
    const navigate = useNavigate();
    const [layer1, setLayer1] = useState<string[]>([]);
    const [layer2, setLayer2] = useState<string[]>([]);
    const [layer3, setLayer3] = useState<string[]>([]);
    const [layer4, setLayer4] = useState<string[]>([]);

    const [selectedLayer1, setSelectedLayer1] = useState<string>('');
    const [selectedLayer2, setSelectedLayer2] = useState<string>('');
    const [selectedLayer3, setSelectedLayer3] = useState<string>('');
    const [selectedLayer4, setSelectedLayer4] = useState<string>('');

    useEffect(() => {
        const fetchLayer1 = async () => {
            try {
                // Get major groups (level 1)
                const socDetails = await getSOCDetailsByLevel(1, '');
                const formattedSOC = socDetails.map(soc => `${soc.SOC_code} - ${soc.Name}`);
                setLayer1(formattedSOC);
            } catch (error) {
                console.error('Error fetching major groups:', error);
            }
        };
        fetchLayer1();
    }, []);

    const handleLayer1Change = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        setSelectedLayer1(selectedValue);
        setSelectedLayer2('');
        setSelectedLayer3('');
        setSelectedLayer4('');
        setLayer2([]);
        setLayer3([]);
        setLayer4([]);

        if (selectedValue) {
            try {
                // Get minor groups (level 2)
                const socCode = selectedValue.split(' - ')[0].trim();  // Extract and trim the SOC code
                const socDetails = await getSOCDetailsByLevel(2, socCode);
                const formattedSOC = socDetails.map(soc => `${soc.SOC_code} - ${soc.Name}`);
                setLayer2(formattedSOC);
            } catch (error) {
                console.error('Error fetching minor groups:', error);
            }
        }
    };

    const handleLayer2Change = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        setSelectedLayer2(selectedValue);
        setSelectedLayer3('');
        setSelectedLayer4('');
        setLayer3([]);
        setLayer4([]);

        if (selectedValue) {
            try {
                // Get broad groups (level 3)
                const socCode = selectedValue.split(' - ')[0].trim();  // Ensure trimming
                const socDetails = await getSOCDetailsByLevel(3, socCode);
                const formattedSOC = socDetails.map(soc => `${soc.SOC_code} - ${soc.Name}`);
                setLayer3(formattedSOC);
            } catch (error) {
                console.error('Error fetching broad groups:', error);
            }
        }
    };

    const handleLayer3Change = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        setSelectedLayer3(selectedValue);
        setSelectedLayer4('');
        setLayer4([]);

        if (selectedValue) {
            try {
                // Get detailed occupations (level 4)
                const socCode = selectedValue.split(' - ')[0].trim();  // Ensure trimming
                const socDetails = await getSOCDetailsByLevel(4, socCode);
                const formattedSOC = socDetails.map(soc => `${soc.SOC_code} - ${soc.Name}`);
                setLayer4(formattedSOC);
            } catch (error) {
                console.error('Error fetching detailed occupations:', error);
            }
        }
    };

    const handleLayer4Change = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        setSelectedLayer4(selectedValue);
    };

    const handleViewDetailsClick = () => {
        if (!selectedLayer4) return;
        
        // Make sure to store just the SOC code without the name
        const socCode = selectedLayer4.split(' - ')[0].trim();
        const socName = selectedLayer4.split(' - ')[1].trim();
        sessionStorage.setItem('selectedSOC', socCode);
        sessionStorage.setItem('selectedSOCName', socName);
        
        navigate('/find-jobs-tag');
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className="w-64">
                <Sidebar />
            </div>
            <div className="flex-1 container mx-auto p-8">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Select Occupation Category</h1>
                        <UserButton />
                    </div>

                    <div className="space-y-6">
                        {/* Major Group Selection */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <label htmlFor="industry" className="block text-lg font-semibold text-gray-700 mb-3">
                                Major Group (First 2 digits)
                            </label>
                            <select
                                id="industry"
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                value={selectedLayer1}
                                onChange={handleLayer1Change}
                            >
                                <option value="">-- Select Major Group --</option>
                                {layer1.filter(Boolean).sort().map((industry) => (
                                    <option key={industry} value={industry}>
                                        {industry}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Minor Group Selection */}
                        {selectedLayer1 && (
                            <div className="bg-white p-6 rounded-lg border border-gray-200">
                                <label htmlFor="category" className="block text-lg font-semibold text-gray-700 mb-3">
                                    Minor Group (First 3 digits)
                                </label>
                                <select
                                    id="category"
                                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                    value={selectedLayer2}
                                    onChange={handleLayer2Change}
                                >
                                    <option value="">-- Select Minor Group --</option>
                                    {layer2.filter(Boolean).sort().map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Broad Group Selection */}
                        {selectedLayer2 && (
                            <div className="bg-white p-6 rounded-lg border border-gray-200">
                                <label htmlFor="role" className="block text-lg font-semibold text-gray-700 mb-3">
                                    Broad Group (First 4 digits)
                                </label>
                                <select
                                    id="role"
                                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                    value={selectedLayer3}
                                    onChange={handleLayer3Change}
                                >
                                    <option value="">-- Select Broad Group --</option>
                                    {layer3.filter(Boolean).sort().map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Detailed Occupation Selection */}
                        {selectedLayer3 && (
                            <div className="bg-white p-6 rounded-lg border border-gray-200">
                                <label htmlFor="job" className="block text-lg font-semibold text-gray-700 mb-3">
                                    Detailed Occupation (Full 6 digits)
                                </label>
                                <select
                                    id="job"
                                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                    value={selectedLayer4}
                                    onChange={handleLayer4Change}
                                >
                                    <option value="">-- Select Detailed Occupation --</option>
                                    {layer4.filter(Boolean).sort().map((job) => (
                                        <option key={job} value={job}>
                                            {job}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* View Details Button */}
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={handleViewDetailsClick}
                                disabled={!selectedLayer4}
                                className={`
                                    px-8 py-4 rounded-md text-lg font-semibold
                                    transition-all duration-200 
                                    ${!selectedLayer4 
                                        ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                        : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl'
                                    }
                                `}
                            >
                                {!selectedLayer4 ? 'Please Complete Selection' : 'View Job Details'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TagSelection;
