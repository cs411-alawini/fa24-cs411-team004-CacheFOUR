import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getIndustries, getCompaniesByIndustry, updateUserInfo } from '../services/services';
import Sidebar from '../components/Sidebar';
import UserButton from '../components/UserButton';

const CompanySelectionPage: React.FC = () => {
  const [industries, setIndustries] = useState<string[]>([]);
  const [industry, setIndustry] = useState('');
  const [companies, setCompanies] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const showSidebar = location.state?.showSidebar ?? false;
  const showUserButton = location.state?.showUserButton ?? false;
  const showConfirm = location.state?.showConfirm ?? false;
  const showUpdateCom = location.state?.showUpdateCom ?? false;

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const industryList = await getIndustries();
        setIndustries(industryList);
      } catch (error) {
        setError('Failed to fetch industries. Please try again.');
      }
    };
    fetchIndustries();
  }, []);

  const handleIndustryChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndustry = event.target.value;
    setIndustry(selectedIndustry);
    try {
      const companyList = await getCompaniesByIndustry(encodeURIComponent(selectedIndustry));
      setCompanies(companyList.map((company) => company.name));
    } catch (error) {
      setError('Failed to fetch companies. Please try again.');
    }
    setSelectedCompany('');
  };

  const handleDetailClick = () => {
    if (selectedCompany) {
      navigate(`/company/${encodeURIComponent(selectedCompany)}`, {
        state: {
          showSidebar: showSidebar,
          showUserButton: showUserButton,
          showConfirm: showConfirm,
          showUpdateCom: showUpdateCom,
        },
      });
    }
  };

  const handleSelect = () => {
    navigate('/register', { state: { selectedCompany } });
  };

  const handleUpdateClick = async () => {
    if (selectedCompany) {
        try {
            const userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
            const name = sessionStorage.getItem('name') || 'N/A';
            const experience = parseInt(sessionStorage.getItem('experience') || '0', 10);
            const education = sessionStorage.getItem('education') || 'N/A';

            await updateUserInfo({
                userId,
                name,
                experience,
                education,
                idealcom: selectedCompany,
            });

            sessionStorage.setItem('idealCompany', selectedCompany);

            alert('Ideal company updated successfully!');
            navigate('/userprofile');
        } catch (error) {
            console.error('Failed to update user info:', error);
            alert('Failed to update user info. Please try again.');
        }
    } else {
        alert('Please select a company to update.');
    }
  };



  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64">
        {showSidebar && <Sidebar />}
      </div>
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Select Your Ideal Company</h1>
            {showUserButton && <UserButton />}
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="industry" className="block text-sm font-semibold text-gray-700 mb-2">
                Select Industry
              </label>
              <select
                id="industry"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={industry}
                onChange={handleIndustryChange}
              >
                <option value="">-- Choose Industry --</option>
                {industries.filter((ind) => ind && ind.trim() !== '')
                  .sort()
                  .map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
              </select>
            </div>

            {industry && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Companies in {industry}
                </h2>
                <div className="max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white">
                  {companies.map((company) => (
                    <button
                      key={company}
                      onClick={() => setSelectedCompany(company)}
                      className={`block w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                        selectedCompany === company 
                          ? 'bg-blue-50 text-blue-700 font-medium' 
                          : 'text-gray-700'
                      }`}
                    >
                      {company}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 pt-4">
              <button
                onClick={handleDetailClick}
                disabled={!selectedCompany}
                className="w-full p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                View Details
              </button>

              {showConfirm && (
                <button
                  onClick={handleSelect}
                  disabled={!selectedCompany}
                  className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Selection
                </button>
              )}

              {showUpdateCom && (
                <button
                  onClick={handleUpdateClick}
                  disabled={!selectedCompany}
                  className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Selection
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySelectionPage;
