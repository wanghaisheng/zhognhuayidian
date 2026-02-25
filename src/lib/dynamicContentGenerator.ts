// 类型定义
interface BrandCharacteristics {
  approach: string;
  strengths: string;
  service_coverage: string;
  service_strength: string;
  pricing_position: string;
  imaging_strength: string;
  service_advantage: string;
  recommendations: string[];
}

interface BrandData {
  name?: string;
  country?: string;
  description?: string;
  founded_year?: number;
  market_share_ct?: number;
  market_share_mri?: number;
}

interface CategoryInfo {
  focus_areas: string[];
  equipment_type: string;
}

// 动态内容生成器
export class DynamicContentGenerator {
  
  // 品牌特征数据
  private static brandCharacteristics = {
    siemens: {
      approach: "precision engineering and innovation leadership",
      strengths: "advanced dose reduction and AI-powered features",
      service_coverage: "Strong global presence with emphasis on technical excellence",
      service_strength: "comprehensive training and clinical education programs",
      pricing_position: "Premium positioning with focus on long-term value",
      imaging_strength: "dose efficiency and advanced reconstruction algorithms",
      service_advantage: "technical expertise and comprehensive training programs",
      recommendations: [
        "You prioritize cutting-edge technology and innovation",
        "Image quality and dose reduction are critical priorities",
        "You have budget for premium equipment and training"
      ]
    },
    'ge-healthcare': {
      approach: "comprehensive healthcare solutions and operational efficiency",
      strengths: "robust service network and healthcare IT integration",
      service_coverage: "Extensive global network with fast response times",
      service_strength: "rapid response times and extensive parts availability",
      pricing_position: "Competitive pricing with flexible financing options",
      imaging_strength: "workflow efficiency and user-friendly interfaces",
      service_advantage: "extensive service network and rapid response capabilities",
      recommendations: [
        "Cost-effectiveness and competitive pricing are priorities",
        "Extensive service coverage is critical for your location",
        "Healthcare IT integration is important for your workflow"
      ]
    },
    philips: {
      approach: "patient-centric design and workflow optimization",
      strengths: "ergonomic design and patient comfort features",
      service_coverage: "Global service network with focus on customer partnerships",
      service_strength: "collaborative approach and workflow consulting",
      pricing_position: "Balanced pricing with emphasis on workflow value",
      imaging_strength: "patient comfort and workflow efficiency",
      service_advantage: "collaborative partnerships and workflow optimization",
      recommendations: [
        "Patient comfort and experience are top priorities",
        "Workflow optimization is critical for efficiency",
        "You value collaborative vendor partnerships"
      ]
    },
    canon: {
      approach: "innovative imaging technology and dose optimization",
      strengths: "advanced detector technology and dose reduction",
      service_coverage: "Growing global presence with regional expertise",
      service_strength: "technical innovation and application support",
      pricing_position: "Competitive pricing with strong value proposition",
      imaging_strength: "detector technology and dose optimization",
      service_advantage: "technical innovation and application expertise",
      recommendations: [
        "You want innovative technology at competitive prices",
        "Dose reduction is a critical requirement",
        "You're open to working with emerging market leaders"
      ]
    },
    mindray: {
      approach: "cost-effective innovation and accessibility",
      strengths: "competitive pricing and reliable performance",
      service_coverage: "Expanding global network with regional focus",
      service_strength: "cost-effective service and local support",
      pricing_position: "Highly competitive pricing with excellent value",
      imaging_strength: "reliable performance and cost-effectiveness",
      service_advantage: "competitive service costs and growing support network",
      recommendations: [
        "Budget constraints are a primary consideration",
        "You need reliable performance at competitive prices",
        "Local service availability is adequate for your needs"
      ]
    },
    neusoft: {
      approach: "innovative Chinese technology and cost leadership",
      strengths: "advanced technology at competitive prices",
      service_coverage: "Strong presence in Asia with expanding global reach",
      service_strength: "responsive local support and competitive pricing",
      pricing_position: "Aggressive pricing with strong value proposition",
      imaging_strength: "innovative features at accessible prices",
      service_advantage: "competitive service pricing and local expertise",
      recommendations: [
        "You want advanced technology at competitive prices",
        "Cost-effectiveness is a primary decision factor",
        "You're comfortable with emerging global brands"
      ]
    }
  };

  // 类别特定内容
  private static categoryContent = {
    ct: {
      focus_areas: [
        "Slice count and detector technology",
        "Dose reduction capabilities", 
        "Cardiac and trauma imaging",
        "Workflow and throughput"
      ],
      equipment_type: "CT Scanners"
    },
    mri: {
      focus_areas: [
        "Field strength and magnet technology",
        "Sequence capabilities and speed",
        "Patient comfort and accessibility", 
        "Advanced imaging applications"
      ],
      equipment_type: "MRI Systems"
    }
  };

  // 生成动态对比内容
  static generateComparisonContent(
    brandASlug: string,
    brandBSlug: string,
    brandAData: BrandData,
    brandBData: BrandData,
    category: string = 'general'
  ): {
    title: string;
    description: string;
    content: string;
    seo: {
      title: string;
      description: string;
      keywords: string;
    };
    faqs: Array<{ question: string; answer: string }>;
  } {
    
    const brandAChar: Partial<BrandCharacteristics> | undefined = this.brandCharacteristics[brandASlug as keyof typeof this.brandCharacteristics];
    const brandBChar: Partial<BrandCharacteristics> | undefined = this.brandCharacteristics[brandBSlug as keyof typeof this.brandCharacteristics];
    const categoryInfo: CategoryInfo | undefined = this.categoryContent[category as keyof typeof this.categoryContent];
    
    // 如果没有品牌特征数据，使用默认值
    const brandAName = brandAData?.name || brandASlug;
    const brandBName = brandBData?.name || brandBSlug;
    
    // 生成标题和描述
    const title = `${brandAName} vs ${brandBName}${categoryInfo ? ` ${categoryInfo.equipment_type}` : ''}: Complete Comparison`;
    const description = `Compare ${brandAName} and ${brandBName}${categoryInfo ? ` ${categoryInfo.equipment_type.toLowerCase()}` : ' medical equipment'} side-by-side. Detailed analysis of specifications, pricing, and performance.`;
    
    // 生成主要内容
    const content = this.generateMainContent(brandAName, brandBName, brandAChar, brandBChar, brandAData, brandBData, categoryInfo);
    
    // 生成SEO数据
    const seo = {
      title: `${brandAName} vs ${brandBName}${categoryInfo ? ` ${categoryInfo.equipment_type}` : ''}: Which Should You Choose? [2024]`,
      description: `Compare ${brandAName} and ${brandBName}${categoryInfo ? ` ${categoryInfo.equipment_type.toLowerCase()}` : ' equipment'} including specs, pricing, reliability, and service to help you choose the right brand.`,
      keywords: `${brandAName} vs ${brandBName}, ${brandAName} ${brandBName} comparison,${categoryInfo ? ` ${category} scanner brands,` : ''} medical imaging equipment comparison`
    };
    
    // 生成FAQ
    const faqs = this.generateFAQs(brandAName, brandBName, brandAChar, brandBChar, categoryInfo);
    
    return {
      title,
      description,
      content,
      seo,
      faqs
    };
  }

  // 生成主要内容
  private static generateMainContent(
    brandAName: string,
    brandBName: string,
    brandAChar: Partial<BrandCharacteristics> | undefined,
    brandBChar: Partial<BrandCharacteristics> | undefined,
    brandAData: BrandData,
    brandBData: BrandData,
    categoryInfo: CategoryInfo | undefined
  ): string {
    
    return `
# ${brandAName} vs ${brandBName}${categoryInfo ? ` ${categoryInfo.equipment_type}` : ''}: The Ultimate Comparison

When selecting ${categoryInfo ? categoryInfo.equipment_type.toLowerCase() : 'medical imaging equipment'} for your healthcare facility, ${brandAName} and ${brandBName} represent two compelling options, each with distinct advantages and market positioning.

## Executive Summary

| Factor | ${brandAName} | ${brandBName} |
|--------|${'-'.repeat(brandAName.length)}|${'-'.repeat(brandBName.length)}|
| **Technology Approach** | ${brandAChar?.approach || 'Advanced technology solutions'} | ${brandBChar?.approach || 'Comprehensive healthcare solutions'} |
| **Key Strengths** | ${brandAChar?.strengths || 'Innovation and reliability'} | ${brandBChar?.strengths || 'Service and support'} |
| **Service Coverage** | ${brandAChar?.service_coverage || 'Global service network'} | ${brandBChar?.service_coverage || 'Extensive service coverage'} |
| **Pricing Position** | ${brandAChar?.pricing_position || 'Competitive pricing'} | ${brandBChar?.pricing_position || 'Value-focused pricing'} |

## Company Overview and Market Position

### ${brandAName}: ${brandAData?.country || 'Global'} Excellence

${brandAData?.description || `${brandAName} brings innovative technology and reliable performance to the medical imaging market.`}

**Key Highlights:**
- **Founded**: ${brandAData?.founded_year || 'Established medical technology company'}
- **Market Position**: ${brandAData?.market_share_ct || brandAData?.market_share_mri ? `${Math.max(brandAData.market_share_ct || 0, brandAData.market_share_mri || 0)}% market share` : 'Strong market presence'}
- **Global Reach**: ${brandAData?.country || 'International'} headquarters with worldwide operations

### ${brandBName}: ${brandBData?.country || 'Global'} Innovation

${brandBData?.description || `${brandBName} offers comprehensive healthcare solutions with focus on customer success.`}

**Key Highlights:**
- **Founded**: ${brandBData?.founded_year || 'Established medical technology company'}
- **Market Position**: ${brandBData?.market_share_ct || brandBData?.market_share_mri ? `${Math.max(brandBData.market_share_ct || 0, brandBData.market_share_mri || 0)}% market share` : 'Strong market presence'}
- **Global Reach**: ${brandBData?.country || 'International'} headquarters with worldwide operations

## Technology and Innovation Comparison

### ${brandAName} Technology Approach
${brandAName} focuses on ${brandAChar?.approach || 'innovative technology solutions'}, bringing ${brandAChar?.strengths || 'advanced capabilities'} to their ${categoryInfo ? categoryInfo.equipment_type.toLowerCase() : 'medical imaging solutions'}.

### ${brandBName} Technology Approach  
${brandBName} emphasizes ${brandBChar?.approach || 'comprehensive healthcare solutions'}, with particular strength in ${brandBChar?.strengths || 'service and support capabilities'}.

${categoryInfo ? `
## ${categoryInfo.equipment_type} Specific Considerations

When evaluating ${categoryInfo.equipment_type.toLowerCase()}, key factors include:

${categoryInfo.focus_areas.map((area: string) => `- **${area}**: Critical for optimal clinical performance`).join('\n')}
` : ''}

## Service and Support Analysis

### ${brandAName} Service Excellence
${brandAChar?.service_coverage || `${brandAName} provides comprehensive global service coverage`} with emphasis on ${brandAChar?.service_strength || 'technical excellence and customer support'}.

### ${brandBName} Service Leadership
${brandBChar?.service_coverage || `${brandBName} offers extensive service network coverage`} focusing on ${brandBChar?.service_strength || 'rapid response and customer satisfaction'}.

## Cost and Value Proposition

### ${brandAName} Pricing Strategy
${brandAChar?.pricing_position || `${brandAName} offers competitive pricing with focus on long-term value`}.

### ${brandBName} Pricing Strategy
${brandBChar?.pricing_position || `${brandBName} provides cost-effective solutions with flexible options`}.

## Expert Recommendations

### Choose ${brandAName} If:
${brandAChar?.recommendations ? brandAChar.recommendations.map((rec: string) => `- ${rec}`).join('\n') : `- You prioritize advanced technology and innovation
- Quality and performance are top priorities  
- You have budget for premium solutions`}

### Choose ${brandBName} If:
${brandBChar?.recommendations ? brandBChar.recommendations.map((rec: string) => `- ${rec}`).join('\n') : `- Cost-effectiveness is a primary concern
- Extensive service coverage is critical
- You prefer established market solutions`}

## Making Your Decision

The choice between ${brandAName} and ${brandBName} ultimately depends on your specific priorities:

1. **Clinical Requirements**: Assess your imaging needs and patient volume
2. **Budget Considerations**: Evaluate total cost of ownership over 5-7 years
3. **Service Needs**: Consider local service availability and response requirements
4. **Strategic Goals**: Align with your facility's long-term objectives

Both ${brandAName} and ${brandBName} offer excellent solutions - the key is selecting the brand that best matches your facility's unique requirements and priorities.

## Next Steps

1. **Request Demonstrations**: Schedule on-site or virtual demos from both vendors
2. **Reference Checks**: Contact similar facilities using each brand
3. **Financial Analysis**: Obtain detailed pricing and financing options
4. **Site Assessment**: Ensure infrastructure compatibility
5. **Staff Input**: Involve clinical and technical teams in the evaluation

*This comparison is based on publicly available information and industry analysis. Specific performance and pricing may vary based on configuration and negotiated terms.*
`;
  }

  // 生成FAQ
  private static generateFAQs(
    brandAName: string,
    brandBName: string,
    brandAChar: Partial<BrandCharacteristics> | undefined,
    brandBChar: Partial<BrandCharacteristics> | undefined,
    categoryInfo: CategoryInfo | undefined
  ): Array<{ question: string; answer: string }> {
    
    return [
      {
        question: `Which brand offers better image quality: ${brandAName} or ${brandBName}?`,
        answer: `Both ${brandAName} and ${brandBName} offer excellent image quality, but with different strengths. ${brandAName} typically excels in ${brandAChar?.imaging_strength || 'advanced imaging capabilities'}, while ${brandBName} leads in ${brandBChar?.imaging_strength || 'reliable imaging performance'}. The choice depends on your specific clinical applications and requirements.`
      },
      {
        question: `What are the main cost differences between ${brandAName} and ${brandBName}?`,
        answer: `Cost differences vary by model and configuration. ${brandAChar?.pricing_position?.includes('Premium') ? brandAName : brandBName} typically has higher upfront costs but may offer better long-term value. ${brandBChar?.pricing_position?.includes('Competitive') ? brandBName : brandAName} generally provides more competitive initial pricing. Consider total cost of ownership over 5-7 years including service, maintenance, and upgrades.`
      },
      {
        question: `Which brand has better service support?`,
        answer: `Service quality depends on your location and specific needs. ${brandAName} offers ${brandAChar?.service_advantage || 'comprehensive service support'}, while ${brandBName} provides ${brandBChar?.service_advantage || 'extensive service coverage'}. Both maintain professional service networks globally, but coverage and response times may vary by region.`
      },
      {
        question: `How do I choose between these brands?`,
        answer: `Consider these key factors: 1) Your clinical requirements and patient volume, 2) Budget and financing options, 3) Local service availability and response times, 4) Staff training needs and preferences, 5) Long-term strategic goals and upgrade plans. We recommend requesting demos from both vendors and speaking with current users in similar facilities.`
      },
      {
        question: `Are there significant differences in training requirements?`,
        answer: `Both brands provide comprehensive training programs, but approaches may differ. ${brandAName} focuses on ${brandAChar?.service_strength || 'technical training and support'}, while ${brandBName} emphasizes ${brandBChar?.service_strength || 'user-friendly operation and workflow training'}. Training duration and complexity depend on your staff's experience and the specific system configuration.`
      }
    ];
  }

  // 生成动态SEO元数据
  static generateSEOMetadata(
    brandAName: string,
    brandBName: string,
    category?: string
  ) {
    const categoryText = category ? ` ${category.toUpperCase()}` : '';
    const equipmentType = category === 'ct' ? 'CT Scanners' : category === 'mri' ? 'MRI Systems' : 'Medical Equipment';
    
    return {
      title: `${brandAName} vs ${brandBName}${categoryText}: Which Should You Choose? [2024]`,
      description: `Compare ${brandAName} and ${brandBName}${categoryText.toLowerCase()} equipment including specs, pricing, reliability, and service to help you choose the right brand for your facility.`,
      keywords: `${brandAName} vs ${brandBName}, ${brandAName} ${brandBName} comparison,${category ? ` ${category} scanner brands,` : ''} medical imaging equipment comparison, ${equipmentType.toLowerCase()} comparison`,
      canonical: `/compare/${brandAName.toLowerCase().replace(/\s+/g, '-')}/${brandBName.toLowerCase().replace(/\s+/g, '-')}${category ? `/${category}` : ''}`
    };
  }
}

export default DynamicContentGenerator;
