// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.356Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🌏 开始生成中文书籍数据文件...\n');

// 获取英文数据目录和中文数据目录
const enDir = path.join(__dirname, '../src/data/snapshots/en/content/ancient-books');
const zhDir = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books');

// 确保中文目录存在
if (!fs.existsSync(zhDir)) {
  fs.mkdirSync(zhDir, { recursive: true });
}

// 获取需要生成中文版本的书籍列表
const enBooks = fs.readdirSync(enDir)
  .filter(file => file.endsWith('.json') && file !== 'collection.json')
  .map(file => file.replace('.json', ''));

const existingZhBooks = fs.existsSync(zhDir)
  ? fs.readdirSync(zhDir)
    .filter(file => file.endsWith('.json') && file !== 'collection.json')
    .map(file => file.replace('.json', ''))
  : [];

const missingZhBooks = enBooks.filter(bookId => !existingZhBooks.includes(bookId));

console.log(`📚 英文书籍总数: ${enBooks.length}`);
console.log(`📚 已有中文书籍数: ${existingZhBooks.length}`);
console.log(`📚 需要生成的中文书籍数: ${missingZhBooks.length}`);
console.log('');

// 中文翻译映射
const translations = {
  // 书籍标题翻译
  titles: {
    'bencao-gangmu': '本草纲目',
    'jiayi-jing': '甲乙经',
    'jinkui-yaolue': '金匮要略',
    'mai-jing': '脉经',
    'qianjin-fang': '千金要方',
    'shanghan-lun': '伤寒论',
    'shanghan-zabing-lun': '伤寒杂病论',
    'wenzhen-xue': '温病条辨',
    'yixue-rumen': '医学入门'
  },
  
  // 朝代翻译
  dynasties: {
    'Pre-Qin': '先秦',
    'Eastern Han': '东汉',
    'Three Kingdoms': '三国',
    'Western Jin': '西晋',
    'Tang': '唐代',
    'Song': '宋代',
    'Ming': '明代',
    'Qing': '清代'
  },
  
  // 作者翻译
  authors: {
    'Anonymous': '佚名',
    'Zhang Zhongjing': '张仲景',
    'Huangfu Mi': '皇甫谧',
    'Wang Shuhe': '王叔和',
    'Sun Simiao': '孙思邈',
    'Zhang Zhongjing': '张仲景',
    'Ye Tianshi': '叶天士',
    'Li Ting': '李梴'
  },
  
  // 分类翻译
  categories: {
    'medical-classics': '医经',
    'materia-medica': '本草',
    'shanghan': '伤寒金匮',
    'jinkui': '伤寒金匮',
    'acupuncture': '针灸',
    'prescriptions': '方剂',
    'clinical-medicine': '临床医学',
    'basic-theory': '基础理论',
    'wenzhen': '温病'
  },
  
  // 标签翻译
  tags: {
    'Medical Classic': '医经',
    'Basic Theory': '基础理论',
    'Yellow Emperor': '黄帝',
    'Yin-Yang': '阴阳',
    'Five Elements': '五行',
    'Cold Damage': '伤寒',
    'Miscellaneous Diseases': '杂病',
    'Syndrome Differentiation': '辨证论治',
    'Zhang Zhongjing': '张仲景',
    'Eastern Han Medicine': '东汉医学',
    'Materia Medica': '本草',
    'Herbal Medicine': '草药医学',
    'Li Shizhen': '李时珍',
    'Ming Dynasty Medicine': '明代医学',
    'Pharmacology': '药理学',
    'Acupuncture': '针灸',
    'Moxibustion': '艾灸',
    'Huangfu Mi': '皇甫谧',
    'Three Kingdoms Medicine': '三国医学',
    'Pulse Diagnosis': '脉诊',
    'Wang Shuhe': '王叔和',
    'Western Jin Medicine': '西晋医学',
    'Prescriptions': '方剂',
    'Clinical Medicine': '临床医学',
    'Sun Simiao': '孙思邈',
    'Tang Dynasty Medicine': '唐代医学',
    'Medical Encyclopedia': '医学百科全书',
    'Warm Diseases': '温病',
    'Febrile Diseases': '热病',
    'Seasonal Diseases': '季节性疾病',
    'Ye Tianshi': '叶天士',
    'Qing Dynasty Medicine': '清代医学',
    'Medical Education': '医学教育',
    'Li Ting': '李梴',
    'Ming Dynasty Medicine': '明代医学'
  }
};

// 生成中文书籍数据
missingZhBooks.forEach(bookId => {
  console.log(`🔧 生成中文书籍: ${bookId}`);
  
  try {
    // 读取英文数据
    const enFilePath = path.join(enDir, `${bookId}.json`);
    const enData = JSON.parse(fs.readFileSync(enFilePath, 'utf8'));
    
    // 创建中文数据结构
    const zhData = {
      labels: {
        title: translations.titles[bookId] || bookId,
        description: `${translations.titles[bookId]}中医古籍`
      },
      content: {
        id: bookId,
        title: {
          zh: translations.titles[bookId] || bookId,
          en: enData.content?.title?.en || bookId
        },
        dynasty: translations.dynasties[enData.content?.dynasty] || enData.content?.dynasty,
        author: translations.authors[enData.content?.author] || enData.content?.author,
        category: translations.categories[enData.content?.category] || enData.content?.category,
        year: enData.content?.year || '',
        metadata: {
          dynasty: translations.dynasties[enData.content?.metadata?.dynasty] || enData.content?.metadata?.dynasty,
          author: translations.authors[enData.content?.metadata?.author] || enData.content?.metadata?.author,
          chapters: enData.content?.metadata?.chapters || 0,
          wordCount: enData.content?.metadata?.wordCount || 0,
          publishYear: enData.content?.metadata?.publishYear || '',
          tags: (enData.content?.metadata?.tags || []).map(tag => translations.tags[tag] || tag),
          coverImage: enData.content?.metadata?.coverImage || '',
          difficulty: enData.content?.metadata?.difficulty || '',
          influence: enData.content?.metadata?.influence || '',
          preservation: enData.content?.metadata?.preservation || ''
        },
        chapters: (enData.content?.chapters || []).map(chapter => ({
          id: chapter.id,
          title: {
            zh: chapter.title?.zh || chapter.title?.en || chapter.id,
            en: chapter.title?.en || chapter.id
          },
          order: chapter.order || 0,
          summary: chapter.summary || '',
          sections: (chapter.sections || []).map(section => ({
            id: section.id,
            title: section.title || '',
            order: section.order || 0,
            originalText: section.originalText || '',
            translation: section.translation || '',
            interpretation: section.interpretation || '',
            keyConcepts: section.keyConcepts || []
          }))
        })),
        relatedBooks: enData.content?.relatedBooks || [],
        readingTime: enData.content?.readingTime || {},
        studyNotes: enData.content?.studyNotes || {}
      },
      metrics: enData.metrics || {},
      updatedAt: new Date().toISOString(),
      metadata: enData.metadata || {}
    };
    
    // 写入中文文件
    const zhFilePath = path.join(zhDir, `${bookId}.json`);
    fs.writeFileSync(zhFilePath, JSON.stringify(zhData, null, 2), 'utf8');
    
    console.log(`  ✅ 已生成: ${zhFilePath}`);
    
  } catch (error) {
    console.error(`  ❌ 生成失败: ${error.message}`);
  }
});

console.log('\n🎉 中文书籍数据生成完成！');
console.log(`📊 总共生成了 ${missingZhBooks.length} 个中文书籍文件。`);
