import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompanyJobsByUserId } from '../services/services';

export interface Job {
    jobId: string;
    role: string;
    avgExperience?: number;
    qualification?: string;
    minSalary?: number;
    maxSalary?: number;
    type?: string;
    preference?: string;
    benefits?: string;
    companyName?: string;
}

const JobPage: React.FC = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 6;

    const fetchJobs = async () => {
        try {
            const userId = Number(sessionStorage.getItem('userId'));
            if (!userId) return;
            const jobList = await getCompanyJobsByUserId(userId);
            setJobs(jobList);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    // 计算当前页面显示的工作
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(jobs.length / jobsPerPage);

    // 页面导航函数
    const goToPage = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const formatExperience = (experience?: number) => {
        return experience ? `${Math.round(experience)} years` : 'N/A';
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleBackHome = () => {
        navigate('/home');
    };

    return (
        <div className="relative flex min-h-screen bg-gradient-to-r from-blue-50 to-green-50">
            <div className="container mx-auto p-6">
                <div className="text-left mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Discover Your Next Opportunity
                    </h1>
                    <p className="text-gray-600">
                        Here are the jobs we find may fit you (Based on companies).
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentJobs.map((job) => (
                        <div
                            key={job.jobId}
                            className="border border-gray-300 rounded-lg p-6 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
                        >
                            <h2 className="text-xl font-semibold text-blue-700">{job.role}</h2>
                            <p className="text-gray-700">Company: {job.companyName || 'N/A'}</p>
                            <p className="text-gray-700">Salary: {job.minSalary ? `${job.minSalary}K` : 'N/A'} - {job.maxSalary ? `${job.maxSalary}K` : 'N/A'}</p>
                            <p className="text-gray-700">Type: {job.type || 'N/A'}</p>
                            <p className="text-gray-700">Preference: {job.preference || 'N/A'}</p>
                            <p className="text-gray-700">Benefits: {job.benefits || 'N/A'}</p>
                            <p className="text-gray-700">Qualification: {job.qualification || 'N/A'}</p>
                            <p className="text-gray-700">Average Experience: {formatExperience(job.avgExperience)}</p>
                        </div>
                    ))}
                </div>

                {/* 添加分页控件 */}
                <div className="mt-8 flex justify-center items-center space-x-4">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-300"
                    >
                        Previous
                    </button>
                    
                    <div className="flex space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => goToPage(pageNum)}
                                className={`px-4 py-2 rounded-md transition-colors duration-300 
                                    ${currentPage === pageNum 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                {pageNum}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-300"
                    >
                        Next
                    </button>
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleBackHome}
                        className="px-8 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobPage;
