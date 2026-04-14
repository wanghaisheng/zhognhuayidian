/**
 * Storage Configuration - 存储适配器配置系统
 * 
 * 通过环境变量和配置文件切换不同的存储后端
 * 支持：Supabase、sql.js、Cloudflare D1
 */

import type { StorageAdapter } from './adapter';
import { STORAGE_PROVIDERS, ENV_KEYS, DEFAULTS, ERROR_MESSAGES } from '@/config/app-constants';

export type StorageProvider = typeof STORAGE_PROVIDERS[keyof typeof STORAGE_PROVIDERS];

export interface StorageConfig {
  provider: StorageProvider;
  supabase?: {
    url: string;
    key: string;
  };
  sqljs?: {
    databasePath?: string;
    cdnUrl?: string;
  };
  d1?: {
    bindingName?: string;
    databaseId?: string;
  };
}

/**
 * 从环境变量获取存储配置
 */
export function getStorageConfig(): StorageConfig {
  const provider = (import.meta.env[ENV_KEYS.STORAGE_PROVIDER] || DEFAULTS.STORAGE_PROVIDER) as StorageProvider;
  
  const config: StorageConfig = {
    provider,
  };
  
  if (provider === STORAGE_PROVIDERS.SUPABASE) {
    config.supabase = {
      url: import.meta.env[ENV_KEYS.SUPABASE_URL] || '',
      key: import.meta.env[ENV_KEYS.SUPABASE_PUBLISHABLE_KEY] || '',
    };
  } else if (provider === STORAGE_PROVIDERS.SQLJS) {
    config.sqljs = {
      databasePath: import.meta.env[ENV_KEYS.SQLJS_DATABASE_PATH],
      cdnUrl: import.meta.env[ENV_KEYS.SQLJS_CDN_URL] || 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js',
    };
  } else if (provider === STORAGE_PROVIDERS.D1) {
    config.d1 = {
      bindingName: import.meta.env[ENV_KEYS.D1_BINDING_NAME] || 'DB',
      databaseId: import.meta.env[ENV_KEYS.D1_DATABASE_ID],
    };
  }
  
  return config;
}

/**
 * 验证配置是否有效
 */
export function validateStorageConfig(config: StorageConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (config.provider === STORAGE_PROVIDERS.SUPABASE) {
    if (!config.supabase?.url) {
      errors.push('Supabase URL is required when using supabase provider');
    }
    if (!config.supabase?.key) {
      errors.push('Supabase key is required when using supabase provider');
    }
  } else if (config.provider === STORAGE_PROVIDERS.SQLJS) {
    // sql.js 配置是可选的，可以使用 CDN
  } else if (config.provider === STORAGE_PROVIDERS.D1) {
    if (!config.d1?.databaseId) {
      errors.push('D1 database ID is required when using d1 provider');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 全局存储适配器实例
 */
let storageAdapterInstance: StorageAdapter | null = null;

/**
 * 设置全局存储适配器实例
 */
export function setStorageAdapter(adapter: StorageAdapter): void {
  storageAdapterInstance = adapter;
}

/**
 * 获取全局存储适配器实例
 */
export function getStorageAdapter(): StorageAdapter | null {
  return storageAdapterInstance;
}

/**
 * 重置全局存储适配器实例（用于测试）
 */
export function resetStorageAdapter(): void {
  storageAdapterInstance = null;
}
