// file: server/middleware/auth.ts
import { lucia } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
    const sessionId = getCookie(event, lucia.sessionCookieName);

    console.log('server-middleware-sessionId', sessionId)
    if (!sessionId) {
        // 如果没有session，将 user 设置为 null
        event.context.user = null;
        event.context.session = null;
        return;
    }

    const { session, user } = await lucia.validateSession(sessionId);

    // 如果 session 过期或无效，删除 cookie
    if (!session) {
        appendHeader(event, 'Set-Cookie', lucia.createBlankSessionCookie().serialize());
    }

    event.context.user = user;
    event.context.session = session;
});