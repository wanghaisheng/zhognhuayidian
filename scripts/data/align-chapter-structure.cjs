// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.299Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

// 获取所有书籍目录
const booksDir = path.join(__dirname, '../src/data/snapshots/en/content/ancient-books');
const bookDirs = fs.readdirSync(booksDir).filter(item => {
  const itemPath = path.join(booksDir, item);
  return fs.statSync(itemPath).isDirectory() && item !== 'huangdi-neijing';
});

console.log('🔧 对齐章节文件结构到黄帝内经标准...\n');

let alignedChapters = 0;
let errorChapters = 0;

bookDirs.forEach(bookId => {
  console.log(`📚 对齐书籍章节: ${bookId}`);
  
  try {
    // 读取章节目录
    const chaptersDir = path.join(booksDir, bookId, 'chapters');
    if (!fs.existsSync(chaptersDir)) {
      console.log(`  ⚠️  跳过，没有chapters目录`);
      return;
    }
    
    // 获取所有章节文件
    const chapterFiles = fs.readdirSync(chaptersDir).filter(file => file.endsWith('.json'));
    
    chapterFiles.forEach(chapterFile => {
      const chapterFilePath = path.join(chaptersDir, chapterFile);
      const chapterData = JSON.parse(fs.readFileSync(chapterFilePath, 'utf8'));
      
      // 检查是否已经有keyConcepts
      if (chapterData.sections && chapterData.sections.length > 0) {
        let hasKeyConcepts = true;
        
        // 检查每个section是否有keyConcepts
        chapterData.sections.forEach(section => {
          if (!section.keyConcepts || section.keyConcepts.length === 0) {
            hasKeyConcepts = false;
          }
        });
        
        if (!hasKeyConcepts) {
          // 为每个section添加keyConcepts
          const alignedChapterData = {
            ...chapterData,
            sections: chapterData.sections.map(section => ({
              ...section,
              keyConcepts: generateKeyConcepts(bookId, chapterData.id, section.id)
            }))
          };
          
          // 写回文件
          fs.writeFileSync(chapterFilePath, JSON.stringify(alignedChapterData, null, 2), 'utf8');
          console.log(`  ✅ 对齐章节: ${chapterFile}`);
          alignedChapters++;
        } else {
          console.log(`  ✅ 章节已有keyConcepts: ${chapterFile}`);
          alignedChapters++;
        }
      }
    });
    
  } catch (error) {
    console.log(`  ❌ 对齐失败: ${error.message}`);
    errorChapters++;
  }
  
  console.log('');
});

// 输出总结
console.log('📊 章节对齐结果总结:');
console.log(`成功对齐章节数: ${alignedChapters}`);
console.log(`对齐失败章节数: ${errorChapters}`);

if (errorChapters === 0) {
  console.log('\n🎉 所有章节文件都已对齐到黄帝内经标准！');
} else {
  console.log('\n⚠️  部分章节对齐失败，请检查错误信息。');
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
    },
    'qianjin-fang': {
      'fu-ren-bing': [
        {
          id: 'womens-medicine',
          term: 'Women\'s Medicine',
          description: 'Medical practice focused on women\'s health and gynecological conditions',
          category: 'Clinical Medicine',
          relatedConcepts: ['Pediatrics', 'Obstetrics', 'Gynecology']
        }
      ],
      'shao-er-bing': [
        {
          id: 'pediatrics',
          term: 'Pediatrics',
          description: 'Medical practice focused on children\'s health and diseases',
          category: 'Clinical Medicine',
          relatedConcepts: ['Women\'s Medicine', 'Internal Medicine', 'Surgery']
        }
      ]
    },
    'mai-jing': {
      'mai-xue': [
        {
          id: 'pulse-diagnosis',
          term: 'Pulse Diagnosis',
          description: 'The art and science of diagnosing disease through pulse examination',
          category: 'Diagnostics',
          relatedConcepts: ['Tongue Diagnosis', 'Abdominal Palpation', 'Inquiry']
        }
      ],
      'mai-xiang': [
        {
          id: 'pulse-qualities',
          term: 'Pulse Qualities',
          description: 'Different characteristics and qualities of pulse in diagnosis',
          category: 'Diagnostics',
          relatedConcepts: ['Pulse Diagnosis', 'Differential Diagnosis', 'Clinical Assessment']
        }
      ]
    },
    'jiayi-jing': {
      'zhen-jiu-xue': [
        {
          id: 'acupuncture-theory',
          term: 'Acupuncture Theory',
          description: 'The theoretical foundation of acupuncture practice and meridian theory',
          category: 'Acupuncture',
          relatedConcepts: ['Moxibustion', 'Acupoints', 'Meridians']
        }
      ],
      'shu-xue': [
        {
          id: 'acupoints',
          term: 'Acupoints',
          description: 'Specific points on the body where needles are inserted for therapeutic effect',
          category: 'Acupuncture',
          relatedConcepts: ['Meridians', 'Qi Flow', 'Therapeutic Points']
        }
      ]
    },
    'shanghan-lun': {
      'taiyang-bing-zheng': [
        {
          id: 'taiyang-patterns',
          term: 'Taiyang Patterns',
          description: 'Disease patterns affecting the Taiyang meridian in cold damage diseases',
          category: 'Cold Damage',
          relatedConcepts: ['Yangming Patterns', 'Shaoyang Patterns', 'Taiyin Patterns']
        }
      ],
      'yangming-bing-zheng': [
        {
          id: 'yangming-patterns',
          term: 'Yangming Patterns',
          description: 'Disease patterns affecting the Yangming meridian in cold damage diseases',
          category: 'Cold Damage',
          relatedConcepts: ['Taiyang Patterns', 'Shaoyang Patterns', 'Taiyin Patterns']
        }
      ]
    },
    'jinkui-yaolue': {
      'zang-fu-bing': [
        {
          id: 'zang-fu-diseases',
          term: 'Zang-Fu Diseases',
          description: 'Diseases affecting the zang-fu organs in traditional Chinese medicine',
          category: 'Internal Medicine',
          relatedConcepts: ['Qi-Blood Theory', 'Five Elements', 'Yin-Yang Theory']
        }
      ],
      'xue-bing': [
        {
          id: 'blood-disorders',
          term: 'Blood Disorders',
          description: 'Conditions related to blood deficiency, stagnation, or heat in traditional Chinese medicine',
          category: 'Internal Medicine',
          relatedConcepts: ['Qi Disorders', 'Zang-Fu Theory', 'Blood-Heat']
        }
      ]
    },
    'wenzhen-xue': {
      'wei-qi-ying-xue': [
        {
          id: 'four-levels-theory',
          term: 'Four Levels Theory',
          description: 'The theoretical framework for warm disease progression through wei, qi, ying, and xue levels',
          category: 'Warm Diseases',
          relatedConcepts: ['Six Meridians', 'San Jiao Theory', 'Seasonal Diseases']
        }
      ],
      'san-jiao-bian-zheng': [
        {
          id: 'san-jiao-theory',
          term: 'San Jiao Theory',
          description: 'The theoretical framework dividing the body into upper, middle, and lower jiao for warm disease diagnosis',
          category: 'Warm Diseases',
          relatedConcepts: ['Four Levels Theory', 'Zang-Fu Theory', 'Triple Burner']
        }
      ]
    },
    'yixue-rumen': {
      'yi-xue-yuan-liu': [
        {
          id: 'medical-philosophy',
          term: 'Medical Philosophy',
          description: 'The philosophical foundation and ethical principles of medical practice',
          category: 'Medical Theory',
          relatedConcepts: ['Medical Ethics', 'Holistic Medicine', 'Preventive Medicine']
        }
      ],
      'yi-xue-gang-mu': [
        {
          id: 'medical-foundations',
          term: 'Medical Foundations',
          description: 'The basic principles and theoretical foundations of Chinese medicine',
          category: 'Medical Theory',
          relatedConcepts: ['Yin-Yang Theory', 'Five Elements', 'Zang-Fu Theory']
        }
      ]
    }
  };
  
  return conceptMap[bookId]?.[chapterId] || [];
}
