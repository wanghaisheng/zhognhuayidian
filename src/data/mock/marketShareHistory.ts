
export interface MarketSharePoint {
  year: number;
  share: number; // percentage
  revenue?: string; // optional revenue string
}

export interface ManufacturerMarketData {
  id: string; // manufacturer slug or id
  trend: MarketSharePoint[];
  analysis?: {
    en: string;
    zh: string;
  };
}

export const marketShareHistory: Record<string, ManufacturerMarketData> = {
  'anke-medical': {
    id: 'anke-medical',
    trend: [
      { year: 2019, share: 10.5, revenue: "1.2B" },
      { year: 2020, share: 12.8, revenue: "1.5B" },
      { year: 2021, share: 14.2, revenue: "1.8B" },
      { year: 2022, share: 15.5, revenue: "2.1B" },
      { year: 2023, share: 17.1, revenue: "2.4B" },
      { year: 2024, share: 18.5, revenue: "2.8B" },
    ],
    analysis: {
      en: "Anke Medical has demonstrated robust growth in the China CT market over the past five years. Driven by the flagship ANATOM series and the new ANATOM S precision platform, market share has nearly doubled since 2019. The company has established a strong foothold in county-level hospitals and is aggressively expanding into tertiary institutions with its high-end 256-slice systems.",
      zh: "过去五年中，安科医疗在中国市场的 CT 领域展现了强劲增长。在旗舰 ANATOM 系列和全新 ANATOM S 精准平台的推动下，自 2019 年以来市场份额几乎翻倍。公司在县级医院建立了稳固的立足点，并凭借高端 256 排系统积极拓展三级医院市场。"
    }
  }
};
