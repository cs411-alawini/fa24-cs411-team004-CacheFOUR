import { RowDataPacket } from "mysql2";
import pool from './connection';
import { UserAccount } from '../models/UserAccount';
import { Company } from '../models/Company';
import { AlterTable } from '../models/AlterTable'
import { Job } from '../models/Job'
import { Positions } from "../models/Positions";
import { SOC } from "../models/SOC"

export async function validateAndGetUser(userId: number, name: string): Promise<UserAccount | null> {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT userId, name, experience, idealcom, education FROM UserAccount WHERE userId = ? AND name = ?',
            [userId, name]);
        return rows.length > 0 ? {
            userId: rows[0].userId,
            name: rows[0].name,
            experience: rows[0].experience,
            idealcom: rows[0].idealcom,
            education: rows[0].education
        } as UserAccount : null;
    } catch (error: unknown) {
        console.error('Error validating user:', error);
        throw error;
    }
}

export async function createUser(user: Omit<UserAccount, "userId">): Promise<number> {
    if (!user.name || user.experience === undefined || !user.idealcom) {
        throw new Error("Missing required user fields");
    }

    try {
        // Check if the user already exists in the database
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM UserAccount WHERE name = ? AND experience = ? AND idealcom = ? AND education = ?',
            [user.name, user.experience, user.idealcom, user.education]);
        if (rows.length > 0)
            throw new Error("Duplicate entry");

        const userId = await getMaxUserId();
        await pool.execute(
            'INSERT INTO UserAccount (userId, name, experience, idealcom, education) VALUES (?, ?, ?, ?, ?)',
            [userId, user.name, user.experience, user.idealcom, user.education]
        );
        return userId;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}


export async function updateUser(user: UserAccount): Promise<void> {
    if (!user.userId || !user.name || user.experience == undefined || !user.idealcom) {
        throw new Error("Missing required user fields");
    }
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT * FROM UserAccount WHERE userId = ?",
            [user.userId]);
        if (rows.length === 0)
            throw new Error("User not found");

        await pool.execute(
            "UPDATE UserAccount SET name = ?, experience = ?, idealcom = ?, education = ? WHERE userId = ?",
            [user.name, user.experience, user.idealcom, user.education, user.userId]
        );
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}

export async function createUpdateExperienceTrigger() {
    const createTriggerSQL = `
        CREATE TRIGGER update_experience_trigger
        BEFORE UPDATE ON UserAccount
        FOR EACH ROW
        BEGIN
            IF NEW.experience < OLD.experience THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Work experience cannot be decreased';
            END IF;
        END;
    `;
    try {
        await pool.query('DROP TRIGGER IF EXISTS update_experience_trigger');
        console.log("Dropped existing trigger 'update_experience_trigger'.");

        await pool.query(createTriggerSQL);
        console.log("Trigger 'update_experience_trigger' created successfully.");
    } catch (error) {
        console.error("Error creating trigger 'update_experience_trigger':", error);
        throw error;
    }
}


export async function deleteUser(userId: number): Promise<void> {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT * FROM UserAccount WHERE userId = ?",
            [userId]
        );
        if (rows.length === 0)
            throw new Error("User not found");
        await pool.execute("DELETE FROM UserAccount WHERE userId = ?", [userId]);
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}


export async function getMaxUserId(): Promise<number> {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>('SELECT MAX(userId) as maxId FROM UserAccount');
        return (rows[0].maxId + 1 as number) || 0;
    } catch (error) {
        console.error('Error getting max userId:', error);
        throw error;
    }
}

export async function getAllIndustries(): Promise<string[]> {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>('SELECT DISTINCT industry FROM Company WHERE industry IS NOT NULL');
        return rows.map(row => row.industry as string);
    } catch (error) {
        console.error('Error getting industries:', error);
        throw error;
    }
}

export async function getCompaniesByIndustry(industry: string): Promise<Company[]> {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT name FROM Company WHERE industry = ?',
            [industry]
        );
        return rows as Company[];
    } catch (error) {
        console.error('Error getting companies by industry:', error);
        throw error;
    }
}

export async function getCompanyByName(name: string): Promise<Company | null> {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT size, ceo, industry, website FROM Company WHERE name = ?',
            [name]
        );
        return rows.length > 0 ? rows[0] as Company : null;
    } catch (error) {
        console.error('Error getting company by name:', error);
        throw error;
    }
}

export async function getAllCompanies(limit?: number, offset?: number): Promise<Company[]> {
    try {
        let query = 'SELECT * FROM Company';
        let params: any[] = [];

        if (limit) {
            query += ' LIMIT ?';
            params.push(limit);

            if (offset) {
                query += ' OFFSET ?';
                params.push(offset);
            }
        }

        const [rows] = await pool.query(query, params);
        return rows as Company[];
    } catch (error) {
        console.error('Error getting all companies:', error);
        throw error;
    }
}



export async function initializeTagNameToJobProcedure() {
    const createProcedureSQL = `
CREATE PROCEDURE TagNameToJob(
    IN InputUserId INT,
    IN InputTagCode VARCHAR(255)
)
BEGIN
    UPDATE UserAccount
    SET TagCode = InputTagCode
    WHERE UserId = InputUserId;

    SELECT 
        J.JobId,
        J.Role,
        AVG(J.AvgExperience) as AvgExperience,
        GROUP_CONCAT(DISTINCT J.Qualification SEPARATOR ', ') as Qualification,
        J.Type,
        ROUND(AVG(J.MinSalary), 2) as MinSalary,
        ROUND(AVG(J.MaxSalary), 2) as MaxSalary,
        GROUP_CONCAT(DISTINCT J.CompanyName SEPARATOR ', ') as CompanyName,
        J.Preference,
        J.Benefits
    FROM Job J
    JOIN Positions P ON J.Role = P.Role
    JOIN AlterTable A ON J.Role = A.AlterTitle
    JOIN UserAccount U ON A.SOCode = U.TagCode
    WHERE U.UserId = InputUserId
    GROUP BY J.JobId, J.Role, J.Type, J.Preference, J.Benefits;
END;
    `;
  
    try {
        await pool.query('DROP PROCEDURE IF EXISTS TagNameToJob');
        await pool.query(createProcedureSQL);
        console.log("Stored procedure 'TagNameToJob' created successfully.");
    } catch (error) {
        console.error("Error creating stored procedure 'TagNameToJob':", error);
        throw error;
    }
}

export async function callTagNameToJobProcedure(inputUserId: number, inputTagName: string): Promise<any[]> {
    try {
        const [results] = await pool.query('CALL TagNameToJob(?, ?)', [inputUserId, inputTagName]);
        
        // MySQL2 returns results as QueryResult type, we need to access the first element
        const jobs = Array.isArray(results) && results[0] ? results[0] : [];
        
        if (!Array.isArray(jobs)) {
            return [];
        }

        return jobs.map(job => ({
            jobId: job.JobId,
            Role: job.Role,
            AvgExperience: job.AvgExperience,
            Qualification: job.Qualification,
            Type: job.Type,
            MinSalary: job.MinSalary,
            MaxSalary: job.MaxSalary,
            CompanyName: job.CompanyName,
            Preference: job.Preference,
            Benefits: job.Benefits
        }));
    } catch (error) {
        console.error('Error in callTagNameToJobProcedure:', error);
        throw error;
    }
}

export async function getSOCDetails(level: number, inputSOC: string): Promise<any[]> {
    try {
        let socCodeCondition = '';
        switch (level) {
            case 1:
                socCodeCondition = "SOC_code LIKE '%0000'";
                break;
            case 2:
                socCodeCondition = "SOC_code LIKE '%00' AND SOC_code NOT LIKE '%0000'";
                break;
            case 3:
                socCodeCondition = "SOC_code LIKE '%0' AND SOC_code NOT LIKE '%00'";
                break;
            case 4:
                socCodeCondition = "SOC_code NOT LIKE '%0'";
                break;
            default:
                throw new Error('Invalid SOC level provided.');
        }

        // Extract the appropriate prefix from the inputSOC based on the level
        let socPrefix = '';
        if (level===1){
            socPrefix='';
        }
        else if (level === 2) {
            socPrefix = inputSOC.split('-')[0];
        } else if (level === 3) {
            socPrefix = inputSOC.substring(0, 4); // e.g., "15-10" from "15-1000"
        } else if (level === 4) {
            socPrefix = inputSOC.substring(0, 6); // e.g., "15-110" from "15-1100"
        } else {
            socPrefix = inputSOC;
        }

        const [rows] = await pool.query<RowDataPacket[]>(
            `
            SELECT SOC_code, Name, RelatedEx, Knowledge, Ability
            FROM SOC
            WHERE ${socCodeCondition} AND SOC_code LIKE '${socPrefix}%' 
            ORDER BY SOC_code;
            `
        );
        return rows;
    } catch (error) {
        console.error('Error in getSOCDetails:', error);
        throw error;
    }
}


export async function getCompanyJobs(inputUserId: number): Promise<any[]> {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `
        SELECT 
        J.JobId AS jobId, 
        J.Role AS role, AVG(J.AvgExperience) AS avgExperience, 
        GROUP_CONCAT(DISTINCT J.Qualification SEPARATOR ', ') AS qualification, 
        J.Type AS type,
        ROUND(AVG(J.MinSalary), 2) AS minSalary,
        ROUND(AVG(J.MaxSalary), 2) AS maxSalary,
        J.CompanyName AS companyName,
        J.Preference AS preference,
        J.Benefits AS benefits
        FROM Job J
            JOIN UserAccount U ON U.Idealcom = J.CompanyName
            JOIN Positions P ON P.Role = J.Role
        WHERE U.UserId = 3002
        GROUP BY 
            J.JobId, 
            J.Role, 
            J.Type, 
            J.CompanyName, 
            J.Preference, 
            J.Benefits;
        `,
            [inputUserId]
        );
        return rows;
    } catch (error) {
        console.error('Error in getCompanyJobs:', error);
        throw error;
    }
}

export async function getCourseList(): Promise<any[]> {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `
        SELECT CRN, CourseName
        FROM CourseInfo;
        `
        );
        return rows;
    } catch (error) {
        console.error('Error in getCourseList:', error);
        throw error;
    }
}

export async function transactionEnrollAndFetchJobs(inputUserId: number, crns: string[]): Promise<Job[]> {
    try {
        await pool.query('BEGIN');

        await pool.query(
            `DELETE FROM Enrollment WHERE UserId = ?;`,
            [inputUserId]
        );

        for (const crn of crns) {
            await pool.query(
                `INSERT INTO Enrollment (UserId, CRN) VALUES (?, ?);`,
                [inputUserId, crn]
            );
        }

        const [rows] = await pool.query<RowDataPacket[]>(
            `
            SELECT 
                J.JobId AS jobId,
                J.Role AS role,
                AVG(J.AvgExperience) AS avgExperience,
                GROUP_CONCAT(DISTINCT J.Qualification) AS qualification,
                J.Type AS type,
                ROUND(AVG(J.MinSalary), 2) AS minSalary,
                ROUND(AVG(J.MaxSalary), 2) AS maxSalary,
                GROUP_CONCAT(DISTINCT J.CompanyName) AS companyName,
                J.Preference AS preference,
                J.Benefits AS benefits
            FROM AlterTable A
            JOIN (
                SELECT DISTINCT SOCode
                FROM SkillMatching
                JOIN Enrollment E USING (CRN)
                WHERE E.UserId = ?
                GROUP BY SOCode
                HAVING COUNT(CASE WHEN Skill1 IS NOT NULL AND Skill1 <> '' THEN 1 END) +
                       COUNT(CASE WHEN Skill2 IS NOT NULL AND Skill2 <> '' THEN 1 END) >= 2
            ) AS SkillCounts ON A.SOCode = SkillCounts.SOCode
            JOIN Job J ON J.Role = A.AlterTitle
            GROUP BY J.JobId, J.Role, J.Type, J.Preference, J.Benefits
            ORDER BY maxSalary DESC;
            `,
            [inputUserId]
        );

        await pool.query('COMMIT');

        return rows.map(row => ({
            jobId: row.jobId,
            role: row.role,
            avgExperience: row.avgExperience,
            qualification: row.qualification,
            minSalary: row.minSalary,
            maxSalary: row.maxSalary,
            type: row.type,
            preference: row.preference,
            benefits: row.benefits,
            companyName: row.companyName
        }));
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error in transactionEnrollAndFetchJobs:', error);
        throw error;
    }
}
