// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.298Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

// 获取所有书籍目录
const booksDir = path.join(__dirname, '../src/data/snapshots/en/content/ancient-books');
const bookFiles = fs.readdirSync(booksDir).filter(file => file.endsWith('.json') && file !== 'collection.json');

console.log('🔧 以黄帝内经为标准，对齐所有书籍数据结构...\n');

// 读取黄帝内经作为标准模板
const templatePath = path.join(booksDir, 'huangdi-neijing.json');
const templateData = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

console.log('📋 读取黄帝内经模板成功');

let alignedBooks = 0;
let errorBooks = 0;

bookFiles.forEach(bookFile => {
  const bookId = bookFile.replace('.json', '');
  
  // 跳过模板文件本身
  if (bookId === 'huangdi-neijing') {
    console.log(`📚 跳过模板书籍: ${bookId}`);
    alignedBooks++;
    return;
  }
  
  console.log(`📚 对齐书籍: ${bookId}`);
  
  try {
    // 读取当前书籍数据
    const filePath = path.join(booksDir, bookFile);
    const currentData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // 创建对齐后的数据结构
    const alignedData = {
      labels: currentData.labels || {
        title: currentData.content?.title?.en || bookId,
        description: currentData.content?.description || `Medical classic: ${bookId}`
      },
      content: {
        // 保持现有的基本字段
        id: currentData.content?.id || bookId,
        title: currentData.content?.title || {
          en: currentData.content?.title?.en || bookId,
          zh: currentData.content?.title?.zh || bookId
        },
        dynasty: currentData.content?.dynasty || 'Unknown',
        author: currentData.content?.author || 'Unknown',
        category: currentData.content?.category || 'others',
        year: currentData.content?.year || 'Unknown',
        
        // 对齐metadata结构
        metadata: {
          dynasty: currentData.content?.metadata?.dynasty || currentData.content?.dynasty || 'Unknown',
          author: currentData.content?.metadata?.author || currentData.content?.author || 'Unknown',
          chapters: currentData.content?.metadata?.chapters || currentData.content?.chapters?.length || 0,
          wordCount: currentData.content?.metadata?.wordCount || currentData.content?.wordCount || 0,
          publishYear: currentData.content?.metadata?.publishYear || currentData.content?.publishYear || 'Unknown',
          tags: currentData.content?.metadata?.tags || currentData.content?.tags || [],
          coverImage: currentData.content?.metadata?.coverImage || `/images/books/${bookId}-cover.jpg`,
          difficulty: currentData.content?.metadata?.difficulty || 'Medium',
          influence: currentData.content?.metadata?.influence || '',
          preservation: currentData.content?.metadata?.preservation || 'Good'
        },
        
        // 对齐chapters结构，添加keyConcepts
        chapters: (currentData.content?.chapters || []).map(chapter => ({
          id: chapter.id,
          title: chapter.title,
          order: chapter.order,
          summary: chapter.summary,
          sections: (chapter.sections || []).map(section => ({
            id: section.id,
            title: section.title,
            order: section.order,
            originalText: section.originalText,
            translation: section.translation,
            interpretation: section.interpretation,
            keyConcepts: section.keyConcepts || generateKeyConcepts(bookId, chapter.id, section.id)
          }))
        })),
        
        // 对齐其他字段
        relatedBooks: currentData.content?.relatedBooks || generateRelatedBooks(bookId),
        readingTime: currentData.content?.readingTime || generateReadingTime(bookId),
        studyNotes: currentData.content?.studyNotes || generateStudyNotes(bookId)
      },
      
      // 对齐metrics结构
      metrics: {
        totalChapters: currentData.content?.chapters?.length || 0,
        totalWords: currentData.content?.metadata?.wordCount || currentData.content?.wordCount || 0,
        totalSections: currentData.content?.chapters?.reduce((total, chapter) => {
          return total + (chapter.sections ? chapter.sections.length : 0);
        }, 0),
        relatedBooks: (currentData.content?.relatedBooks || []).length,
        keyConcepts: currentData.content?.chapters?.reduce((total, chapter) => {
          return total + (chapter.sections ? chapter.sections.reduce((sectionTotal, section) => {
            return sectionTotal + (section.keyConcepts ? section.keyConcepts.length : 0);
          }, 0) : 0);
        }, 0),
        readingTime: calculateReadingTime(currentData.content?.metadata?.wordCount || 0),
        difficulty: getDifficultyLevel(currentData.content?.metadata?.difficulty || 'Medium')
      },
      
      // 对齐metadata结构
      updatedAt: new Date().toISOString(),
      metadata: {
        sourceFlags: ['db', 'markdown', 'seed'],
        version: '1.0.0',
        lastReviewed: new Date().toISOString()
      }
    };
    
    // 写回文件
    fs.writeFileSync(filePath, JSON.stringify(alignedData, null, 2), 'utf8');
    
    console.log(`  ✅ 对齐完成`);
    alignedBooks++;
    
  } catch (error) {
    console.log(`  ❌ 对齐失败: ${error.message}`);
    errorBooks++;
  }
  
  console.log('');
});

// 输出总结
console.log('📊 对齐结果总结:');
console.log(`成功对齐书籍数: ${alignedBooks}`);
console.log(`对齐失败书籍数: ${errorBooks}`);
console.log(`总书籍数: ${bookFiles.length}`);

if (alignedBooks === bookFiles.length) {
  console.log('\n🎉 所有书籍的数据结构都已对齐到黄帝内经标准！');
} else {
  console.log('\n⚠️  部分书籍对齐失败，请检查错误信息。');
}

// 辅助函数
function generateKeyConcepts(bookId, chapterId, sectionId) {
  const conceptMap = {
    'shanghan-zabing-lun': {
      'taiyang-bing': [
        {
          id: 'taiyang-disease',
          term: 'Taiyang Disease',
          description: 'The first stage of six meridian disease progression, representing exterior patterns',
          category: 'Six Meridians',
          relatedConcepts: ['Yangming Disease', 'Shaoyang Disease', 'Taiyin Disease']
        }
      ],
      'yangming-bing': [
        {
          id: 'yangming-disease',
          term: 'Yangming Disease',
          description: 'The second stage of six meridian disease, representing interior heat patterns',
          category: 'Six Meridians',
          relatedConcepts: ['Taiyang Disease', 'Shaoyang Disease', 'Shaoyin Disease']
        }
      ]
    },
    'bencao-gangmu': {
      'shui-bu': [
        {
          id: 'water-medicines',
          term: 'Water Medicines',
          description: 'Medicinal substances derived from water sources',
          category: 'Pharmacology',
          relatedConcepts: ['Fire Medicines', 'Earth Medicines', 'Metal Medicines']
        }
      ],
      'huo-bu': [
        {
          id: 'fire-medicines',
          term: 'Fire Medicines',
          description: 'Medicinal substances with warming properties',
          category: 'Pharmacology',
          relatedConcepts: ['Water Medicines', 'Earth Medicines', 'Metal Medicines']
        }
      ]
    }
    // ... 其他书籍的概念映射
  };
  
  return conceptMap[bookId]?.[chapterId] || [];
}

function generateRelatedBooks(bookId) {
  const relatedBooksMap = {
    'shanghan-zabing-lun': ['huangdi-neijing', 'jinkui-yaolue', 'shanghan-lun', 'nan-jing'],
    'bencao-gangmu': ['huangdi-neijing', 'shen-nong-ben-cao-jing', 'bencao-jing-jizhu', 'qianjin-fang'],
    'qianjin-fang': ['huangdi-neijing', 'shanghan-zabing-lun', 'jinkui-yaolue', 'bencao-gangmu'],
    'mai-jing': ['huangdi-neijing', 'nan-jing', 'shanghan-zabing-lun', 'jiayi-jing'],
    'jiayi-jing': ['huangdi-neijing', 'huangdi-neijing-ling-shu', 'zhen-jiu-jia-yi-jing', 'mai-jing'],
    'shanghan-lun': ['huangdi-neijing', 'shanghan-zabing-lun', 'jinkui-yaolue', 'wen-bing-tiao-bian'],
    'jinkui-yaolue': ['huangdi-neijing', 'shanghan-zabing-lun', 'shanghan-lun', 'zhong-zang-zang-fu-lun'],
    'wenzhen-xue': ['huangdi-neijing', 'shanghan-zabing-lun', 'wen-bing-lun', 'yi-xue-ru-men'],
    'yixue-rumen': ['huangdi-neijing', 'nan-jing', 'shanghan-zabing-lun', 'bencao-gangmu']
  };
  
  return relatedBooksMap[bookId] || [];
}

function generateReadingTime(bookId) {
  const readingTimeMap = {
    'shanghan-zabing-lun': {
      estimated: '4 hours',
      difficulty: 'Advanced',
      prerequisites: ['Understanding of six meridians theory', 'Cold damage knowledge', 'Herbal medicine']
    },
    'bencao-gangmu': {
      estimated: '40 hours',
      difficulty: 'Intermediate',
      prerequisites: ['Basic knowledge of Chinese pharmacology', 'Understanding of drug properties', 'Herbal medicine basics']
    },
    'qianjin-fang': {
      estimated: '20 hours',
      difficulty: 'Intermediate',
      prerequisites: ['Basic clinical medicine knowledge', 'Understanding of prescriptions', 'Medical ethics knowledge']
    },
    'mai-jing': {
      estimated: '4 hours',
      difficulty: 'Advanced',
      prerequisites: ['Understanding of pulse theory', 'Basic diagnostic methods', 'Qi-blood theory']
    },
    'jiayi-jing': {
      estimated: '5 hours',
      difficulty: 'Advanced',
      prerequisites: ['Understanding of meridian theory', 'Basic acupuncture knowledge', 'Point location skills']
    },
    'shanghan-lun': {
      estimated: '4 hours',
      difficulty: 'Advanced',
      prerequisites: ['Understanding of six meridians theory', 'Cold damage knowledge', 'Herbal medicine']
    },
    'jinkui-yaolue': {
      estimated: '3 hours',
      difficulty: 'Advanced',
      prerequisites: ['Understanding of zang-fu theory', 'Internal medicine knowledge', 'Herbal medicine']
    },
    'wenzhen-xue': {
      estimated: '3 hours',
      difficulty: 'Advanced',
      prerequisites: ['Understanding of warm-disease theory', 'Four levels theory', 'Epidemic medicine']
    },
    'yixue-rumen': {
      estimated: '2 hours',
      difficulty: 'Beginner',
      prerequisites: ['Basic medical interest', 'Understanding of Chinese culture', 'Medical ethics']
    }
  };
  
  return readingTimeMap[bookId] || {
    estimated: '2 hours',
    difficulty: 'Medium',
    prerequisites: ['Basic medical knowledge']
  };
}

function generateStudyNotes(bookId) {
  const studyNotesMap = {
    'shanghan-zabing-lun': {
      keyPoints: ['Established six meridian theory', 'Created syndrome differentiation', 'Systematic treatment principles'],
      clinicalApplications: ['Treatment of cold damage diseases', 'Six meridian diagnosis', 'Herbal formula prescriptions'],
      historicalSignificance: ['Foundation of clinical practice', 'Influenced medical education', 'Essential for Chinese medicine study']
    },
    'bencao-gangmu': {
      keyPoints: ['Comprehensive drug collection', 'Systematic classification', 'Detailed drug processing'],
      clinicalApplications: ['Foundation for modern materia medica', 'Reference for herbal formulas', 'Guide to drug preparation'],
      historicalSignificance: ['Most comprehensive pharmacological work', 'Influenced pharmacology worldwide', 'Standardized drug classification']
    },
    'qianjin-fang': {
      keyPoints: ['First clinical encyclopedia', 'Systematic organization', 'Ethics integration'],
      clinicalApplications: ['Foundation for clinical practice', 'Reference for prescriptions', 'Guide to medical ethics'],
      historicalSignificance: ['First medical encyclopedia', 'Established clinical standards', 'Integrated ethics into practice']
    },
    'mai-jing': {
      keyPoints: ['First systematic pulse work', 'Pulse classification', 'Diagnostic methodology'],
      clinicalApplications: ['Foundation for pulse diagnosis', 'Reference for pulse examination', 'Diagnostic methodology'],
      historicalSignificance: ['Earliest pulse diagnosis work', 'Established pulse as diagnostic method', 'Foundation of pulse theory']
    },
    'jiayi-jing': {
      keyPoints: ['First comprehensive acupuncture work', 'Systematic acupoint organization', 'Clinical applications'],
      clinicalApplications: ['Foundation for acupuncture practice', 'Reference for acupoints', 'Treatment protocols'],
      historicalSignificance: ['Earliest systematic acupuncture work', 'Established acupuncture discipline', 'Foundation of modern practice']
    },
    'shanghan-lun': {
      keyPoints: ['Focus on cold damage', 'Six meridian theory', 'Treatment protocols'],
      clinicalApplications: ['Treatment of cold damage', 'Six meridian diagnosis', 'Herbal prescriptions'],
      historicalSignificance: ['Classic of cold damage medicine', 'Foundation of six meridian theory', 'Essential for clinical practice']
    },
    'jinkui-yaolue': {
      keyPoints: ['Focus on miscellaneous diseases', 'Zang-fu theory', 'Preventive medicine'],
      clinicalApplications: ['Treatment of internal diseases', 'Zang-fu diagnosis', 'Preventive health'],
      historicalSignificance: ['Classic of internal medicine', 'Foundation of zang-fu theory', 'Essential for clinical practice']
    },
    'wenzhen-xue': {
      keyPoints: ['Four levels theory', 'Three jiao theory', 'Seasonal diseases'],
      clinicalApplications: ['Treatment of warm-epidemic diseases', 'Four levels diagnosis', 'Seasonal disease protocols'],
      historicalSignificance: ['Classic of warm-disease school', 'Established four levels theory', 'Influenced epidemic medicine']
    },
    'yixue-rumen': {
      keyPoints: ['Medical education', 'Ethics integration', 'Systematic knowledge'],
      clinicalApplications: ['Foundation for medical study', 'Reference for beginners', 'Educational resource'],
      historicalSignificance: ['Important medical textbook', 'Educational innovation', 'Ethics emphasis']
    }
  };
  
  return studyNotesMap[bookId] || {
    keyPoints: ['Medical knowledge', 'Clinical practice', 'Theoretical foundation'],
    clinicalApplications: ['Medical practice', 'Clinical guidance', 'Treatment reference'],
    historicalSignificance: ['Medical knowledge preservation', 'Practice methodology', 'Experience summary']
  };
}

function calculateReadingTime(wordCount) {
  // 假设每分钟阅读100字
  return Math.round(wordCount / 100);
}

function getDifficultyLevel(difficulty) {
  const levelMap = {
    'Low': 1,
    'Beginner': 2,
    'Medium': 3,
    'Intermediate': 4,
    'High': 5,
    'Advanced': 5
  };
  
  return levelMap[difficulty] || 3;
}
