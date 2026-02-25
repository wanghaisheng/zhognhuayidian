export interface ExpertProfile {
  name: string;
  title: string;
  credentials: string;
  expertise: string[];
  publications: string;
  avatar: string;
}

export interface IndustryInsightCategory {
  category: string;
  insights: string[];
}

export interface ExpertAnalysisData {
  expertProfiles: ExpertProfile[];
  industryInsights: IndustryInsightCategory[];
}
