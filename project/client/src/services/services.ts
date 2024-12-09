import axios from 'axios';

// UserAccount interface
export interface UserAccount {
  userId: number;
  name: string;
  experience: number;
  idealcom: string;
  education?: string;
  tagCode?: string;
}

// Company interface
export interface Company {
  name: string;
  size?: number;
  ceo?: string;
  industry?: string;
  website?: string;
}

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3007/api";

export const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


export const getUserInfo = (userId: number, name: string): Promise<UserAccount | undefined> => {
  return httpClient
    .get(`/login`, {
      params: { userId, name },
    })
    .then((response) => response.data)
    .catch((error) => {
      if (error.response?.status === 404) {
        console.error("User not found");
      }
      throw error;
    });
};


export const signUpUser = (newUser: Omit<UserAccount, 'userId'>): Promise<{ message: string; userId: number }> => {
  return httpClient
    .post(`/login/signup`, newUser)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response?.status === 409) {
        console.error("Duplicate user found");
      }
      throw error;
    });
};


export const updateUserInfo = (updatedUser: UserAccount): Promise<void> => {
  return httpClient
    .put(`/login/update`, updatedUser)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response?.status === 400) {
        console.error("Missing required user fields");
      }
      throw error;
    });
};


export const deleteUser = (userId: number): Promise<void> => {
  return httpClient
    .delete(`/login/delete/${userId}`)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response?.status === 404) {
        console.error("User not found");
      }
      throw error;
    });
};


export const getIndustries = (): Promise<string[]> => {
  return httpClient
    .get(`/comsel/industries`)
    .then((response) => response.data);
};


export const getCompaniesByIndustry = (industry: string): Promise<Company[]> => {
  return httpClient
    .get(`/comsel/${industry}`)
    .then((response) => response.data);
};


export const getCompanyInfoByName = (companyName: string): Promise<Company> => {
  return httpClient
    .get(`/comsel/company/${companyName}`)
    .then((response) => response.data);
};

export interface SOC {
    SOC_code: string;
    Name?: string;
    RelatedEx?: number;
    Knowledge?: string;
    Ability?: string;
}

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
}

export const getJobInfoByTagName = async (userId: number, tagName: string): Promise<any[]> => {
    console.log('Calling API with userId:', userId, 'and tagName:', tagName);
    
    return httpClient
        .get(`/findjob/tagname-to-job`, {
            params: { userId, tagName }
        })
        .then((response) => {
            console.log('API response:', response.data);
            if (!response.data || !Array.isArray(response.data)) {
                console.log('No jobs found or invalid response format');
                return [];
            }
            return response.data;
        })
        .catch((error) => {
            console.error('Error details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                config: error.config
            });
            throw error;
        });
};

export const getSOCDetailsByLevel = (level: number, InputSoc: string): Promise<SOC[]> => {
  return httpClient
    .get(`findjob/soc-details`, {
      params: { level, InputSoc },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching SOC details:', error);
      throw error;
    });
};

export const getCompanyJobsByUserId = (userId: number): Promise<Job[]> => {
  return httpClient
    .get(`findjob/company-jobs`, {
      params: { userId },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching company jobs:', error);
      throw error;
    });
};

export const getCourseList = (): Promise<string[]> => {
  return httpClient
    .get(`findjob/courses`)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching course list:', error);
      throw error;
    });
};

export const enrollAndFetchJobs = (userId: number, crns: string[]): Promise<Job[]> => {
  return httpClient
    .post(`findjob/enroll-and-fetch-jobs`, { userId, crns })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error enrolling and fetching jobs:', error);
      throw error;
    });
};

export const createExperienceTrigger = (): Promise<void> => {
  return httpClient
    .post(`login/create-experience-trigger`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error creating experience trigger:", error);
      throw error;
    });
};