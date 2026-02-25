import { Manufacturer } from './manufacturer';
import { Device } from './device';
import { MarketData, CustomerSegment, PriceTrends, TechnologyTrends } from './market';

export interface EnhancedManufacturer extends Manufacturer {
  globalPresence: string[];
  certifications: string[];
  keyProducts: string[];
  competitiveAdvantage: string[];
}

export interface IntegratedMetadata {
  lastUpdated: string;
  version: string;
  dataSource: string;
  totalManufacturers: number;
  totalDevices: number;
}

export interface EnhancedIntegratedData {
  manufacturers: EnhancedManufacturer[];
  devices: Device[];
  marketData: MarketData;
  customerSegments: CustomerSegment[];
  priceTrends: PriceTrends;
  technologyTrends: TechnologyTrends;
  metadata: IntegratedMetadata;
}
