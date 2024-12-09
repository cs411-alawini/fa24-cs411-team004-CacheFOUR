import {
    validateAndGetUser,
    createUser,
    updateUser,
    deleteUser,
    getMaxUserId,
    getAllIndustries,
    getCompaniesByIndustry,
    getCompanyByName,
    getAllCompanies
} from '../services/database';
import { initTestEnvironment, cleanupTestData, closeTestConnection } from './testConnection';
import { loadTestData, testUserAccounts, testCompanies } from './testDataLoader';
import { MockDatabase } from './MockDatabase';

async function runTests(isLocal: boolean = false) {
    const db = isLocal ? new MockDatabase() : null;

    try {
        if (!isLocal) {
            await initTestEnvironment();
            await cleanupTestData();
            await initTestEnvironment();
            await loadTestData();
        }

        console.log('\nStarting tests...');

        // 1. 测试用户验证
        console.log('\n1. Testing validateAndGetUser:');
        const testUser = testUserAccounts[0];
        const validUser = isLocal 
            ? await db!.validateAndGetUser(testUser.userId, testUser.name)
            : await validateAndGetUser(testUser.userId, testUser.name);
        console.log('Valid user test:', validUser !== null ? '✅ PASSED' : '❌ FAILED');
        if (validUser) {
            console.log('Retrieved user:', validUser);
        }

        // 2. 测试用户 CRUD 操作
        console.log('\n2. Testing User CRUD operations:');
        const maxId = isLocal ? await db!.getMaxUserId() : await getMaxUserId();

        // 使用实际存在的公司名称
        const newUser = {
            userId: maxId + 1,
            name: "New Test User",
            experience: 2,
            idealcom: testCompanies[0].name,
            education: "PhD"
        };

        console.log('Creating user with data:', newUser);

        // Create
        if (isLocal) {
            await db!.createUser(newUser);
        } else {
            await createUser(newUser);
        }
        console.log('Create user test: ✅ PASSED');

        // Update
        const updatedUser = {
            ...newUser,
            experience: 3,
            idealcom: testCompanies[1].name
        };
        
        console.log('Updating user with data:', updatedUser);
        
        if (isLocal) {
            await db!.updateUser(updatedUser);
        } else {
            await updateUser(updatedUser);
        }
        console.log('Update user test: ✅ PASSED');

        // Delete
        if (isLocal) {
            await db!.deleteUser(newUser.userId);
        } else {
            await deleteUser(newUser.userId);
        }
        console.log('Delete user test: ✅ PASSED');

        // 3. 测试公司查询
        console.log('\n3. Testing Company queries:');
        const industries = isLocal ? await db!.getAllIndustries() : await getAllIndustries();
        console.log('Get all industries test:', industries.length > 0 ? '✅ PASSED' : '❌ FAILED');

        if (industries.length > 0) {
            const companies = isLocal 
                ? await db!.getCompaniesByIndustry(industries[0])
                : await getCompaniesByIndustry(industries[0]);
            console.log('Get companies by industry test:', companies.length > 0 ? '✅ PASSED' : '❌ FAILED');
        }

        const company = isLocal 
            ? await db!.getCompanyByName(testCompanies[0].name)
            : await getCompanyByName(testCompanies[0].name);
        console.log('Get company by name test:', company !== null ? '✅ PASSED' : '❌ FAILED');

        // Add getAllCompanies test
        const allCompanies = isLocal
            ? await db!.getAllCompanies()
            : await getAllCompanies();
        console.log('Get all companies test:', allCompanies.length > 0 ? '✅ PASSED' : '❌ FAILED');

        console.log('\nAll tests completed successfully! ✅');
        process.exit(0);  // 成功完成后退出

    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);  // 失败时退出
    } finally {
        if (!isLocal) {
            await cleanupTestData();
            await closeTestConnection();
        }
    }
}

// 错误处理
process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection:', error);
    process.exit(1);
});

// 运行测试
const isLocal = process.argv.includes('--local');
runTests(isLocal).catch((error) => {
    console.error('Test suite failed:', error);
    process.exit(1);
}); 