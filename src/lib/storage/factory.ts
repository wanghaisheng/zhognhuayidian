/**
 * Storage Factory - 存储适配器工厂
 * 
 * 根据配置创建对应的存储适配器实例
 * 支持延迟初始化和单例模式
 */

import type { StorageAdapter } from './adapter';
import { SupabaseAdapter } from './adapters/supabase';
import { SqljsAdapter } from './adapters/sqljs';
import { D1Adapter } from './adapters/d1';
import { getStorageConfig, validateStorageConfig, setStorageAdapter, getStorageAdapter } from './config';
import { STORAGE_PROVIDERS, ERROR_MESSAGES } from '@/config/app-constants';

/**
 * 创建存储适配器实例
 */
export async function createStorageAdapter(): Promise<StorageAdapter> {
  // 检查是否已有实例
  const existing = getStorageAdapter();
  if (existing) {
    return existing;
  }
  
  // 获取配置
  const config = getStorageConfig();
  
  // 验证配置
  const validation = validateStorageConfig(config);
  if (!validation.valid) {
    throw new Error(ERROR_MESSAGES.INVALID_CONFIGURATION(validation.errors));
  }
  
  // 根据配置创建适配器
  let adapter: StorageAdapter;
  
  switch (config.provider) {
    case STORAGE_PROVIDERS.SUPABASE:
      if (!config.supabase) {
        throw new Error(ERROR_MESSAGES.STORAGE_PROVIDER_MISSING('Supabase'));
      }
      adapter = new SupabaseAdapter(config.supabase);
      break;
    
    case STORAGE_PROVIDERS.SQLJS:
      adapter = new SqljsAdapter(config.sqljs || {});
      break;
    
    case STORAGE_PROVIDERS.D1:
      adapter = new D1Adapter(config.d1 || {});
      break;
    
    default:
      throw new Error(ERROR_MESSAGES.UNKNOWN_STORAGE_PROVIDER(config.provider));
  }
  
  // 初始化适配器
  await adapter.initialize();
  
  // 设置为全局实例
  setStorageAdapter(adapter);
  
  return adapter;
}

/**
 * 获取或创建存储适配器实例（单例模式）
 */
export async function getOrCreateStorageAdapter(): Promise<StorageAdapter> {
  const existing = getStorageAdapter();
  if (existing) {
    return existing;
  }
  
  return createStorageAdapter();
}

/**
 * 重置存储适配器实例（用于测试）
 */
export function resetStorageAdapter(): void {
  const adapter = getStorageAdapter();
  if (adapter) {
    adapter.close().catch(console.error);
  }
  setStorageAdapter(null as unknown as StorageAdapter);
}
