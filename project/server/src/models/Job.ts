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