// file: server/api/auth/login.post.ts
import { lucia, type DatabaseUser } from '~/server/utils/auth';
import sqlite from 'better-sqlite3';
import { join } from 'path';

// --- 复用数据库连接 ---
const dbPath = process.env.NODE_ENV === 'production'
    ? join(process.cwd(), '.data/main.db')
    : join(process.cwd(), '.nuxt/main.db');
const db = sqlite(dbPath);
// ---

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const body = await readBody(event);

    try {
        // 1. 转发请求到真实后端进行验证 (这部分不变)
        const realBackendUser = await $fetch<DatabaseUser>(`${config.mockBackendUrl}/api/auth/login`, {
            method: 'POST',
            body: {
                email: body.email,
                password: body.password,
            },
        });

        // 2. 检查用户是否已在我们的 Nuxt BFF 数据库中
        // 使用 .get() 方法查询单条记录
        const existingUser = db.prepare('SELECT * FROM user WHERE id = ?').get(realBackendUser.id) as DatabaseUser | undefined;

        if (!existingUser) {
            // 如果用户不存在，将其信息插入到我们的 user 表中
            db.prepare('INSERT INTO user (id, email, name) VALUES (?, ?, ?)').run(
                realBackendUser.id,
                realBackendUser.email,
                realBackendUser.name
            );
            console.log(`[BFF] User ${realBackendUser.name} not found in local DB, creating...`);
        }

        // 3. 为用户创建 session (这部分不变)
        const session = await lucia.createSession(realBackendUser.id, {
            email: realBackendUser.email,
            name: realBackendUser.name,
        });

        // 4. 设置 session cookie (这部分不变)
        appendHeader(event, 'Set-Cookie', lucia.createSessionCookie(session.id).serialize());

        console.log('[BFF] Login success, session created.');
        return { status: 'ok' };

    } catch (error: any) {
        console.error('[BFF] Login failed:', error.data?.message || error.message);
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid credentials',
        });
    }
});