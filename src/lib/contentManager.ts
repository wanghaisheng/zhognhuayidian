// 内容管理系统 - 支持Markdown和多语言
import { marked } from 'marked';
import i18n from './i18n';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  language: 'zh' | 'en';
  category: string;
  tags: string[];
  slug: string;
  publishedAt: Date;
  updatedAt: Date;
  meta?: {
    description?: string;
    keywords?: string[];
    author?: string;
  };
}

interface ContentConfig {
  supportedLanguages: string[];
  defaultLanguage: string;
  markdownOptions: Record<string, unknown>;
}

class ContentManager {
  private config: ContentConfig;
  private contentCache: Map<string, ContentItem[]> = new Map();

  constructor() {
    this.config = {
      supportedLanguages: ['zh', 'en'],
      defaultLanguage: 'zh',
      markdownOptions: {
        breaks: true,
        gfm: true,
        highlight: (code, lang) => {
          // 简单的代码高亮
          return `<pre><code class="language-${lang}">${code}</code></pre>`;
        }
      }
    };

    marked.setOptions(this.config.markdownOptions);
  }

  // Markdown内容处理
  async processMarkdown(content: string): Promise<string> {
    try {
      return await marked.parse(content);
    } catch (error) {
      console.error(i18n.t('common.errorMessages.markdownProcess'), error);
      return content;
    }
  }

  // 多语言内容管理
  private getContentKey(category: string, language: string): string {
    return `${category}-${language}`;
  }

  // 获取内容
  getContent(category: string, language: string = 'zh'): ContentItem[] {
    const key = this.getContentKey(category, language);
    return this.contentCache.get(key) || [];
  }

  // 添加内容
  addContent(item: ContentItem): void {
    const key = this.getContentKey(item.category, item.language);
    const existingContent = this.contentCache.get(key) || [];
    
    // 检查是否已存在
    const existingIndex = existingContent.findIndex(c => c.id === item.id);
    if (existingIndex >= 0) {
      existingContent[existingIndex] = item;
    } else {
      existingContent.push(item);
    }
    
    this.contentCache.set(key, existingContent);
  }

  // 批量添加内容
  addBulkContent(items: ContentItem[]): void {
    items.forEach(item => this.addContent(item));
  }

  // 删除内容
  removeContent(id: string, category: string, language: string): void {
    const key = this.getContentKey(category, language);
    const existingContent = this.contentCache.get(key) || [];
    const filteredContent = existingContent.filter(c => c.id !== id);
    this.contentCache.set(key, filteredContent);
  }

  // 获取单个内容项
  getContentById(id: string, category: string, language: string = 'zh'): ContentItem | undefined {
    const content = this.getContent(category, language);
    return content.find(c => c.id === id);
  }

  // 按slug获取内容
  getContentBySlug(slug: string, category: string, language: string = 'zh'): ContentItem | undefined {
    const content = this.getContent(category, language);
    return content.find(c => c.slug === slug);
  }

  // 搜索内容
  searchContent(query: string, category?: string, language: string = 'zh'): ContentItem[] {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return [];
    }
    const lowerQuery = query.toLowerCase();
    let allContent: ContentItem[] = [];

    if (category) {
      allContent = this.getContent(category, language);
    } else {
      // 搜索所有分类
      this.contentCache.forEach((content, key) => {
        if (key.endsWith(`-${language}`)) {
          allContent.push(...content);
        }
      });
    }

    return allContent.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) ||
      item.content.toLowerCase().includes(lowerQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // 获取相关内容
  getRelatedContent(id: string, category: string, language: string = 'zh', limit: number = 5): ContentItem[] {
    const currentItem = this.getContentById(id, category, language);
    if (!currentItem) return [];

    const content = this.getContent(category, language);
    
    // 基于标签的相关性计算
    return content
      .filter(item => item.id !== id)
      .map(item => {
        const commonTags = item.tags.filter(tag => currentItem.tags.includes(tag));
        return {
          item,
          score: commonTags.length
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ item }) => item);
  }

  // 获取热门内容
  getPopularContent(category: string, language: string = 'zh', limit: number = 10): ContentItem[] {
    const content = this.getContent(category, language);
    // 这里可以基于阅读量、点赞数等排序，目前按发布时间排序
    return content
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, limit);
  }

  // 获取最新内容
  getLatestContent(category?: string, language: string = 'zh', limit: number = 10): ContentItem[] {
    let allContent: ContentItem[] = [];

    if (category) {
      allContent = this.getContent(category, language);
    } else {
      this.contentCache.forEach((content, key) => {
        if (key.endsWith(`-${language}`)) {
          allContent.push(...content);
        }
      });
    }

    return allContent
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, limit);
  }

  // 获取内容统计
  getContentStats(language: string = 'zh') {
    const stats = {
      totalContent: 0,
      categories: new Map<string, number>(),
      tags: new Map<string, number>(),
      monthlyCount: new Map<string, number>()
    };

    this.contentCache.forEach((content, key) => {
      if (key.endsWith(`-${language}`)) {
        const category = key.replace(`-${language}`, '');
        stats.totalContent += content.length;
        stats.categories.set(category, content.length);

        content.forEach(item => {
          // 统计标签
          item.tags.forEach(tag => {
            stats.tags.set(tag, (stats.tags.get(tag) || 0) + 1);
          });

          // 统计月度发布量
          const monthKey = `${item.publishedAt.getFullYear()}-${item.publishedAt.getMonth() + 1}`;
          stats.monthlyCount.set(monthKey, (stats.monthlyCount.get(monthKey) || 0) + 1);
        });
      }
    });

    return stats;
  }

  // 导出内容为JSON
  exportContent(category?: string, language?: string): string {
    const exportData: { [key: string]: ContentItem[] } = {};

    this.contentCache.forEach((content, key) => {
      const [cat, lang] = key.split('-');
      if ((!category || cat === category) && (!language || lang === language)) {
        exportData[key] = content;
      }
    });

    return JSON.stringify(exportData, null, 2);
  }

  // 导入内容
  importContent(jsonData: string): { success: boolean; imported: number; errors: string[] } {
    const errors: string[] = [];
    let imported = 0;

    try {
      const data = JSON.parse(jsonData);
      
      Object.entries(data).forEach(([key, content]) => {
        if (Array.isArray(content)) {
          content.forEach((item: unknown) => {
            try {
              const typedItem = item as ContentItem;
              const contentItem: ContentItem = {
                ...typedItem,
                publishedAt: new Date(typedItem.publishedAt),
                updatedAt: new Date(typedItem.updatedAt)
              };
              this.addContent(contentItem);
              imported++;
            } catch (error) {
              errors.push(i18n.t('common.errorMessages.importItemFailed', { error }));
            }
          });
        }
      });

      return { success: errors.length === 0, imported, errors };
    } catch (error) {
      return { success: false, imported: 0, errors: [i18n.t('common.errorMessages.jsonParseFailed', { error })] };
    }
  }

  // 清理缓存
  clearCache(): void {
    this.contentCache.clear();
  }

  // 获取支持的语言
  getSupportedLanguages(): string[] {
    return this.config.supportedLanguages;
  }

  // 获取默认语言
  getDefaultLanguage(): string {
    return this.config.defaultLanguage;
  }
}

// 导出单例实例
export const contentManager = new ContentManager();

// 初始化所有内容
const initializeContent = () => {
  const allContent: ContentItem[] = [
    // CT发展历史 - 中文
    {
      id: 'ct-history-zh',
      title: 'CT扫描仪发展史',
      content: `# CT扫描仪发展史

## 早期发展（1972-1980）

1972年，英国电子工程师Godfrey Hounsfield发明了第一台CT扫描仪，这是医学影像技术的重大突破。

## 技术演进

### 第一代CT（1972-1974）
- 单一X射线源和探测器
- 扫描时间长达4-5分钟

### 第二代CT（1974-1976）
- 多个探测器阵列
- 扫描时间缩短至20-60秒

### 第三代CT（1976-1980）
- 扇形X射线束
- 360度旋转扫描
- 扫描时间进一步缩短

## 现代发展

### 螺旋CT（1989）
- 连续扫描技术
- 三维成像能力

### 多层螺旋CT（1998）
- 多排探测器
- 更快的扫描速度
- 更高的图像质量`,
      language: 'zh',
      category: 'history',
      tags: ['CT扫描仪', '医疗历史', '技术发展'],
      slug: 'ct-scanner-history',
      publishedAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      meta: {
        description: 'CT扫描仪从1972年发明至今的发展历程',
        keywords: ['CT扫描仪', '医疗历史', 'Godfrey Hounsfield'],
        author: '医疗技术专家'
      }
    },
    
    // CT发展时间线 - 英文
    {
      id: 'ct-timeline-en',
      title: 'Comprehensive Timeline of CT Development',
      content: `# Comprehensive Timeline of Computed Tomography (CT) Development

## Pre-CT Era: Early Developments in X-ray and Medical Imaging (1895 - 1970)

### 1895: Discovery of X-rays
Wilhelm Conrad Roentgen discovers X-rays, which will later form the foundation of CT imaging. Early X-ray technology begins to be used by hospitals, mainly through companies like **General Electric (GE)** and **Siemens**.

### Early 20th Century: Widespread Adoption of X-ray Technology
X-ray machines become common in medical settings, developed and distributed by companies like **Siemens**, **GE**, and **Philips**.

## 1970s: The Birth of Computed Tomography

### 1971: Sir Godfrey Hounsfield's Conceptualization of CT
**EMI Laboratories** and **Sir Godfrey Hounsfield** propose the revolutionary concept of CT imaging, where X-rays and advanced computer algorithms combine to produce cross-sectional images.

### 1972: First Successful Brain CT Scan
The first brain scan is successfully performed using the EMI-Scanner, developed by **EMI Laboratories**, marking a critical breakthrough in medical imaging.

### 1973: Commercial Release of EMI-Scanner
**EMI** launches the first commercial CT scanner, which is initially used to study brain conditions and injuries.

### 1979: Nobel Prize in Physiology or Medicine
**Sir Godfrey Hounsfield** and **Dr. Allan Cormack** receive the Nobel Prize for their contributions to the development of CT.

## 1980s: Early Advancements and Widespread Adoption

### 1980s: Expansion of CT into Clinical Applications
**Siemens** and **GE Healthcare** lead the charge in advancing CT technology, applying it in a wide variety of clinical settings.

### 1983: First 3D Reconstruction with CT
The first successful 3D reconstruction using CT is developed by **GE Healthcare**.

## 1990s: Introduction of Spiral and Multislice CT

### 1991: Introduction of Spiral (Helical) CT
**Siemens** introduces spiral CT scanning, which involves continuous rotation of the CT scanner around the body.

### 1998: Multislice CT (MDCT) Developed
**GE Healthcare** and **Siemens** launch the Multislice CT, which greatly improves the resolution of CT scans.

## 2000s: Advancements in Cardiac Imaging and Low-Dose Technology

### 2000: Cardiac CT Imaging Developed
**GE Healthcare** and **Siemens** develop CT scanners designed specifically for imaging the heart.

### 2002: Dual-Energy CT Introduced
**Philips** introduces dual-energy CT, allowing for superior tissue differentiation.

## 2010s: AI Integration and Ultra-Low Radiation CT

### 2010: AI-Based Imaging Solutions Begin
**GE Healthcare**, **Philips**, and **Siemens** start integrating artificial intelligence (AI) into CT imaging systems.

### 2012: Low-Dose CT Technology
**GE Healthcare** and **Siemens** launch CT systems that minimize radiation exposure.

### 2014: Photon-Counting CT Detectors
**Siemens** introduces photon-counting CT detectors, which provide higher-resolution images.

## 2020s: Continued Technological Innovation

### 2020: Role of CT in COVID-19 Diagnosis
**Philips** and **Siemens Healthineers** develop CT protocols specifically for diagnosing COVID-19.

### 2021: Further Expansion of AI in CT Diagnostics
AI continues to play a significant role in CT imaging, as major manufacturers enhance AI algorithms.`,
      language: 'en',
      category: 'history',
      tags: ['CT Scanner', 'Medical History', 'Technology Development'],
      slug: 'ct-scanner-timeline',
      publishedAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
      meta: {
        description: 'Comprehensive timeline of CT scanner development from 1895 to present',
        keywords: ['CT Scanner', 'Medical History', 'Timeline', 'Hounsfield'],
        author: 'Medical Technology Historian'
      }
    },

    // 中国MRI发展时间线
    {
      id: 'mri-china-timeline-zh',
      title: '中国MRI发展时间线',
      content: `# 中国MRI发展时间线

## 早期探索阶段（1982-1990）

### 1982年：MRI发展计划启动
国家科委组织MRI技术发展研究项目，标志着中国MRI技术发展的开始。

### 1986年：深圳安科公司成立
在国家计委和国家科委的支持下，深圳安科公司成立，这是中国追求自主MRI发展的重要里程碑。

### 1987年：首台1500高斯永磁MRI
中国在安科公司成功开发首台1500高斯永磁MRI，这是通过精心设计和优化磁场均匀性、梯度线圈和成像软件的结果。

### 1988年：ASP-015永磁MRI系统
安科公司推出ASP-015永磁MRI系统，能够拍摄清晰的人体头部图像。这是一个里程碑式的成就，标志着中国在低场永磁MRI研究领域能力的开始。

## 技术突破阶段（1990-2005）

### 1992年：首台超导MRI（0.6T）
安科公司开发中国首台0.6T超导MRI系统。该系统提供了更清晰的内部图像，特别有利于重大疾病的早期检测。

## 快速发展阶段（2005-2020）

### 2005年：联影医疗成立
薛敏博士创立联影医疗，旨在推动中国医学影像技术的发展边界。这家公司后来成为先进MRI系统开发的重要参与者。

### 2007年：中国首台自主知识产权1.5T MRI
联影医疗推出Centauri 1.5T，这是中国首台具有自主知识产权的1.5T MRI系统。这一发展打破了外国品牌在高场MRI领域的垄断。

### 2008年：进入美国市场
联影医疗开发的Centauri 1.5T成为首台进入美国市场的中国制造MRI系统。这是一个重大突破，展示了中国在高场MRI技术方面不断增长的能力。

### 2015年：71cm大孔径1.5T MRI
联影医疗推出71cm大孔径1.5T MRI，获得FDA批准。该产品具有先进的数字采集和传输技术，满足更广泛的患者群体需求。

### 2019年：ASTA 1.5T MRI系统
ASTA 1.5T MRI系统推出，具有增强功能，如实时、无损数据传输和更高的图像清晰度，推动快速成像技术的边界。

## 技术领先阶段（2020至今）

### 2020年：世界首台75cm大孔径3.0T MRI
联影医疗推出uMR Omega，世界首台75cm大孔径3.0T MRI，适应更大的患者和患有幽闭恐惧症的患者，在以患者为中心的MRI设计方面树立了新标准。

### 2021年：世界首台全身5.0T MRI
uMR Jupiter作为世界首台全身5.0T MRI推出，能够在整个身体进行超高场成像，标志着MRI技术的新时代。`,
      language: 'zh',
      category: 'history',
      tags: ['MRI', '中国发展', '联影医疗', '安科医疗'],
      slug: 'mri-china-development',
      publishedAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25'),
      meta: {
        description: '中国MRI技术从1982年至今的发展历程',
        keywords: ['MRI', '中国医疗技术', '联影医疗', '医疗设备发展'],
        author: '医疗技术专家'
      }
    },

    // 第一台CT扫描仪的故事
    {
      id: 'first-ct-scanner-story',
      title: 'The Revolutionary CT Scanner: A Comprehensive History',
      content: `# The Revolutionary CT Scanner: A Comprehensive History

## The Genesis of an Idea: Origins and Development

Computed Tomography (CT) scanning represents a paradigm shift from traditional X-ray imaging. Sir Godfrey Hounsfield, an engineer at EMI Central Research Laboratories in Hayes, UK, is widely credited as the principal inventor of the first practical CT scanner.

Hounsfield's inspiration came from a seemingly simple question during a country walk: how to determine the contents of a closed box without opening it. This led him to envision using X-rays projected from multiple angles to create comprehensive representations of internal structures.

### Development Process

The development process was rigorous, involving extensive experimentation with:
- Small pigs
- Human vertebrae  
- Preserved human brains in formalin
- Fresh kosher cow brains

Hounsfield's formal work began in 1967. By 1971, the scanner utilized 160 parallel readings through 180 angles, each separated by 1°. Initial scan time exceeded 5 minutes, with image processing requiring an additional 2.5 hours.

## The First Human Scan: October 1, 1971

The first clinical CT scan was performed at Atkins Morley Hospital in Wimbledon, London. The patient was a woman with a suspected brain tumor. The scan revealed a cystic mass about the size of a plum on the left frontal lobe, providing unprecedented detail impossible to obtain non-invasively.

The results were published on April 20, 1972, immediately triggering a sensation within the medical community. This marked the widespread adoption of computed tomography.

## William H. Oldendorf: An Unsung Hero

While Hounsfield is celebrated for the first clinically utilized CT machine, William H. Oldendorf, a neurologist at UCLA, independently conceived tomographic imaging in 1959. He filed a patent in 1961 for a "radiant energy apparatus for investigating selected areas of interior objects." Despite his early success, his prototype failed to attract commercial interest.

## From Prototype to Clinic: Commercialization

The EMI-Scanner Mark I was installed at the Mayo Clinic in 1973, marking the widespread clinical use of CT technology. By 1975, Hounsfield introduced the first whole-body scanner, significantly broadening CT applications beyond brain imaging.

Companies like General Electric and Siemens soon developed enhanced, full-body scanners, driving rapid innovation in the CT market.

## Recognition and Legacy

Hounsfield's contribution was officially recognized in 1979 when he was awarded the Nobel Prize in Physiology or Medicine, shared with Allan MacLeod Cormack. The core principles that Hounsfield pioneered continue to be employed in CT scanners today.`,
      language: 'en',
      category: 'history',
      tags: ['CT Scanner', 'Godfrey Hounsfield', 'Medical Innovation', 'EMI'],
      slug: 'first-ct-scanner-story',
      publishedAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
      meta: {
        description: 'The complete story of the first CT scanner invention by Sir Godfrey Hounsfield',
        keywords: ['CT Scanner History', 'Godfrey Hounsfield', 'Medical Imaging', 'EMI Scanner'],
        author: 'Medical Technology Historian & Imaging Expert'
      }
    },

    // 进口指南
    {
      id: 'import-guide-zh',
      title: '如何从中国进口CT和MRI扫描仪',
      content: `# 如何从中国进口CT和MRI扫描仪

从中国进口CT和MRI扫描仪可能看起来令人生畏，但有了明确的计划，这可以是一个直接的过程。以下是逐步指南：

## 进口步骤指南

### 1. 确定您的需求
确定您需要的特定扫描仪类型，包括型号、功能和技术规格。

### 2. 寻找制造商
探索提供您需要的CT或MRI扫描仪特定类型的信誉良好的中国制造商。检查他们的认证、生产能力和客户评价。

### 3. 申请报价
向不同制造商申请详细价格报价。报价必须包括产品信息、条款和条件以及运输成本。

### 4. 安排访问（可选）
如果可能，考虑访问制造商的设施亲自审查操作。

### 5. 检查合规性和认证
确保设备具有您的国家要求的所有必要质量认证（例如ISO、FDA、CE）。

### 6. 谈判并敲定合同
在签署任何合同之前，就价格、付款条件、保修和交付条件达成一致。

### 7. 确保付款方式
选择可靠和安全的付款方式，如信用证。

### 8. 安排运输
与制造商和货运代理协调管理物流。

### 9. 进口和海关清关
验证所有必要的海关申报、进口许可证和清关程序是否完整。

### 10. 安装和调试
安排认证技术人员进行设备的安装和调试。

## 了解法规

导航监管环境是进口医疗设备的重要方面。考虑以下事项：

### 医疗器械法规
您的国家将有自己的医疗设备进口法规。确保了解所有这些法规。

### 进口许可证
检查是否需要任何许可证来进口您的医疗设备。

### 海关关税和税收
检查设备是否需要缴纳进口税。

### 文档
所有文件必须正确填写和提交。确保您有正确的进口许可证、原产地认证和其他必需文件。

## 进口最佳实践

以下是与海外制造商开展业务的良好实践：

### 尽职调查
做好功课，检查您正在与合法公司合作。

### 清晰沟通
在所有沟通中始终保持清晰，以确保透明的过程。

### 质量控制
确保您了解质量控制标准。

### 寻求建议
在达成任何交易之前，考虑咨询专门从事进口和国际贸易的专业人士。`,
      language: 'zh',
      category: 'guide',
      tags: ['进口指南', 'CT扫描仪', 'MRI', '采购'],
      slug: 'import-guide-china',
      publishedAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10'),
      meta: {
        description: '从中国进口CT和MRI扫描仪的详细指南',
        keywords: ['进口CT', '进口MRI', '中国医疗设备', '采购指南'],
        author: '国际贸易专家'
      }
    },

    // 国产CT市场竞争分析
    {
      id: 'domestic-ct-market-analysis',
      title: '国产CT市场竞争：联影、东软、明峰的较量',
      content: `# 国产CT市场竞争：联影、东软、明峰的较量

## 概述：新独角兽即将上市

2022年6月29日，上海证券交易所网站更新显示，明峰医疗申请在科创板上市已被受理。成立11年后，这家领先的国产CT制造商进入了重大变革阶段。

根据明峰医疗的IPO招股说明书（草案），公司计划发行不超过1.5亿股，占发行后总股本的10%至18.58%。所有发行股份均为新股，不包括现有股东的公开发售。海通证券担任保荐机构。

募集资金将分配给以下项目：
- 高端医学影像设备产业化项目（约2.65亿元）
- 研发中心建设（约1.59亿元）
- 流动资金补充（约2亿元）

## 财务表现：销售增长但持续亏损

明峰医疗的CT产品销售在过去三年中显示出持续增长。2019年、2020年和2021年CT产品收入分别为21亿元、30亿元和35亿元，复合年增长率(CAGR)为28.96%。2021年，公司在中国CT销量方面排名第6，市场份额为4.3%，成为第三大国产厂商。

然而，从2019年到2021年，明峰的收入分别为21.1亿元、30亿元和35.2亿元，同期净利润为负：-2.13亿元、-2.31亿元和-2.07亿元。截至2021年12月31日，累计留存收益为-14.3亿元。

## 市场格局：国产巨头的激烈竞争

明峰的CT业务仍然是其主要收入驱动力，2021年贡献了超过80%的总收入。然而，它在国内市场面临激烈竞争。

### 主要竞争对手

#### 联影医疗
成立于2011年，联影医疗迅速成为中国医学影像市场的主导者，提供CT、MRI、PET/CT、DR和医疗云服务产品。2021年，联影医疗报告收入72.5亿元，其CT产品占总销售额的34.21%。

#### 东软医疗
成立于1998年，东软医疗是CT、MRI、DR和超声领域的关键参与者。2020年，东软产生24.6亿元收入，CT贡献了其总销售额的52.6%。

#### 迈瑞医疗
成立于1999年，迈瑞专注于生命支持、体外诊断和医学影像。其影像部门在2021年产生54.3亿元收入。

## 未来展望：高端医疗设备市场竞争

医学影像设备市场，特别是CT部门，竞争激烈且资本密集。2021年，全球CT市场价值约146亿美元，预计到2030年将达到242亿美元，复合年增长率为5.8%。

随着AI集成和光子计数CT技术的快速发展，明峰及其竞争对手正在竞相升级其产品和服务，旨在在竞争激烈的医学影像市场中保持领先地位。`,
      language: 'zh',
      category: 'analysis',
      tags: ['市场分析', 'CT市场', '联影医疗', '东软医疗', '明峰医疗'],
      slug: 'domestic-ct-market-competition',
      publishedAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-02-15'),
      meta: {
        description: '中国国产CT市场主要厂商竞争分析',
        keywords: ['CT市场', '联影医疗', '东软医疗', '明峰医疗', '市场竞争'],
        author: '医疗行业分析师'
      }
    }
  ];

  allContent.forEach(item => contentManager.addContent(item));
};

// 初始化内容
initializeContent();

export default contentManager;
