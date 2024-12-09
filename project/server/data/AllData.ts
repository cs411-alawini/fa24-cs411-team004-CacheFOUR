export const testCompanies = [
  {
    name: "Lendlease Group",
    size: 78805,
    ceo: "Tony Lombardo",
    industry: "Real Estate",
    website: "https://www.lendlease.com/"
  },
  {
    name: "Segro",
    size: 45550,
    ceo: "David Sleath",
    industry: "Real Estate/REIT",
    website: "www.segro.com"
  },
  {
    name: "Henry Schein",
    size: 62009,
    ceo: "Stanley M. Bergman",
    industry: "Wholesalers: Health Care",
    website: "www.henryschein.com"
  },
  {
    name: "Fuchs Petrolub SE",
    size: 70767,
    ceo: "Stefan Fuchs",
    industry: "Chemicals",
    website: "https://www.fuchs.com/group/"
  },
  {
    name: "Tata Consumer Products",
    size: 72107,
    ceo: "Sunil D'Souza",
    industry: "Consumer Goods",
    website: "https://www.tataconsumer.com/"
  },
  {
    name: "Pioneer Natural Resources",
    size: 83968,
    ceo: "Scott D. Sheffield",
    industry: "Mining, Crude-Oil Production",
    website: "www.pxd.com"
  },
  {
    name: "Nvidia",
    size: 66429,
    ceo: "Jen-Hsun Huang",
    industry: "Semiconductors and Other Electronic Components",
    website: "www.nvidia.com"
  },
  {
    name: "Best Buy",
    size: 71042,
    ceo: "Corie S. Barry",
    industry: "Specialty Retailers: Other",
    website: "www.investors.bestbuy.com"
  },
  {
    name: "Bosch Limited",
    size: 52305,
    ceo: "Soumitra Bhattacharya",
    industry: "Industrial Conglomerate",
    website: "www.bosch.in"
  },
  {
    name: "Automatic Data Processing",
    size: 74156,
    ceo: "Maria Black",
    industry: "Diversified Outsourcing Services",
    website: "www.adp.com"
  }
];

export const testAlterTables = [
  { SOCode: "15-1132", alterTitle: "Software Developer" },
  { SOCode: "11-1021", alterTitle: "General Manager" },
  { SOCode: "17-2141", alterTitle: "Mechanical Engineer" },
  { SOCode: "13-2011", alterTitle: "Accountant" },
  { SOCode: "29-1141", alterTitle: "Registered Nurse" },
  { SOCode: "41-2031", alterTitle: "Retail Salesperson" },
  { SOCode: "13-1199", alterTitle: "Business Analyst" },
  { SOCode: "15-1121", alterTitle: "Systems Analyst" },
  { SOCode: "17-2071", alterTitle: "Electrical Engineer" },
  { SOCode: "11-9199", alterTitle: "Operations Manager" }
];

export const testJobs = [
  { jobId: "J001", role: "Software Developer", avgExperience: 3, qualification: "Bachelor's Degree in Computer Science", minSalary: 70000, maxSalary: 120000, type: "Full-time", preference: "Experience with JavaScript", benefits: "Health Insurance, 401K", companyName: "Nvidia" },
  { jobId: "J002", role: "General Manager", avgExperience: 10, qualification: "MBA", minSalary: 90000, maxSalary: 150000, type: "Full-time", preference: "Leadership skills", benefits: "Health Insurance, Company Car", companyName: "Bosch Limited" },
  { jobId: "J003", role: "Mechanical Engineer", avgExperience: 5, qualification: "Bachelor's Degree in Mechanical Engineering", minSalary: 60000, maxSalary: 100000, type: "Full-time", preference: "Experience with CAD", benefits: "Health Insurance", companyName: "Fuchs Petrolub SE" },
  { jobId: "J004", role: "Accountant", avgExperience: 3, qualification: "Bachelor's Degree in Accounting", minSalary: 50000, maxSalary: 90000, type: "Full-time", preference: "CPA Certification", benefits: "Health Insurance, 401K", companyName: "Henry Schein" },
  { jobId: "J005", role: "Registered Nurse", avgExperience: 2, qualification: "Nursing Degree", minSalary: 55000, maxSalary: 85000, type: "Full-time", preference: "Registered Nurse License", benefits: "Health Insurance, Paid Time Off", companyName: "Best Buy" }
];

export const testPositions = [
  { role: "Software Developer", responsibilities: "Write and maintain code", description: "Develop and maintain software solutions" },
  { role: "General Manager", responsibilities: "Manage company operations", description: "Oversee daily operations and ensure business objectives are met" },
  { role: "Mechanical Engineer", responsibilities: "Design mechanical systems", description: "Work on mechanical designs and product development" },
  { role: "Accountant", responsibilities: "Manage financial records", description: "Prepare and examine financial records" },
  { role: "Registered Nurse", responsibilities: "Provide patient care", description: "Administer care to patients in a healthcare setting" }
];

export const testSOC = [
  { SOCode: "15-1132", name: "Software Developer", relatedEx: 3, knowledge: "Programming, Algorithms", ability: "Problem Solving", worktask: "Develop software applications" },
  { SOCode: "11-1021", name: "General Manager", relatedEx: 10, knowledge: "Business Management", ability: "Leadership", worktask: "Manage company operations" },
  { SOCode: "17-2141", name: "Mechanical Engineer", relatedEx: 5, knowledge: "Mechanical Design", ability: "Analytical Thinking", worktask: "Design mechanical systems" },
  { SOCode: "13-2011", name: "Accountant", relatedEx: 3, knowledge: "Accounting Principles", ability: "Attention to Detail", worktask: "Manage financial records" },
  { SOCode: "29-1141", name: "Registered Nurse", relatedEx: 2, knowledge: "Healthcare", ability: "Empathy", worktask: "Provide patient care" }
];

export const testUserAccounts = [
  { userId: 1, name: "Alice Johnson", experience: 4, idealcom: "Nvidia", education: "Bachelor's Degree in Computer Science", tagCode: "15-1132" },
  { userId: 2, name: "Bob Smith", experience: 8, idealcom: "Bosch Limited", education: "MBA", tagCode: "11-1021" },
  { userId: 3, name: "Charlie Brown", experience: 5, idealcom: "Fuchs Petrolub SE", education: "Bachelor's Degree in Mechanical Engineering", tagCode: "17-2141" },
  { userId: 4, name: "Diana Prince", experience: 3, idealcom: "Henry Schein", education: "Bachelor's Degree in Accounting", tagCode: "13-2011" },
  { userId: 5, name: "Evan Lee", experience: 2, idealcom: "Best Buy", education: "Nursing Degree", tagCode: "29-1141" }
];


export const testEnrollments = [
  { UserId: 1, CRN: 'CRN001' },
  { UserId: 2, CRN: 'CRN002' },
  { UserId: 3, CRN: 'CRN003' },
  { UserId: 4, CRN: 'CRN004' },
  { UserId: 5, CRN: 'CRN005' }
];

export const testCourses = [
  { CRN: 'CRN001', CourseName: 'Introduction to Programming', CreditHour: 3, Description: 'Learn the basics of programming using Python.' },
  { CRN: 'CRN002', CourseName: 'Data Structures', CreditHour: 4, Description: 'Study common data structures and their applications.' },
  { CRN: 'CRN003', CourseName: 'Database Systems', CreditHour: 3, Description: 'Introduction to relational databases and SQL.' },
  { CRN: 'CRN004', CourseName: 'Operating Systems', CreditHour: 4, Description: 'Learn about operating system concepts including processes, memory, and file systems.' },
  { CRN: 'CRN005', CourseName: 'Computer Networks', CreditHour: 3, Description: 'Introduction to computer networking concepts and protocols.' }
];