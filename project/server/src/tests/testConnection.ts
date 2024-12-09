import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

const TEST_SCHEMA = 'unicareer_test';

// 管理员连接池（用于创建数据库）
const adminPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
});

// 测试数据库连接池
export const testPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: TEST_SCHEMA,
    multipleStatements: true
});

export async function initTestEnvironment() {
    try {
        // 先使用管理员连接创建数据库
        await adminPool.query(`CREATE DATABASE IF NOT EXISTS ${TEST_SCHEMA}`);
        console.log('Test database created or already exists');

        // 切换到测试数据库
        await testPool.query(`USE ${TEST_SCHEMA}`);

        // 删除已存在的表（如果存在）
        await testPool.query(`
            DROP TABLE IF EXISTS UserAccount;
            DROP TABLE IF EXISTS Company;
        `);

        // 创建 Company 表
        await testPool.query(`
            CREATE TABLE IF NOT EXISTS Company (
                name VARCHAR(255) PRIMARY KEY,
                size INT,
                ceo VARCHAR(255),
                industry VARCHAR(255),
                website VARCHAR(255)
            )
        `);

        // 创建 UserAccount 表
        await testPool.query(`
            CREATE TABLE IF NOT EXISTS UserAccount (
                userId INT PRIMARY KEY,
                name VARCHAR(255),
                experience INT,
                idealcom VARCHAR(255),
                education VARCHAR(255),
                FOREIGN KEY (idealcom) REFERENCES Company(name) ON DELETE SET NULL
            )
        `);

        console.log('Test environment initialized successfully');
    } catch (error) {
        console.error('Failed to initialize test environment:', error);
        throw error;
    }
}

export async function cleanupTestData() {
    if (!testPool) return;
    
    try {
        await testPool.query('DELETE FROM UserAccount');
        await testPool.query('DELETE FROM Company');
        console.log('Test data cleaned up successfully');
    } catch (error) {
        console.error('Failed to cleanup test data:', error);
        throw error;
    }
}

export async function closeTestConnection() {
    try {
        await adminPool.end();
        await testPool.end();
        console.log('Test connections closed successfully');
    } catch (error) {
        console.error('Failed to close test connection:', error);
        throw error;
    }
} 