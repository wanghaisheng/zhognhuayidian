/**
 * Sqljs Storage Adapter
 * 
 * 实现 StorageAdapter 接口，使用 sql.js (SQLite WebAssembly) 作为后端存储
 * 适用于客户端本地存储和离线场景
 */

import type { StorageAdapter, QueryOptions, QueryResult, QueryListResult, AuthOptions, AuthResult } from '../adapter';

// sql.js 类型定义（简化版）
interface SqlJsDatabase {
  run(sql: string, params?: unknown[]): void;
  exec(sql: string): { values: unknown[][]; columns: string[] }[];
  prepare(sql: string): SqlJsStatement;
  export(): Uint8Array;
  close(): void;
}

interface SqlJsStatement {
  run(params?: unknown[]): void;
  get(params?: unknown[]): unknown;
  all(params?: unknown[]): unknown[];
  free(): void;
}

interface SqlJsModule {
  Database: new (data?: Uint8Array) => SqlJsDatabase;
}

export class SqljsAdapter implements StorageAdapter {
  readonly type = 'sqljs' as const;
  
  private db: SqlJsDatabase | null = null;
  private sqlJsModule: SqlJsModule | null = null;
  private config: { databasePath?: string; cdnUrl?: string };
  private initialized = false;
  
  constructor(config: { databasePath?: string; cdnUrl?: string }) {
    this.config = config;
  }
  
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    
    try {
      // 动态加载 sql.js
      if (!this.sqlJsModule) {
        const initSqlJs = await this.loadSqlJs();
        this.sqlJsModule = await initSqlJs({
          locateFile: (file: string) => {
            return this.config.cdnUrl?.replace('sql-wasm.js', file) || 
                   `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`;
          }
        });
      }
      
      // 创建或加载数据库
      let dbData: Uint8Array | undefined;
      if (this.config.databasePath) {
        try {
          const response = await fetch(this.config.databasePath);
          dbData = new Uint8Array(await response.arrayBuffer());
        } catch (error) {
          console.warn('Failed to load database file, creating new one:', error);
        }
      }
      
      if (!this.sqlJsModule) {
        throw new Error('sql.js module not loaded');
      }
      
      this.db = new this.sqlJsModule.Database(dbData || undefined);
      this.initialized = true;
      
      // 初始化表结构
      await this.initializeTables();
    } catch (error) {
      console.error('Failed to initialize sql.js adapter:', error);
      throw error;
    }
  }
  
  private async loadSqlJs(): Promise<any> {
    // 动态导入 sql.js
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - sql.js 可能没有类型定义
    const sqlJs = await import('sql.js');
    return sqlJs.default || sqlJs;
  }
  
  private ensureInitialized(): void {
    if (!this.initialized || !this.db) {
      throw new Error('SqljsAdapter not initialized. Call initialize() first.');
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
      this.db!.run(sql);
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
      this.db!.run(sql, values);
      
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
      const result = stmt.get([id]);
      stmt.free();
      
      if (!result) {
        return { data: null, error: null };
      }
      
      // 将数组结果转换为对象
      const columns = this.getTableColumns(table);
      const row: Record<string, unknown> = {};
      columns.forEach((col, i) => {
        row[col] = (result as unknown[])[i];
      });
      
      return { data: row as T, error: null };
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
      const results = stmt.all(params);
      stmt.free();
      
      // 将数组结果转换为对象数组
      const columns = this.getTableColumns(table);
      const data: T[] = (results as unknown[][]).map(row => {
        const obj: Record<string, unknown> = {};
        columns.forEach((col, i) => {
          obj[col] = row[i];
        });
        return obj as T;
      });
      
      if (options.maybeSingle || options.single) {
        return { data: data.slice(0, 1), error: null };
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
      this.db!.run(sql, [...values, id]);
      
      return this.read<T>(table, id);
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
  
  async delete(table: string, id: string): Promise<{ error: Error | null }> {
    try {
      this.ensureInitialized();
      
      const sql = `DELETE FROM ${table} WHERE id = ?`;
      this.db!.run(sql, [id]);
      
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
  
  // sql.js 不支持认证功能，返回模拟结果
  async signUp(_options: AuthOptions): Promise<AuthResult> {
    return { 
      session: null, 
      user: null, 
      error: new Error('Authentication is not supported in sql.js adapter') 
    };
  }
  
  async signIn(_options: AuthOptions): Promise<AuthResult> {
    return { 
      session: null, 
      user: null, 
      error: new Error('Authentication is not supported in sql.js adapter') 
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
    // sql.js 不支持原生关联查询，需要手动实现
    // 这里简化处理，只返回主表数据
    return this.query<T>(table, options);
  }
  
  async batch<T>(operations: Array<{ type: 'create' | 'update' | 'delete'; table: string; data?: Record<string, unknown>; id?: string }>): Promise<QueryListResult<T>> {
    try {
      this.ensureInitialized();
      
      // 开启事务
      this.db!.run('BEGIN TRANSACTION');
      
      const results: T[] = [];
      
      for (const op of operations) {
        if (op.type === 'create' && op.data) {
          const result = await this.create<T>(op.table, op.data);
          if (result.data) results.push(result.data);
        } else if (op.type === 'update' && op.id && op.data) {
          const result = await this.update<T>(op.table, op.id, op.data);
          if (result.data) results.push(result.data);
        } else if (op.type === 'delete' && op.id) {
          await this.delete(op.table, op.id);
        }
      }
      
      // 提交事务
      this.db!.run('COMMIT');
      
      return { data: results, error: null };
    } catch (error) {
      // 回滚事务
      this.db!.run('ROLLBACK');
      return { data: [], error: error as Error };
    }
  }
  
  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
    this.initialized = false;
  }
  
  async healthCheck(): Promise<boolean> {
    try {
      this.ensureInitialized();
      this.db!.run('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }
  
  // 辅助方法：获取表的列名
  private getTableColumns(table: string): string[] {
    // 这里简化处理，返回常见列名
    // 实际应该查询表结构
    const columnMap: Record<string, string[]> = {
      manufacturers: ['id', 'slug', 'name_en', 'name_zh', 'country', 'description_en', 'description_zh', 'founded_year', 'headquarters', 'logo_url', 'is_featured', 'market_share', 'category', 'published', 'created_at', 'updated_at'],
      devices: ['id', 'slug', 'name_en', 'name_zh', 'type', 'manufacturer_id', 'description_en', 'description_zh', 'specifications', 'image_url', 'is_featured', 'published', 'release_year', 'price_range', 'certifications', 'created_at', 'updated_at'],
      articles: ['id', 'slug', 'title_en', 'title_zh', 'category', 'content_en', 'content_zh', 'excerpt_en', 'excerpt_zh', 'featured_image', 'author', 'published', 'published_at', 'read_time', 'tags', 'created_at', 'updated_at'],
      customers: ['id', 'slug', 'name_en', 'name_zh', 'province', 'city', 'description_en', 'description_zh', 'image_url', 'hospital_type', 'bed_count', 'year', 'devices', 'published', 'created_at', 'updated_at'],
      historical_events: ['id', 'year', 'title', 'description', 'category', 'manufacturer_id', 'created_at'],
      customer_devices: ['id', 'customer_id', 'device_id', 'manufacturer_id', 'purchase_date', 'created_at'],
    };
    
    return columnMap[table] || ['id'];
  }
}
