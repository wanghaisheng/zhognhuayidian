// 统一数据管理系统 - 处理JSON数据和API接口
import { 
  StandardizedManufacturer, 
  StandardizedDevice, 
  StandardizedCustomer, 
  SearchFilters, 
  SearchResult 
} from '../types/standardized';

// 数据存储接口
export interface DataStore {
  manufacturers: StandardizedManufacturer[];
  devices: StandardizedDevice[];
  customers: StandardizedCustomer[];
}

// 数据管理器主类
export class DataManager {
  private static instance: DataManager;
  private dataStore: DataStore = {
    manufacturers: [],
    devices: [],
    customers: []
  };

  private constructor() {}

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  // 初始化数据
  async initialize(data: Partial<DataStore>): Promise<void> {
    this.dataStore = {
      manufacturers: data.manufacturers || [],
      devices: data.devices || [],
      customers: data.customers || []
    };
  }

  // 制造商相关方法
  getManufacturers(filters?: {
    category?: string[];
    country?: string[];
    region?: string[];
  }): StandardizedManufacturer[] {
    let result = this.dataStore.manufacturers;

    if (filters) {
      if (filters.category) {
        result = result.filter(m => filters.category!.includes(m.category));
      }
      if (filters.country) {
        result = result.filter(m => filters.country!.includes(m.country));
      }
      if (filters.region) {
        result = result.filter(m => filters.region!.includes(m.region));
      }
    }

    return result.sort((a, b) => b.market_share - a.market_share);
  }

  getManufacturerById(id: string): StandardizedManufacturer | undefined {
    return this.dataStore.manufacturers.find(m => m.id === id);
  }

  // 设备相关方法
  searchDevices(filters: SearchFilters, page: number = 1, pageSize: number = 20): SearchResult<StandardizedDevice> {
    let result = this.dataStore.devices;

    // 应用筛选条件
    if (filters.deviceType?.length) {
      result = result.filter(d => filters.deviceType!.includes(d.type));
    }
    if (filters.category?.length) {
      result = result.filter(d => filters.category!.includes(d.category));
    }
    if (filters.manufacturers?.length) {
      result = result.filter(d => filters.manufacturers!.includes(d.manufacturer_id));
    }

    // 分页
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResult = result.slice(startIndex, endIndex);

    return {
      items: paginatedResult,
      total: result.length,
      page,
      pageSize,
      hasMore: endIndex < result.length
    };
  }

  getDeviceById(id: string): StandardizedDevice | undefined {
    return this.dataStore.devices.find(d => d.id === id);
  }

  // 客户相关方法
  getCustomers(): StandardizedCustomer[] {
    return this.dataStore.customers.sort((a, b) => (b.bed_count || 0) - (a.bed_count || 0));
  }

  getCustomerById(id: string): StandardizedCustomer | undefined {
    return this.dataStore.customers.find(c => c.id === id);
  }
}

// 导出单例实例
export const dataManager = DataManager.getInstance();