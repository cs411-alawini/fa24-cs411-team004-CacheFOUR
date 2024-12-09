import { Company } from '../models/Company';
import { UserAccount } from '../models/UserAccount';
import { testCompanies, testAlterTables, testJobs, testPositions, testSOC, testUserAccounts } from '../../data/AllData';


export class MockDatabase {
    private companies: Company[] = [];
    private users: UserAccount[] = [];

    constructor() {
        // 初始化测试数据
        this.companies = [...testCompanies];
        this.users = [...testUserAccounts];
    }

    // (1) 验证用户并获取信息
    async validateAndGetUser(userId: number, name: string): Promise<UserAccount | null> {
        return this.users.find(user => user.userId === userId && user.name === name) || null;
    }

    // (2) 用户CRUD操作
    async createUser(user: UserAccount): Promise<void> {
        if (this.users.some(u => u.userId === user.userId)) {
            throw new Error('User already exists');
        }
        this.users.push({...user});
    }

    async updateUser(user: UserAccount): Promise<void> {
        const index = this.users.findIndex(u => u.userId === user.userId);
        if (index === -1) {
            throw new Error('User not found');
        }
        this.users[index] = {...user};
    }

    async deleteUser(userId: number): Promise<void> {
        const index = this.users.findIndex(u => u.userId === userId);
        if (index === -1) {
            throw new Error('User not found');
        }
        this.users.splice(index, 1);
    }

    // (3) 获取最大UserId
    async getMaxUserId(): Promise<number> {
        return Math.max(...this.users.map(u => u.userId), 0);
    }

    // (4) 获取所有行业
    async getAllIndustries(): Promise<string[]> {
        return [...new Set(this.companies
            .map(c => c.industry)
            .filter((industry): industry is string => industry !== undefined))];
    }

    // (5) 根据行业查找公司
    async getCompaniesByIndustry(industry: string): Promise<Company[]> {
        return this.companies.filter(c => c.industry === industry);
    }

    // (6) 根据公司名称查找公司
    async getCompanyByName(name: string): Promise<Company | null> {
        return this.companies.find(c => c.name === name) || null;
    }

    // 获取所有公司
    async getAllCompanies(): Promise<Company[]> {
        return [...this.companies];
    }
} 