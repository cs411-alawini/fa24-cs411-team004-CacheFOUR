import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobInfoByTagName } from '../services/services';

interface Job {
    jobId: string;
    Role: string;
    AvgExperience?: number;
    Qualification?: string;
    MinSalary?: number;
    MaxSalary?: number;
    Type?: string;
    Preference?: string;
    Benefits?: string;
    CompanyName?: string;
}

const JobTag: React.FC = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [allJobs, setAllJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 10;
    const [sortBy, setSortBy] = useState<'salary' | 'experience' | 'none'>('none');
    const [filterType, setFilterType] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isGridView, setIsGridView] = useState(true);

    const getSortedAndFilteredJobs = useCallback(() => {
        let filteredJobs = [...allJobs];

        if (searchTerm) {
            filteredJobs = filteredJobs.filter(job => 
                job.Role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.CompanyName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterType !== 'all') {
            filteredJobs = filteredJobs.filter(job => job.Type === filterType);
        }

        if (sortBy === 'salary') {
            filteredJobs.sort((a, b) => (b.MaxSalary || 0) - (a.MaxSalary || 0));
        } else if (sortBy === 'experience') {
            filteredJobs.sort((a, b) => (b.AvgExperience || 0) - (a.AvgExperience || 0));
        }

        return filteredJobs;
    }, [allJobs, searchTerm, filterType, sortBy]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const userId = sessionStorage.getItem('userId');
                const tagName = sessionStorage.getItem('selectedSOC');

                if (!userId || !tagName) {
                    setError('Missing userId or selected SOC code.');
                    setLoading(false);
                    return;
                }

                const jobsData = await getJobInfoByTagName(parseInt(userId, 10), tagName);
                
                if (!jobsData || jobsData.length === 0) {
                    setError('No jobs found for this tag');
                    setAllJobs([]);
                } else {
                    setAllJobs(jobsData);
                }
            } catch (err) {
                console.error('Error fetching jobs:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
                setAllJobs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    useEffect(() => {
        const sortedAndFiltered = getSortedAndFilteredJobs();
        const maxPage = Math.max(1, Math.ceil(sortedAndFiltered.length / jobsPerPage));
        
        if (currentPage > maxPage) {
            setCurrentPage(1);
        }
        
        const startIndex = (currentPage - 1) * jobsPerPage;
        const endIndex = startIndex + jobsPerPage;
        setJobs(sortedAndFiltered.slice(startIndex, endIndex));
    }, [currentPage, searchTerm, sortBy, filterType, allJobs, getSortedAndFilteredJobs]);

    const handlePageChange = (newPage: number) => {
        const sortedAndFiltered = getSortedAndFilteredJobs();
        const maxPage = Math.max(1, Math.ceil(sortedAndFiltered.length / jobsPerPage));
        
        if (newPage >= 1 && newPage <= maxPage) {
            setCurrentPage(newPage);
        }
    };

    const renderPagination = () => {
        if (allJobs.length === 0) return null;

        return (
            <div className="flex justify-center items-center space-x-2 mt-6">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <span className="text-gray-600">
                    Page {currentPage} of {Math.ceil(allJobs.length / jobsPerPage)}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= Math.ceil(allJobs.length / jobsPerPage)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        );
    };

    const handleBackToSearch = () => {
        navigate(-1);
    };

    const formatBenefits = (benefits: string) => {
        if (!benefits) return 'N/A';
        try {
            const cleanedStr = benefits.replace(/^{'|}$/g, '');

            const benefitsArray = cleanedStr.split(', ');

            return benefitsArray.join(', ');
        } catch (error) {
            return benefits;
        }
    };

    const renderControls = () => (
        <div className="mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
                {/* Search Box */}
                <div className="flex-1">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search jobs or companies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Filters Group */}
                <div className="flex flex-wrap gap-4">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'salary' | 'experience' | 'none')}
                        className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer hover:bg-gray-50 transition-all"
                    >
                        <option value="none">Sort By</option>
                        <option value="salary">Highest Salary</option>
                        <option value="experience">Most Experience</option>
                    </select>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer hover:bg-gray-50 transition-all"
                    >
                        <option value="all">All Types</option>
                        <option value="Full-Time">Full Time</option>
                        <option value="Part-Time">Part Time</option>
                        <option value="Contract">Contract</option>
                        <option value="Temporary">Temporary</option>
                    </select>

                    <button
                        onClick={() => setIsGridView(!isGridView)}
                        className="px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2"
                    >
                        {isGridView ? (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                List View
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                Grid View
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    const renderJobCard = (job: Job) => (
        <div key={job.jobId} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{job.Role}</h2>
                        <div className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="font-medium">{job.CompanyName || 'N/A'}</span>
                        </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        job.Type === 'Full-Time' ? 'bg-green-100 text-green-800' :
                        job.Type === 'Part-Time' ? 'bg-blue-100 text-blue-800' :
                        job.Type === 'Contract' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                        {job.Type || 'N/A'}
                    </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="text-gray-500">Salary Range</div>
                        <div className="font-semibold text-gray-800">
                            {job.MinSalary || job.MaxSalary ? 
                                `${parseFloat(job.MinSalary?.toString() || '0').toFixed(2)}K - ${parseFloat(job.MaxSalary?.toString() || '0').toFixed(2)}K` : 
                                'N/A'}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="text-gray-500">Experience Required</div>
                        <div className="font-semibold text-gray-800">
                            {typeof job.AvgExperience === 'number' || typeof job.AvgExperience === 'string' 
                                ? `${parseFloat(job.AvgExperience.toString()).toFixed(1)} years` 
                                : 'N/A'}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="text-gray-500">Qualification</div>
                        <div className="font-semibold text-gray-800">
                            {job.Qualification || 'N/A'}
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-gray-500 mb-2">Benefits</h3>
                    <div className="flex flex-wrap gap-2">
                        {formatBenefits(job.Benefits || '').split(', ').map((benefit, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                {benefit}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Recommended Jobs Based on SOC Code
                        </h1>
                        {!loading && !error && allJobs.length > 0 && (
                            <div className="bg-blue-50 px-6 py-2 rounded-full">
                                <span className="text-blue-800">
                                    <span className="font-medium">Total Jobs:</span> {allJobs.length} | 
                                    <span className="font-medium ml-2">Showing:</span> {jobs.length}
                                </span>
                            </div>
                        )}
                    </div>
                    <p className="text-gray-600 text-lg">
                        Here are some job opportunities that match your profile.
                    </p>
                </div>

                {renderControls()}

                {/* Content Section */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600 text-lg">Loading jobs...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-xl text-red-500">{error}</p>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-600">No jobs found matching your criteria.</p>
                    </div>
                ) : (
                    <>
                        <div className={`grid ${isGridView ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
                            {jobs.map(renderJobCard)}
                        </div>
                        {renderPagination()}
                    </>
                )}

                {/* Back Button */}
                <div className="mt-12 flex justify-center">
                    <button
                        onClick={handleBackToSearch}
                        className="group px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Search
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobTag;