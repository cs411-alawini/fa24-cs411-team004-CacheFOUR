import { Router, Request, Response } from 'express';
import { 
  initializeTagNameToJobProcedure, 
  callTagNameToJobProcedure, 
  getSOCDetails, 
  getCompanyJobs, 
  getCourseList, 
  transactionEnrollAndFetchJobs, 
} from '../services/database'; // Import your backend functions here

const router = Router();

// Route to call the stored procedure 'TagNameToJob' and get job information
router.get('/tagname-to-job', async (req: Request, res: Response) => {
  const { userId, tagName } = req.query;
  try {
    if (!userId || !tagName) {
      res.status(400).json({ message: 'userId and tagName are required parameters' });
    }
    
    await initializeTagNameToJobProcedure();
    
    const jobs = await callTagNameToJobProcedure(parseInt(userId as string, 10), tagName as string);
    console.log('Found jobs:', jobs);
    
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error in tagname-to-job route:', error);
    res.status(500).json({ 
      message: 'Failed to fetch job information', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Route to get SOC details based on level
router.get('/soc-details', async (req: Request, res: Response) => {
  const { level, InputSoc } = req.query;
  try {
    // Validate input
    if (!level) {
      res.status(400).json({ message: 'level is a required parameter' });
    }
    const socDetails = await getSOCDetails(parseInt(level as string), InputSoc as string);
    res.status(200).json(socDetails);
  } catch (error) {
    console.error('Error fetching SOC details:', error);
    res.status(500).json({ message: 'Failed to fetch SOC details' });
  }
});

// Route to get company jobs based on user ID
router.get('/company-jobs', async (req: Request, res: Response) => {
  const { userId } = req.query;
  try {
    // Validate input
    if (!userId) {
    res.status(400).json({ message: 'userId is a required parameter' });
    }
    const jobs = await getCompanyJobs(parseInt(userId as string));
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching company jobs:', error);
    res.status(500).json({ message: 'Failed to fetch company jobs' });
  }
});

// Route to get the list of courses
router.get('/courses', async (req: Request, res: Response) => {
  try {
    const courses = await getCourseList();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching course list:', error);
    res.status(500).json({ message: 'Failed to fetch course list' });
  }
});

// Route to enroll in courses and fetch matching jobs
router.post('/enroll-and-fetch-jobs', async (req: Request, res: Response) => {
  const { userId, crns } = req.body;
  try {
    // Validate input
    if (!userId || !crns || !Array.isArray(crns)) {
    res.status(400).json({ message: 'userId and crns (array) are required parameters' });
    }
    const jobs = await transactionEnrollAndFetchJobs(parseInt(userId as string), crns);
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error enrolling and fetching jobs:', error);
    res.status(500).json({ message: 'Failed to enroll and fetch jobs' });
  }
});

router.get('/test', (req: Request, res: Response) => {
    res.json({ message: 'FindJob routes are working!' });
});

export default router;

