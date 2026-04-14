/**
 * Storage Adapter 模块入口
 * 
 * 统一导出所有 Storage Adapter 相关的接口和实现
 */

// 核心接口
export type {
  StorageAdapter,
  QueryOptions,
  QueryResult,
  QueryListResult,
  AuthUser,
  AuthSession,
  AuthOptions,
  AuthResult,
} from './adapter';

// 配置
export type {
  StorageProvider,
  StorageConfig,
} from './config';

export {
  getStorageConfig,
  validateStorageConfig,
  setStorageAdapter,
  getStorageAdapter,
  resetStorageAdapter,
} from './config';

// Adapters
export { SupabaseAdapter } from './adapters/supabase';
export { SqljsAdapter } from './adapters/sqljs';
export { D1Adapter } from './adapters/d1';

// Factory
export {
  createStorageAdapter,
  getOrCreateStorageAdapter,
  resetStorageAdapter as resetFactory,
} from './factory';
