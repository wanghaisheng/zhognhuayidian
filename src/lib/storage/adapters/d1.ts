/**
 * Cloudflare D1 Storage Adapter
 * 
 * 实现 StorageAdapter 接口，使用 Cloudflare D1 作为后端存储
 * 适用于 Cloudflare Workers 和 Pages Functions 环境
 */

import type { StorageAdapter, QueryOptions, QueryResult, QueryListResult, AuthOptions, AuthResult } from '../adapter';

// Cloudflare D1 类型定义（简化版）
interface D1Database {
  prepare(sql: string): D1Statement;
  batch(statements: D1Statement[]): Promise<D1Result[]>;
  exec(sql: string): D1Result;
}

interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first(): Promise<unknown>;
  all(): Promise<{ results: unknown[]; success: boolean; meta: unknown }>;
  run(): Promise<D1Result>;
}

interface D1Result {
  success: boolean;
  meta: unknown;
  results?: unknown[];
}

export class D1Adapter implements StorageAdapter {
  readonly type = 'd1' as const;
  
  private db: D1Database | null = null;
  private config: { bindingName?: string; databaseId?: string };
  private initialized = false;
  
  constructor(config: { bindingName?: string; databaseId?: string }) {
    this.config = config;
  }
  
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    
    try {
      // 在 Cloudflare Workers 环境中，D1 通过绑定注入
      // @ts-ignore - Cloudflare Workers 全局变量
      if (typeof globalThis !== 'undefined' && globalThis[this.config.bindingName || 'DB']) {
        // @ts-ignore
        this.db = globalThis[this.config.bindingName || 'DB'];
      } else if (typeof window !== 'undefined' && (window as any)[this.config.bindingName || 'DB']) {
        // @ts-ignore
        this.db = (window as any)[this.config.bindingName || 'DB'];
      } else {
        throw new Error('D1 database binding not found. Make sure you are running in a Cloudflare Worker environment.');
      }
      
      this.initialized = true;
      
      // 初始化表结构
      await this.initializeTables();
    } catch (error) {
      console.error('Failed to initialize D1 adapter:', error);
      throw error;
    }
  }
  
  private ensureInitialized(): void {
    if (!this.initialized || !this.db) {
      throw new Error('D1Adapter not initialized. Call initialize() first.');
    }
  }
  
  private async initializeTables(): Promise<void> {
    const tables = [
      `CREATE TABLE IF NOT EXISTS manufacturers (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        name_en TEXT NOT NULL,
        name_zh TEXT NOT NULL,
        country TEXT NOT NULL,
        description_en TEXT,
        description_zh TEXT,
        founded_year INTEGER,
        headquarters TEXT,
        logo_url TEXT,
        is_featured INTEGER DEFAULT 0,
        market_share REAL,
        category TEXT,
        published INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS devices (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        name_en TEXT NOT NULL,
        name_zh TEXT NOT NULL,
        type TEXT NOT NULL,
        manufacturer_id TEXT,
        description_en TEXT,
        description_zh TEXT,
        specifications TEXT,
        image_url TEXT,
        is_featured INTEGER DEFAULT 0,
        published INTEGER DEFAULT 1,
        release_year INTEGER,
        price_range TEXT,
        certifications TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id)
      )`,
      
      `CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title_en TEXT NOT NULL,
        title_zh TEXT NOT NULL,
        category TEXT NOT NULL,
        content_en TEXT,
        content_zh TEXT,
        excerpt_en TEXT,
        excerpt_zh TEXT,
        featured_image TEXT,
        author TEXT,
        published INTEGER DEFAULT 1,
        published_at TEXT,
        read_time INTEGER,
        tags TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        name_en TEXT NOT NULL,
        name_zh TEXT NOT NULL,
        province TEXT NOT NULL,
        city TEXT,
        description_en TEXT,
        description_zh TEXT,
        image_url TEXT,
        hospital_type TEXT,
        bed_count INTEGER,
        year INTEGER,
        devices TEXT,
        published INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS historical_events (
        id TEXT PRIMARY KEY,
        year INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        manufacturer_id TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id)
      )`,
      
      `CREATE TABLE IF NOT EXISTS customer_devices (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        device_id TEXT NOT NULL,
        manufacturer_id TEXT NOT NULL,
        purchase_date TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id),
        FOREIGN KEY (device_id) REFERENCES devices(id),
        FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id)
      )`,
    ];
    
    for (const sql of tables) {
      await this.db!.exec(sql);
    }
  }
  
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  async create<T>(table: string, data: Record<string, unknown>): Promise<QueryResult<T>> {
    try {
      this.ensureInitialized();
      
      const id = data.id || this.generateId();
      const columns = Object.keys({ ...data, id });
      const values = Object.values({ ...data, id });
      const placeholders = values.map(() => '?').join(', ');
      
      const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
      const stmt = this.db!.prepare(sql);
      await stmt.bind(...values).run();
      
      // 返回创建的记录
      return this.read<T>(table, id as string);
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
  
  async read<T>(table: string, id: string): Promise<QueryResult<T>> {
    try {
      this.ensureInitialized();
      
      const sql = `SELECT * FROM ${table} WHERE id = ?`;
      const stmt = this.db!.prepare(sql);
      const result = await stmt.bind(id).first();
      
      if (!result) {
        return { data: null, error: null };
      }
      
      return { data: result as T, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
  
  async query<T>(table: string, options: QueryOptions): Promise<QueryListResult<T>> {
    try {
      this.ensureInitialized();
      
      let sql = `SELECT ${options.select || '*'} FROM ${table}`;
      const params: unknown[] = [];
      const conditions: string[] = [];
      
      if (options.eq) {
        Object.entries(options.eq).forEach(([key, value]) => {
          conditions.push(`${key} = ?`);
          params.push(value);
        });
      }
      
      if (options.neq) {
        Object.entries(options.neq).forEach(([key, value]) => {
          conditions.push(`${key} != ?`);
          params.push(value);
        });
      }
      
      if (options.in) {
        Object.entries(options.in).forEach(([key, value]) => {
          const placeholders = (value as unknown[]).map(() => '?').join(', ');
          conditions.push(`${key} IN (${placeholders})`);
          params.push(...value);
        });
      }
      
      if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
      }
      
      if (options.order) {
        sql += ` ORDER BY ${options.order.column} ${options.order.ascending ? 'ASC' : 'DESC'}`;
      }
      
      if (options.limit) {
        sql += ` LIMIT ${options.limit}`;
      }
      
      if (options.offset) {
        sql += ` OFFSET ${options.offset}`;
      }
      
      const stmt = this.db!.prepare(sql);
      const result = await stmt.bind(...params).all();
      
      let data = result.results as T[];
      
      if (options.maybeSingle || options.single) {
        data = data.slice(0, 1);
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }
  
  async update<T>(table: string, id: string, data: Record<string, unknown>): Promise<QueryResult<T>> {
    try {
      this.ensureInitialized();
      
      const columns = Object.keys(data);
      const values = Object.values(data);
      const setClause = columns.map(col => `${col} = ?`).join(', ');
      
      const sql = `UPDATE ${table} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      const stmt = this.db!.prepare(sql);
      await stmt.bind(...values, id).run();
      
      return this.read<T>(table, id);
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
  
  async delete(table: string, id: string): Promise<{ error: Error | null }> {
    try {
      this.ensureInitialized();
      
      const sql = `DELETE FROM ${table} WHERE id = ?`;
      const stmt = this.db!.prepare(sql);
      await stmt.bind(id).run();
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }
  
  async upsert<T>(table: string, data: Record<string, unknown>, options?: { onConflict: string }): Promise<QueryResult<T>> {
    try {
      this.ensureInitialized();
      
      // 检查记录是否存在
      const conflictColumn = options?.onConflict || 'id';
      const conflictValue = data[conflictColumn];
      
      if (!conflictValue) {
        return this.create<T>(table, data);
      }
      
      const existing = await this.query<T>(table, {
        eq: { [conflictColumn]: conflictValue },
        maybeSingle: true
      });
      
      if (existing.data.length > 0) {
        // 更新
        const id = (existing.data[0] as Record<string, unknown>).id;
        return this.update<T>(table, id as string, data);
      } else {
        // 创建
        return this.create<T>(table, data);
      }
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
  
  // D1 不支持认证功能，返回模拟结果
  async signUp(_options: AuthOptions): Promise<AuthResult> {
    return { 
      session: null, 
      user: null, 
      error: new Error('Authentication is not supported in D1 adapter') 
    };
  }
  
  async signIn(_options: AuthOptions): Promise<AuthResult> {
    return { 
      session: null, 
      user: null, 
      error: new Error('Authentication is not supported in D1 adapter') 
    };
  }
  
  async signOut(): Promise<{ error: Error | null }> {
    return { error: null };
  }
  
  async getCurrentUser(): Promise<AuthResult> {
    return { session: null, user: null, error: null };
  }
  
  async refreshSession(): Promise<AuthResult> {
    return { session: null, user: null, error: null };
  }
  
  async relatedQuery<T>(table: string, options: QueryOptions & { relations?: string[] }): Promise<QueryListResult<T>> {
    // D1 不支持原生关联查询，需要手动实现
    // 这里简化处理，只返回主表数据
    return this.query<T>(table, options);
  }
  
  async batch<T>(operations: Array<{ type: 'create' | 'update' | 'delete'; table: string; data?: Record<string, unknown>; id?: string }>): Promise<QueryListResult<T>> {
    try {
      this.ensureInitialized();
      
      const statements: D1Statement[] = [];
      const results: T[] = [];
      
      for (const op of operations) {
        if (op.type === 'create' && op.data) {
          const id = op.data.id || this.generateId();
          const columns = Object.keys({ ...op.data, id });
          const values = Object.values({ ...op.data, id });
          const placeholders = values.map(() => '?').join(', ');
          const sql = `INSERT INTO ${op.table} (${columns.join(', ')}) VALUES (${placeholders})`;
          const stmt = this.db!.prepare(sql);
          statements.push(stmt.bind(...values));
        } else if (op.type === 'update' && op.id && op.data) {
          const columns = Object.keys(op.data);
          const values = Object.values(op.data);
          const setClause = columns.map(col => `${col} = ?`).join(', ');
          const sql = `UPDATE ${op.table} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
          const stmt = this.db!.prepare(sql);
          statements.push(stmt.bind(...values, op.id));
        } else if (op.type === 'delete' && op.id) {
          const sql = `DELETE FROM ${op.table} WHERE id = ?`;
          const stmt = this.db!.prepare(sql);
          statements.push(stmt.bind(op.id));
        }
      }
      
      // 批量执行
      await this.db!.batch(statements);
      
      return { data: results, error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }
  
  async close(): Promise<void> {
    this.db = null;
    this.initialized = false;
  }
  
  async healthCheck(): Promise<boolean> {
    try {
      this.ensureInitialized();
      await this.db!.prepare('SELECT 1').first();
      return true;
    } catch {
      return false;
    }
  }
}
