/**
 * Supabase Storage Adapter
 * 
 * 实现 StorageAdapter 接口，使用 Supabase 作为后端存储
 */

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { StorageAdapter, QueryOptions, QueryResult, QueryListResult, AuthOptions, AuthResult, AuthUser, AuthSession } from '../adapter';

export class SupabaseAdapter implements StorageAdapter {
  readonly type = 'supabase' as const;
  
  private client: SupabaseClient | null = null;
  private config: { url: string; key: string };
  
  constructor(config: { url: string; key: string }) {
    this.config = config;
  }
  
  async initialize(): Promise<void> {
    if (this.client) {
      return;
    }
    
    this.client = createClient(this.config.url, this.config.key, {
      auth: {
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        persistSession: typeof window !== 'undefined',
        autoRefreshToken: typeof window !== 'undefined',
      },
    });
  }
  
  private ensureClient(): SupabaseClient {
    if (!this.client) {
      throw new Error('Supabase client not initialized. Call initialize() first.');
    }
    return this.client;
  }
  
  
  async create<T>(table: string, data: Record<string, unknown>): Promise<QueryResult<T>> {
    try {
      const { data: result, error } = await this.ensureClient()
        .from(table)
        .insert(data)
        .select()
        .single();
      
      if (error) {
        return { data: null, error };
      }
      
      return { data: result as T, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
  
  async read<T>(table: string, id: string): Promise<QueryResult<T>> {
    try {
      const { data, error } = await this.ensureClient()
        .from(table)
        .select()
        .eq('id', id)
        .single();
      
      if (error) {
        return { data: null, error };
      }
      
      return { data: data as T, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
  
  async query<T>(table: string, options: QueryOptions): Promise<QueryListResult<T>> {
    try {
      const client = this.ensureClient();
      let query: any = client.from(table);
      
      if (options.select) {
        query = query.select(options.select);
      } else {
        query = query.select('*');
      }
      
      if (options.eq) {
        Object.entries(options.eq).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      if (options.neq) {
        Object.entries(options.neq).forEach(([key, value]) => {
          query = query.neq(key, value);
        });
      }
      
      if (options.in) {
        Object.entries(options.in).forEach(([key, value]) => {
          query = query.in(key, value as unknown[]);
        });
      }
      
      if (options.order) {
        query = query.order(options.order.column, { 
          ascending: options.order.ascending ?? true 
        });
      }
      
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }
      
      if (options.single) {
        const { data, error } = await query.single();
        if (error) {
          return { data: [], error };
        }
        return { data: data ? [data as T] : [], error: null };
      }
      
      if (options.maybeSingle) {
        const { data, error } = await query.maybeSingle();
        if (error) {
          return { data: [], error };
        }
        return { data: data ? [data as T] : [], error: null };
      }
      
      const { data, error } = await query;
      
      if (error) {
        return { data: [], error };
      }
      
      return { data: (data || []) as T[], error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }
  
  async update<T>(table: string, id: string, data: Record<string, unknown>): Promise<QueryResult<T>> {
    try {
      const { data: result, error } = await this.ensureClient()
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        return { data: null, error };
      }
      
      return { data: result as T, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
  
  async delete(table: string, id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.ensureClient()
        .from(table)
        .delete()
        .eq('id', id);
      
      return { error: error || null };
    } catch (error) {
      return { error: error as Error };
    }
  }
  
  async upsert<T>(table: string, data: Record<string, unknown>, options?: { onConflict: string }): Promise<QueryResult<T>> {
    try {
      const { data: result, error } = await this.ensureClient()
        .from(table)
        .upsert(data, { onConflict: options?.onConflict })
        .select()
        .single();
      
      if (error) {
        return { data: null, error };
      }
      
      return { data: result as T, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
  
  async signUp(options: AuthOptions): Promise<AuthResult> {
    try {
      const { data, error } = await this.ensureClient().auth.signUp({
        email: options.email,
        password: options.password,
      });
      
      if (error) {
        return { session: null, user: null, error };
      }
      
      const session: AuthSession | null = data.session ? {
        user: {
          id: data.session.user.id,
          email: data.session.user.email,
          metadata: data.session.user.user_metadata,
        },
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      } : null;
      
      const user: AuthUser | null = data.user ? {
        id: data.user.id,
        email: data.user.email,
        metadata: data.user.user_metadata,
      } : null;
      
      return { session, user, error: null };
    } catch (error) {
      return { session: null, user: null, error: error as Error };
    }
  }
  
  async signIn(options: AuthOptions): Promise<AuthResult> {
    try {
      const { data, error } = await this.ensureClient().auth.signInWithPassword({
        email: options.email,
        password: options.password,
      });
      
      if (error) {
        return { session: null, user: null, error };
      }
      
      const session: AuthSession = {
        user: {
          id: data.session.user.id,
          email: data.session.user.email,
          metadata: data.session.user.user_metadata,
        },
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      };
      
      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        metadata: data.user.user_metadata,
      };
      
      return { session, user, error: null };
    } catch (error) {
      return { session: null, user: null, error: error as Error };
    }
  }
  
  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.ensureClient().auth.signOut();
      return { error: error || null };
    } catch (error) {
      return { error: error as Error };
    }
  }
  
  async getCurrentUser(): Promise<AuthResult> {
    try {
      const { data, error } = await this.ensureClient().auth.getUser();
      
      if (error) {
        return { session: null, user: null, error };
      }
      
      if (!data.user) {
        return { session: null, user: null, error: null };
      }
      
      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        metadata: data.user.user_metadata,
      };
      
      return { session: null, user, error: null };
    } catch (error) {
      return { session: null, user: null, error: error as Error };
    }
  }
  
  async refreshSession(): Promise<AuthResult> {
    try {
      const { data, error } = await this.ensureClient().auth.refreshSession();
      
      if (error) {
        return { session: null, user: null, error };
      }
      
      if (!data.session) {
        return { session: null, user: null, error: null };
      }
      
      const session: AuthSession = {
        user: {
          id: data.session.user.id,
          email: data.session.user.email,
          metadata: data.session.user.user_metadata,
        },
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      };
      
      const user: AuthUser = data.user ? {
        id: data.user.id,
        email: data.user.email,
        metadata: data.user.user_metadata,
      } : session.user;
      
      return { session, user, error: null };
    } catch (error) {
      return { session: null, user: null, error: error as Error };
    }
  }
  
  async relatedQuery<T>(table: string, options: QueryOptions & { relations?: string[] }): Promise<QueryListResult<T>> {
    try {
      let select = options.select || '*';
      
      if (options.relations && options.relations.length > 0) {
        select = options.relations.map(rel => `${rel}(*`).join(', ') + ', *';
      }
      
      return this.query<T>(table, { ...options, select });
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }
  
  async batch<T>(operations: Array<{ type: 'create' | 'update' | 'delete'; table: string; data?: Record<string, unknown>; id?: string }>): Promise<QueryListResult<T>> {
    try {
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
      
      return { data: results, error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }
  
  async close(): Promise<void> {
    this.client = null;
  }
  
  async healthCheck(): Promise<boolean> {
    try {
      const { error } = await this.ensureClient().from('manufacturers').select('id').limit(1);
      return !error;
    } catch {
      return false;
    }
  }
}
