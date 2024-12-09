import { Router, Request, Response } from "express";
import { getAllIndustries,getCompaniesByIndustry,getCompanyByName} from "../services/database";
import { Company } from "../models/Company";

const router = Router();

router.get('/industries', async (req:Request, res:Response) => {
    try {
        const industries = await getAllIndustries();
        res.json(industries);
    } catch (error) {
        console.error('Error retrieving industries:', error);
        res.status(500).json({ message: 'Failed to retrieve industries' });
    }
});

router.get('/:industry', async (req:Request, res:Response) => {
    const { industry } = req.params;

    try {
        // Validate input
        if (!industry) {
            res.status(400).json({ message: 'Industry is required' });
        }

        const companies = await getCompaniesByIndustry(industry);
        res.json(companies);
    } catch (error) {
        console.error('Error retrieving companies by industry:', error);
        res.status(500).json({ message: 'Failed to retrieve companies' });
    }
});


router.get('/company/:name', async (req:Request, res:Response) => {
    const { name } = req.params;

    try {
        // Validate input
        if (!name) {
            res.status(400).json({ message: 'Company name is required' });
        }
        const company = await getCompanyByName(name);
        if (!company) {
            res.status(404).json({ message: `Company with name "${name}" not found` });
        }

        res.json(company);
    } catch (error) {
        console.error('Error retrieving company by name:', error);
        res.status(500).json({ message: 'Failed to retrieve company information' });
    }
});


export default router;