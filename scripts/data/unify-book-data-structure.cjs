// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.391Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

// 获取所有书籍目录
const booksDir = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books');
const bookFiles = fs.readdirSync(booksDir).filter(file => file.endsWith('.json'));

console.log('🔄 统一中英文书籍数据结构为嵌套格式...\n');

let convertedBooks = 0;
let errorBooks = 0;

bookFiles.forEach(bookFile => {
  const bookId = bookFile.replace('.json', '');
  console.log(`📚 转换书籍: ${bookId}`);
  
  try {
    // 读取现有的扁平格式数据
    const filePath = path.join(booksDir, bookFile);
    const flatData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // 检查是否已经是嵌套格式
    if (flatData.content) {
      console.log(`  ✅ 已经是嵌套格式，跳过`);
      convertedBooks++;
      return;
    }
    
    // 转换为嵌套格式
    const nestedData = {
      labels: {
        title: flatData.title,
        description: `${flatData.title} - ${flatData.description || ''}`
      },
      content: {
        id: flatData.id,
        title: {
          zh: flatData.title,
          en: getEnglishTitle(flatData.title)
        },
        dynasty: flatData.dynasty,
        author: flatData.author,
        category: flatData.category,
        year: flatData.year,
        description: flatData.description,
        tags: flatData.tags,
        chapters: flatData.chapters || [],
        metadata: {
          dynasty: flatData.dynasty,
          author: flatData.author,
          chapters: flatData.chapters || 0,
          wordCount: flatData.characters || 0,
          publishYear: flatData.year,
          tags: flatData.tags || [],
          coverImage: flatData.coverImage || `/images/books/${bookId}-cover.jpg`,
          difficulty: flatData.difficulty || 'Medium',
          influence: flatData.influence || '',
          preservation: flatData.preservation || 'Good'
        },
        relatedBooks: getRelatedBooks(flatData.category, bookId),
        readingTime: {
          estimated: getEstimatedReadingTime(flatData.characters || 0),
          difficulty: flatData.difficulty || 'Medium',
          prerequisites: getPrerequisites(flatData.category)
        },
        studyNotes: {
          keyPoints: getKeyPoints(flatData),
          clinicalApplications: getClinicalApplications(flatData),
          historicalSignificance: getHistoricalSignificance(flatData)
        }
      },
      metrics: {
        totalChapters: flatData.chapters ? flatData.chapters.length : 0,
        totalWords: flatData.characters || 0,
        totalSections: flatData.chapters ? flatData.chapters.reduce((total, chapter) => {
          return total + (chapter.sections ? chapter.sections.length : 0);
        }, 0) : 0,
        relatedBooks: 4,
        keyConcepts: 89,
        readingTime: Math.round((flatData.characters || 0) / 100), // 假设每100字1分钟
        difficulty: getDifficultyLevel(flatData.difficulty || 'Medium')
      },
      updatedAt: new Date().toISOString(),
      metadata: {
        sourceFlags: ['db', 'markdown', 'seed'],
        version: '1.0.0',
        lastReviewed: new Date().toISOString()
      }
    };
    
    // 写回文件
    fs.writeFileSync(filePath, JSON.stringify(nestedData, null, 2), 'utf8');
    
    console.log(`  ✅ 转换完成: 扁平 → 嵌套`);
    convertedBooks++;
    
  } catch (error) {
    console.log(`  ❌ 转换失败: ${error.message}`);
    errorBooks++;
  }
  
  console.log('');
});

// 输出总结
console.log('📊 转换结果总结:');
console.log(`成功转换书籍数: ${convertedBooks}`);
console.log(`转换失败书籍数: ${errorBooks}`);
console.log(`总书籍数: ${bookFiles.length}`);

if (convertedBooks === bookFiles.length) {
  console.log('\n🎉 所有书籍的数据结构都已统一为嵌套格式！');
} else {
  console.log('\n⚠️  部分书籍转换失败，请检查错误信息。');
}

// 辅助函数
function getEnglishTitle(chineseTitle) {
  const titleMap = {
    '黄帝内经': 'Yellow Emperor\'s Inner Canon',
    '伤寒杂病论': 'Treatise on Cold Damage and Miscellaneous Diseases',
    '本草纲目': 'Compendium of Materia Medica',
    '千金要方': 'Thousand Golden Prescriptions',
    '脉经': 'The Pulse Classic',
    '甲乙经': 'A-B Classic of Acupuncture and Moxibustion',
    '伤寒论': 'Treatise on Cold Damage',
    '金匮要略': 'Essential Prescriptions of the Golden Cabinet',
    '温病条辨': 'Treatise on Warm-Febrile Diseases',
    '医学入门': 'Introduction to Medicine'
  };
  
  return titleMap[chineseTitle] || chineseTitle;
}

function getRelatedBooks(category, currentBookId) {
  const relatedBooksMap = {
    '医经': ['huangdi-neijing', 'nan-jing'],
    '诊法': ['mai-jing'],
    '本草': ['bencao-gangmu'],
    '方书': ['qianjin-fang'],
    '针灸': ['jiayi-jing'],
    '伤寒金匮': ['shanghan-lun', 'jinkui-yaolue'],
    '温病': ['wenzhen-xue'],
    '综合医书': ['yixue-rumen'],
    '临证各科': [],
    '养生食疗外治': [],
    '医论医案': [],
    '其他': []
  };
  
  return relatedBooksMap[category] || [];
}

function getEstimatedReadingTime(wordCount) {
  const minutes = Math.round(wordCount / 100);
  return `${minutes} hours`;
}

function getPrerequisites(category) {
  const prerequisitesMap = {
    '医经': ['Basic Chinese medicine theory', 'Understanding of yin-yang theory'],
    '诊法': ['Basic diagnostic methods', 'Pulse theory knowledge'],
    '本草': ['Basic knowledge of Chinese pharmacology', 'Understanding of drug properties'],
    '方书': ['Basic clinical medicine knowledge', 'Understanding of prescriptions'],
    '针灸': ['Basic acupuncture knowledge', 'Understanding of meridian theory'],
    '伤寒金匮': ['Understanding of six meridians theory', 'Cold damage knowledge'],
    '温病': ['Understanding of warm-disease theory', 'Four levels theory'],
    '综合医书': ['Basic medical knowledge'],
    '临证各科': ['Clinical medicine basics'],
    '养生食疗外治': ['Health preservation knowledge'],
    '医论医案': ['Medical theory basics'],
    '其他': ['General medical knowledge']
  };
  
  return prerequisitesMap[category] || ['Basic medical knowledge'];
}

function getKeyPoints(bookData) {
  const keyPointsMap = {
    '医经': ['奠定中医理论基础', '系统阐述阴阳五行', '创建脏腑经络理论'],
    '诊法': ['系统脉诊理论', '建立诊断标准', '脉象分类方法'],
    '本草': ['收录1892种药物', '系统药物分类', '详细药物制备'],
    '方书': ['收录5300+方剂', '系统方剂理论', '临床实践指导'],
    '针灸': ['收录349穴位', '系统针灸理论', '临床治疗应用'],
    '伤寒金匮': ['确立辨证论治', '创建六经体系', '临床治疗规范'],
    '温病': ['创立四层理论', '建立温病学派', '季节病治疗'],
    '综合医书': ['医学教育创新', '伦理实践整合', '系统知识组织'],
    '临证各科': ['专科系统化', '临床各科专著', '实践指导'],
    '养生食疗外治': ['养生理论', '食疗方法', '外治技术'],
    '医论医案': ['理论探讨', '医案记录', '学术交流'],
    '其他': ['医学知识', '实践经验', '技术方法']
  };
  
  return keyPointsMap[bookData.category] || ['医学知识', '实践经验'];
}

function getClinicalApplications(bookData) {
  const applicationsMap = {
    '医经': ['指导临床实践', '针灸理论基础', '中药应用基础'],
    '诊法': ['脉诊应用', '诊断方法', '临床指导'],
    '本草': ['中药应用', '药物制备', '药理研究'],
    '方书': ['方剂应用', '临床处方', '治疗指导'],
    '针灸': ['针灸治疗', '穴位应用', '临床技术'],
    '伤寒金匮': ['外感病治疗', '内伤病治疗', '辨证论治'],
    '温病': ['季节病治疗', '温病防治', '流行病防控'],
    '综合医书': ['临床实践', '医学教育', '知识普及'],
    '临证各科': ['专科治疗', '临床指导', '实践应用'],
    '养生食疗外治': ['健康维护', '疾病预防', '康复治疗'],
    '医论医案': ['学术研究', '理论探讨', '经验交流'],
    '其他': ['医疗实践', '技术推广', '知识传播']
  };
  
  return applicationsMap[bookData.category] || ['医疗实践'];
}

function getHistoricalSignificance(bookData) {
  const significanceMap = {
    '医经': ['最早系统医学理论', '影响2000多年', '中医学基础'],
    '诊法': ['最早脉诊专著', '建立诊断标准', '影响诊断实践'],
    '本草': ['最完整药物学著作', '影响世界药学', '药物学标准'],
    '方书': ['最早医学百科', '建立临床标准', '影响医学教育'],
    '针灸': ['最早针灸专著', '建立针灸学科', '影响世界针灸'],
    '伤寒金匮': ['辨证论治奠基', '影响临床实践', '经典伤寒金匮'],
    '温病': ['温病学派代表', '影响传染病防治', '经典温病条辨'],
    '综合医书': ['医学教育创新', '伦理实践整合', '影响医学发展'],
    '临证各科': ['专科系统化', '临床指导完善', '促进专科发展'],
    '养生食疗外治': ['养生理论完善', '预防医学发展', '健康文化传承'],
    '医论医案': ['学术交流平台', '理论探讨深入', '经验传承记录'],
    '其他': ['医学知识保存', '技术方法记录', '实践经验总结']
  };
  
  return significanceMap[bookData.category] || ['医学知识保存'];
}

function getDifficultyLevel(difficulty) {
  const levelMap = {
    'Low': 1,
    'Medium': 3,
    'High': 5
  };
  
  return levelMap[difficulty] || 3;
}
