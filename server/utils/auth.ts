// file: server/utils/auth.ts
import { Lucia } from 'lucia';
import { BetterSqlite3Adapter } from '@lucia-auth/adapter-sqlite';
import sqlite from 'better-sqlite3';
import { join } from 'path';

// 模拟数据库用户类型 (这部分不变)
export interface DatabaseUser {
    id: string;
    email: string;
    name: string;
}

// 确定数据库文件路径
// 在 .output 目录下创建数据库文件，这样每次构建都会是全新的
const dbPath = process.env.NODE_ENV === 'production'
    ? join(process.cwd(), '.data/main.db')
    : join(process.cwd(), '.nuxt/main.db');

// 使用 better-sqlite3 连接到 SQLite 数据库
const db = sqlite(dbPath);

// Lucia 会自动创建 session 和 user 表 (如果不存在)
const adapter = new BetterSqlite3Adapter(db, {
    user: 'user', // user 表名
    session: 'session' // session 表名
});

export const lucia = new Lucia(adapter, {
    // session 过期时间
    sessionCookie: {
        attributes: {
            // 在生产环境中设置 secure 标志
            secure: process.env.NODE_ENV === 'production'
        }
    },
    // 定义 session 中可以访问的用户数据
    getUserAttributes: (attributes) => {
        return {
            name: attributes.name,
            email: attributes.email
        };
    }
});

// 声明 Lucia 的全局类型 (这部分不变)
declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: Omit<DatabaseUser, 'id'>;
    }
}