// file: server/types/nitro.d.ts

// 导入我们需要的 Lucia 类型
import type { Session, User } from 'lucia';

// 使用 declare module 来扩展 'h3' 模块的类型
declare module 'h3' {
  // 扩展 H3EventContext 接口
  interface H3EventContext {
    // 明确定义 user 和 session 属性和它们的类型
    // 类型是 User | null 和 Session | null，因为用户可能未登录
    user: User | null | any;
    session: Session | null;
  }
}

// 这是一个必需的空导出，以确保此文件被视为一个模块
export {};