import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enrollAndFetchJobs } from '../services/services';

interface Job {
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
    favorite?: boolean;
}

const JobCour: React.FC = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'salary' | 'experience' | 'none'>('none');
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 10;
    const [filters, setFilters] = useState({
        jobType: 'all',
        salaryRange: 'all',
        experienceLevel: 'all',
        showFavorites: false
    });

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
                const crnList = JSON.parse(sessionStorage.getItem('selectedCourses') || '[]');

                if (!userId || crnList.length === 0) {
                    setError('Missing userId or selected courses.');
                    return;
                }

                const fetchedJobs = await enrollAndFetchJobs(userId, crnList);
                setJobs(fetchedJobs);
            } catch (err) {
                console.error('Error fetching jobs:', err);
                setError('Failed to fetch jobs.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const handleBackHome = () => {
        navigate('/home');
    };

    const toggleFavorite = (jobId: string) => {
        setJobs(jobs.map(job => 
            job.jobId === jobId ? { ...job, favorite: !job.favorite } : job
        ));
    };

    const getFilteredAndSortedJobs = () => {
        let filtered = jobs.filter(job => {
            const matchesSearch = 
                job.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesJobType = 
                filters.jobType === 'all' || 
                job.type?.toLowerCase() === filters.jobType;
            
            const matchesSalary = filters.salaryRange === 'all' || (
                filters.salaryRange === 'low' ? (job.maxSalary || 0) <= 80000 :
                filters.salaryRange === 'medium' ? (job.maxSalary || 0) <= 120000 && (job.maxSalary || 0) > 80000 :
                (job.maxSalary || 0) > 120000
            );

            const matchesExperience = filters.experienceLevel === 'all' || (
                filters.experienceLevel === 'entry' ? (job.avgExperience || 0) <= 2 :
                filters.experienceLevel === 'mid' ? (job.avgExperience || 0) <= 5 && (job.avgExperience || 0) > 2 :
                (job.avgExperience || 0) > 5
            );

            const matchesFavorites = !filters.showFavorites || job.favorite;

            return matchesSearch && matchesJobType && matchesSalary && matchesExperience && matchesFavorites;
        });

        if (sortBy === 'salary') {
            filtered = filtered.sort((a, b) => (b.maxSalary || 0) - (a.maxSalary || 0));
        } else if (sortBy === 'experience') {
            filtered = filtered.sort((a, b) => (b.avgExperience || 0) - (a.avgExperience || 0));
        }

        const indexOfLastJob = currentPage * jobsPerPage;
        const indexOfFirstJob = indexOfLastJob - jobsPerPage;
        return {
            paginatedJobs: filtered.slice(indexOfFirstJob, indexOfLastJob),
            totalJobs: filtered.length
        };
    };

    const totalPages = Math.ceil(getFilteredAndSortedJobs().totalJobs / jobsPerPage);

    return (
        <div className="relative min-h-screen bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Recommended Jobs Based on Your Courses
                    </h1>
                    <p className="mt-2 text-gray-600">We've found some positions that match your academic profile.</p>
                </div>

                <div className="mb-6 space-y-4">
                    <div className="flex flex-wrap gap-4">
                        <input
                            type="text"
                            placeholder="Search jobs or companies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-5 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                        />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'salary' | 'experience' | 'none')}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="none">Sort by...</option>
                            <option value="salary">Highest Salary</option>
                            <option value="experience">Most Experience</option>
                        </select>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <select
                            value={filters.jobType}
                            onChange={(e) => setFilters({...filters, jobType: e.target.value})}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Job Types</option>
                            <option value="full-time">Full-Time</option>
                            <option value="part-time">Part-Time</option>
                            <option value="contract">Contract</option>
                            <option value="intern">Intern</option>
                        </select>

                        <select
                            value={filters.salaryRange}
                            onChange={(e) => setFilters({...filters, salaryRange: e.target.value})}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Salary Ranges</option>
                            <option value="low">Up to 80K</option>
                            <option value="medium">80K - 120K</option>
                            <option value="high">120K+</option>
                        </select>

                        <select
                            value={filters.experienceLevel}
                            onChange={(e) => setFilters({...filters, experienceLevel: e.target.value})}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Experience Levels</option>
                            <option value="entry">Entry Level (0-2 years)</option>
                            <option value="mid">Mid Level (2-5 years)</option>
                            <option value="senior">Senior Level (5+ years)</option>
                        </select>

                        <button
                            onClick={() => setFilters({...filters, showFavorites: !filters.showFavorites})}
                            className={`px-4 py-2 border rounded-lg focus:outline-none transition-colors duration-200 ${
                                filters.showFavorites 
                                    ? 'bg-pink-500 text-white border-pink-500' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {filters.showFavorites ? '❤️ Showing Favorites' : '🤍 Show All Jobs'}
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                        <p>{error}</p>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-600">No jobs found for the selected courses.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {getFilteredAndSortedJobs().paginatedJobs.map((job) => (
                            <div
                                key={job.jobId}
                                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h2 className="text-xl font-bold text-gray-800">{job.role}</h2>
                                        <button 
                                            onClick={() => toggleFavorite(job.jobId)}
                                            className="text-2xl focus:outline-none"
                                        >
                                            {job.favorite ? '❤️' : '🤍'}
                                        </button>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <span className="text-blue-600 font-medium">{job.companyName || 'Company N/A'}</span>
                                    </div>
                                    <div className="space-y-2 text-gray-600">
                                        <div className="flex items-center">
                                            <span className="font-medium w-32">Salary Range:</span>
                                            <span>{job.minSalary ? `${job.minSalary}K` : 'N/A'} - {job.maxSalary ? `${job.maxSalary}K` : 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium w-32">Job Type:</span>
                                            <span>{job.type || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium w-32">Experience:</span>
                                            <span>{job.avgExperience ? `${Math.round(job.avgExperience)} years` : 'N/A'}</span>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <p className="font-medium mb-1">Benefits:</p>
                                            <p className="text-gray-500">
                                                {job.benefits ? 
                                                    job.benefits.replace(/[{}']/g, '') : 
                                                    'N/A'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-8 flex justify-center space-x-4">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>

                <div className="mt-4 flex justify-center">
                    <button
                        onClick={handleBackHome}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobCour;
