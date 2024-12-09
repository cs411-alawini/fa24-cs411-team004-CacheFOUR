import {
    initializeTagNameToJobProcedure,
    callTagNameToJobProcedure,
    getSOCDetails,
    getCompanyJobs,
    getCourseList,
    transactionEnrollAndFetchJobs,
    getAllCompanies,
    getAllIndustries,
    getCompanyByName,
    createUpdateExperienceTrigger,
    updateUser
} from '../services/database';
import pool from '../services/connection';
import { UserAccount } from '../models/UserAccount';

export async function runTests() {
    console.log('开始数据库测试...');

    try {
        // // 测试获取所有公司
        // console.log('测试1: 获取所有公司');
        // const companies = await getAllCompanies(5); // 限制获取5个公司
        // console.log('获取到的公司数量:', companies.length);
        // console.log('公司1:', companies[0]);
        // console.log('公司2:', companies[1]);
        // console.log('公司3:', companies[2]);
        // console.log('测试1完成');

        // // 测试获取所有行业
        // console.log('测试2: 获取所有行业');
        // const industries = await getAllIndustries();
        // console.log('获取到的行业:', industries);
        // console.log('测试2完成');

        // // 测试查询特定公司
        // console.log('测试3: 查询特定公司');
        // const companyName = 'Nvidia'; // 使用测试数据中的公司名称
        // const company = await getCompanyByName(companyName);
        // console.log('查询公司结果:', company);
        // console.log('测试3完成');

        // // 测试初始化并调用存储过程
        console.log('测试4: 初始化和调用存储过程 TagNameToJob');
        await initializeTagNameToJobProcedure();
        const jobInfo = await callTagNameToJobProcedure(1, '23-1011'); // 使用测试数据
        console.log('调用存储过程结果:', jobInfo);
        console.log('测试4完成');

        // 测试获取SOC详情
        // console.log('测试5: 获取SOC详情');
        // const socDetails = await getSOCDetails(4,"15-1210"); // 获取SOC等级3的详情
        // console.log('获取到的SOC详情:', socDetails);
        // console.log('测试5完成');

        // // 测试获取特定用户的公司工作
        // console.log('测试6: 获取特定用户的公司工作');
        // const companyJobs = await getCompanyJobs(2); // 使用测试数据中的用户ID
        // console.log('获取到的公司工作:', companyJobs);
        // console.log('测试6完成');

        // // 测试获取课程列表
        // console.log('测试7: 获取课程列表');
        // const courseList = await getCourseList();
        // console.log('获取到的课程列表:', courseList);
        // console.log('测试7完成');

        // // 测试事务：注册课程并获取工作
        // console.log('测试8: 注册课程并获取工作');
        // const enrolledJobs = await transactionEnrollAndFetchJobs(5, ['ECE374', 'ECE385']); // 使用测试数据中的用户ID和课程代码
        // console.log('事务后获取到的工作:', enrolledJobs);
        // console.log('测试8完成');

        // console.log('测试9: 验证触发器 update_experience_trigger');
        // await createUpdateExperienceTrigger();
        // console.log('Trigger created successfully');
        
        //         // 测试更新用户信息
        //         console.log('测试10: 更新用户信息');
        //         const userToUpdate: UserAccount = {
        //             userId: 1,
        //             name: "Alisha Mitchell",
        //             experience: 10,
        //             idealcom: "Nvidia",
        //             education: "Master's Degree in Computer Science",
        //             tagCode: "15-1132"
        //         };
        //         await updateUser(userToUpdate);
        //         console.log('User updated successfully');
        //         console.log('测试10完成');
        
        //         console.log('所有测试完成！');

        // console.log('所有测试完成！');

    } catch (error) {
        console.error('测试过程中发生错误:', error);
    } finally {
        // 添加关闭连接的代码
        try {
            await pool.end();
            console.log('\n数据库连接已关闭');
            process.exit(0);
        } catch (err) {
            console.error('关闭数据库连接时出错:', err);
            process.exit(1);
        }
    }
}

// 运行测试
runTests();
