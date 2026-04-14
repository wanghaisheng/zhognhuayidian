/**
 * Storage Adapter - 统一的数据存储抽象接口
 * 
 * 定义 CRUD、Auth、Query 的统一契约
 * 支持多种存储后端：Supabase、sql.js、Cloudflare D1
 */

// 通用查询选项
export interface QueryOptions {
  select?: string;
  eq?: Record<string, unknown>;
  neq?: Record<string, unknown>;
  in?: Record<string, unknown[]>;
  order?: {
    column: string;
    ascending?: boolean;
  };
  limit?: number;
  offset?: number;
  single?: boolean;
  maybeSingle?: boolean;
}

// 通用查询结果
export interface QueryResult<T> {
  data: T | null;
  error: Error | null;
}

// 通用列表查询结果
export interface QueryListResult<T> {
  data: T[];
  error: Error | null;
}

// 认证用户信息
export interface AuthUser {
  id: string;
  email?: string;
  metadata?: Record<string, unknown>;
}

// 认证会话
export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
}

// 认证选项
export interface AuthOptions {
  email: string;
  password: string;
}

// 认证结果
export interface AuthResult {
  session: AuthSession | null;
  user: AuthUser | null;
  error: Error | null;
}

// 存储适配器接口
export interface StorageAdapter {
  // === CRUD 操作 ===
  
  /**
   * 创建记录
   */
  create<T>(table: string, data: Record<string, unknown>): Promise<QueryResult<T>>;
  
  /**
   * 读取单条记录
   */
  read<T>(table: string, id: string): Promise<QueryResult<T>>;
  
  /**
   * 查询记录
   */
  query<T>(table: string, options: QueryOptions): Promise<QueryListResult<T>>;
  
  /**
   * 更新记录
   */
  update<T>(table: string, id: string, data: Record<string, unknown>): Promise<QueryResult<T>>;
  
  /**
   * 删除记录
   */
  delete(table: string, id: string): Promise<{ error: Error | null }>;
  
  /**
   * Upsert 操作（存在则更新，不存在则创建）
   */
  upsert<T>(table: string, data: Record<string, unknown>, options?: { onConflict: string }): Promise<QueryResult<T>>;
  
  // === 认证操作 ===
  
  /**
   * 用户注册
   */
  signUp(options: AuthOptions): Promise<AuthResult>;
  
  /**
   * 用户登录
   */
  signIn(options: AuthOptions): Promise<AuthResult>;
  
  /**
   * 用户登出
   */
  signOut(): Promise<{ error: Error | null }>;
  
  /**
   * 获取当前用户
   */
  getCurrentUser(): Promise<AuthResult>;
  
  /**
   * 刷新会话
   */
  refreshSession(): Promise<AuthResult>;
  
  // === 高级查询 ===
  
  /**
   * 关联查询
   */
  relatedQuery<T>(table: string, options: QueryOptions & { relations?: string[] }): Promise<QueryListResult<T>>;
  
  /**
   * 批量操作
   */
  batch<T>(operations: Array<{ type: 'create' | 'update' | 'delete'; table: string; data?: Record<string, unknown>; id?: string }>): Promise<QueryListResult<T>>;
  
  // === 存储特性 ===
  
  /**
   * 获取适配器类型
   */
  readonly type: 'supabase' | 'sqljs' | 'd1';
  
  /**
   * 初始化连接
   */
  initialize(): Promise<void>;
  
  /**
   * 关闭连接
   */
  close(): Promise<void>;
  
  /**
   * 健康检查
   */
  healthCheck(): Promise<boolean>;
}
