import { RowDataPacket } from "mysql2";
import { testCompanies, testAlterTables, testJobs, testPositions, testSOC, testUserAccounts } from '../../data/AllData';
import { testPool } from './testConnection';

export async function loadTestData() {
    try {
        console.log('Starting to load test data...');
        
        // 清空现有测试数据（注意顺序）
        await testPool.query('DELETE FROM UserAccount');
        await testPool.query('DELETE FROM Job');
        await testPool.query('DELETE FROM Positions');
        await testPool.query('DELETE FROM AlterTable');
        await testPool.query('DELETE FROM SOC');
        await testPool.query('DELETE FROM Company');
        console.log('Existing data cleaned up');

        // 插入公司数据
        for (const company of testCompanies) {
            await testPool.query(
                'INSERT INTO Company (name, size, ceo, industry, website) VALUES (?, ?, ?, ?, ?)',
                [company.name, company.size, company.ceo, company.industry, company.website]
            );
        }
        console.log('Company data loaded');

        // 获取已插入的公司名称集合
        const [companyRows] = await testPool.query<RowDataPacket[]>('SELECT name FROM Company');
        const validCompanyNames = new Set(companyRows.map(row => row.name));
        console.log('Valid company names:', validCompanyNames);

        // 插入用户数据，处理无效的公司引用
        for (const user of testUserAccounts) {
            // 如果 idealcom 为空字符串或引用的公司不存在，则设置为 null
            const idealcom = user.idealcom && validCompanyNames.has(user.idealcom) 
                ? user.idealcom 
                : null;

            await testPool.query(
                'INSERT INTO UserAccount (userId, name, experience, idealcom, education, tagCode) VALUES (?, ?, ?, ?, ?, ?)',
                [user.userId, user.name, user.experience, idealcom, user.education, user.tagCode]
            );
            
            if (user.idealcom && !validCompanyNames.has(user.idealcom)) {
                console.log(`Warning: Company "${user.idealcom}" not found for user ${user.name}, setting idealcom to null`);
            }
        }
        console.log('User data loaded successfully');

        // 插入SOC数据
        for (const soc of testSOC) {
            await testPool.query(
                'INSERT INTO SOC (socCode, name, relatedEx, knowledge, ability, worktask) VALUES (?, ?, ?, ?, ?, ?)',
                [soc.socCode, soc.name, soc.relatedEx, soc.knowledge, soc.ability, soc.worktask]
            );
        }
        console.log('SOC data loaded successfully');

        // 插入AlterTable数据
        for (const alterTable of testAlterTables) {
            await testPool.query(
                'INSERT INTO AlterTable (soCode, alterTitle) VALUES (?, ?)',
                [alterTable.soCode, alterTable.alterTitle]
            );
        }
        console.log('AlterTable data loaded successfully');

        // 插入职位数据
        for (const position of testPositions) {
            await testPool.query(
                'INSERT INTO Positions (role, responsibilities, description) VALUES (?, ?, ?)',
                [position.role, position.responsibilities, position.description]
            );
        }
        console.log('Positions data loaded successfully');

        // 插入工作数据
        for (const job of testJobs) {
            // 如果引用的公司不存在，则忽略此工作
            if (job.companyName && validCompanyNames.has(job.companyName)) {
                await testPool.query(
                    'INSERT INTO Job (jobId, role, avgExperience, qualification, minSalary, maxSalary, type, preference, benefits, companyName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [job.jobId, job.role, job.avgExperience, job.qualification, job.minSalary, job.maxSalary, job.type, job.preference, job.benefits, job.companyName]
                );
            } else {
                console.log(`Warning: Company "${job.companyName}" not found for job role ${job.role}, skipping job entry`);
            }
        }
        console.log('Job data loaded successfully');

        // 验证数据加载
        const [userRows] = await testPool.query<RowDataPacket[]>('SELECT * FROM UserAccount');
        console.log('Loaded users:', userRows);

    } catch (error) {
        console.error('Failed to load test data:', error);
        throw error;
    }
}

// 导出测试数据以供其他测试使用
export { testCompanies, testAlterTables, testJobs, testPositions, testSOC, testUserAccounts };
