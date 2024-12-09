import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegistrationPage from './pages/Registration';
import CompanySelectionPage from './pages/CompanySelection';
import CompanyDetailPage from './pages/CompanyDetail';
import UserProfilePage from './pages/UserProfile';
import CoursesPage from './pages/Courses';
import JobCourPage from './pages/JobCour';
import JobComPage from './pages/JobCom';
import JobExplorationPage from './pages/TagSelection';
import JobTag from './pages/JobTag';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} /> {/* Default route set to login */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/company-selection" element={<CompanySelectionPage />} />
                <Route path="/company/:companyName" element={<CompanyDetailPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/userprofile" element={<UserProfilePage />} />
                <Route path="/job-exploration" element={<JobExplorationPage />} />
                {/* <Route path="/tag-selection" element={<JobExplorationPage />} /> */}
                <Route path="/find-jobs-tag" element={<JobTag />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/find-jobs-com" element={<JobComPage />} />
                <Route path="/find-jobs-cour" element={<JobCourPage />} />
            </Routes>
        </Router>
    );
};

export default App;
