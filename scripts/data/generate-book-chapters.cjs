// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.337Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

// 书籍章节内容定义
const booksChapters = {
  'shanghan-zabing-lun': {
    chapters: [
      {
        id: 'taiyang-bing',
        title: {
          en: 'Taiyang Disease Patterns',
          zh: '太阳病脉证并治'
        },
        order: 0,
        summary: 'Discusses the diagnosis and treatment of Taiyang disease patterns according to six meridian theory',
        sections: [
          {
            id: 'taiyang-bing-1',
            title: 'Taiyang Disease Chapter One',
            order: 0,
            originalText: '太阳之为病，脉浮，头项强痛而恶寒。太阳病，发热汗出者，恶风也，其脉缓者，名为中风。太阳病，或已发热，或未发热，必恶寒，体痛呕逆，脉阴阳俱紧者，名为伤寒。',
            translation: 'When Taiyang is diseased, the pulse is floating, there is stiffness and pain in the head and neck, and aversion to cold. In Taiyang disease with fever and sweating, there is aversion to wind; when the pulse is slow, it is called wind strike. In Taiyang disease, whether there is already fever or not yet, there is necessarily aversion to cold, body pain, vomiting, and when both yin and yang pulses are tight, it is called cold damage.',
            interpretation: 'This chapter establishes the basic diagnostic criteria for Taiyang disease patterns, which represent the exterior stage of disease according to the six meridian theory.'
          }
        ]
      },
      {
        id: 'yangming-bing',
        title: {
          en: 'Yangming Disease Patterns',
          zh: '阳明病脉证并治'
        },
        order: 1,
        summary: 'Discusses the diagnosis and treatment of Yangming disease patterns',
        sections: [
          {
            id: 'yangming-bing-1',
            title: 'Yangming Disease Chapter One',
            order: 0,
            originalText: '阳明之为病，胃家实是也。阳明病，若能食，名中风；不能食，名中寒。阳明病，外证云何？答曰：身热，汗自出，不恶寒，反恶热也。',
            translation: 'When Yangming is diseased, the stomach house is replete. In Yangming disease, if one can eat, it is called wind strike; if one cannot eat, it is called cold strike. What are the exterior signs of Yangming disease? The answer is: body heat, spontaneous sweating, no aversion to cold, but rather aversion to heat.',
            interpretation: 'This chapter describes Yangming disease patterns, which represent the interior heat stage with excess in the stomach and large intestine meridians.'
          }
        ]
      }
    ]
  },

  'bencao-gangmu': {
    chapters: [
      {
        id: 'shui-bu',
        title: {
          en: 'Water Section',
          zh: '水部'
        },
        order: 0,
        summary: 'Discusses various types of water and their medicinal properties',
        sections: [
          {
            id: 'shui-bu-1',
            title: 'Water Section Chapter One',
            order: 0,
            originalText: '天水为一，地水为二，人之水为三。水为万物之源，水为百药之长。',
            translation: 'Heavenly water is one, earthly water is two, human water is three. Water is the source of all things, water is the chief of all medicines.',
            interpretation: 'This chapter establishes the fundamental importance of water in both nature and medicine, reflecting the holistic view of Chinese pharmacology.'
          }
        ]
      },
      {
        id: 'huo-bu',
        title: {
          en: 'Fire Section',
          zh: '火部'
        },
        order: 1,
        summary: 'Discusses fire-related substances and their medicinal properties',
        sections: [
          {
            id: 'huo-bu-1',
            title: 'Fire Section Chapter One',
            order: 0,
            originalText: '火者，南方之气，其性炎上，其用温暖。火能生土，亦能克金。',
            translation: 'Fire is the qi of the south, its nature is flaming upward, its use is warming. Fire can generate earth, but can also overcome metal.',
            interpretation: 'This chapter explores the properties of fire in Chinese medicine and its relationship with the five elements theory.'
          }
        ]
      }
    ]
  },

  'qianjin-fang': {
    chapters: [
      {
        id: 'fu-ren-bing',
        title: {
          en: 'Women\'s Diseases',
          zh: '妇人方'
        },
        order: 0,
        summary: 'Comprehensive discussion of gynecological and obstetric diseases',
        sections: [
          {
            id: 'fu-ren-bing-1',
            title: 'Women\'s Diseases Chapter One',
            order: 0,
            originalText: '妇人者，众阴所集也。阴者，静也，藏也。故妇人病多，多于男子。',
            translation: 'Women are the gathering of all yin. Yin is quiet, it is storage. Therefore, women have more illnesses than men.',
            interpretation: 'This reflects the understanding of women\'s unique physiology in Chinese medicine and the need for specialized treatment approaches.'
          }
        ]
      },
      {
        id: 'shao-er-bing',
        title: {
          en: 'Pediatric Diseases',
          zh: '少小婴孺方'
        },
        order: 1,
        summary: 'Discussion of pediatric diseases and treatments',
        sections: [
          {
            id: 'shao-er-bing-1',
            title: 'Pediatric Diseases Chapter One',
            order: 0,
            originalText: '小儿者，纯阳之体，易寒易热，易虚易实。',
            translation: 'Children are pure yang bodies, easily affected by cold and heat, easily becoming deficient or excessive.',
            interpretation: 'This chapter describes the unique physiological characteristics of children and corresponding treatment principles.'
          }
        ]
      }
    ]
  },

  'mai-jing': {
    chapters: [
      {
        id: 'mai-xue',
        title: {
          en: 'Pulse Study',
          zh: '脉学'
        },
        order: 0,
        summary: 'Systematic study of pulse diagnosis methods and theory',
        sections: [
          {
            id: 'mai-xue-1',
            title: 'Pulse Study Chapter One',
            order: 0,
            originalText: '脉者，血之府也。长则气治，短则气病，数则气烦，大则气病，细则气少。',
            translation: 'Pulse is the mansion of blood. Long pulse indicates harmonious qi, short pulse indicates qi illness, rapid pulse indicates qi vexation, large pulse indicates qi illness, fine pulse indicates qi deficiency.',
            interpretation: 'This chapter establishes the fundamental theory of pulse diagnosis, linking pulse characteristics to the state of qi and blood in the body.'
          }
        ]
      },
      {
        id: 'mai-xiang',
        title: {
          en: 'Pulse Images',
          zh: '脉象'
        },
        order: 1,
        summary: 'Detailed description of different pulse images and their significance',
        sections: [
          {
            id: 'mai-xiang-1',
            title: 'Pulse Images Chapter One',
            order: 0,
            originalText: '浮脉为表，沉脉为里，迟脉为寒，数脉为热。',
            translation: 'Floating pulse indicates exterior, deep pulse indicates interior, slow pulse indicates cold, rapid pulse indicates heat.',
            interpretation: 'This chapter provides the basic classification of pulse images according to location and speed.'
          }
        ]
      }
    ]
  },

  'jiayi-jing': {
    chapters: [
      {
        id: 'zhen-jiu-xue',
        title: {
          en: 'Acupuncture and Moxibustion Study',
          zh: '针灸学'
        },
        order: 0,
        summary: 'Comprehensive study of acupuncture points and techniques',
        sections: [
          {
            id: 'zhen-jiu-xue-1',
            title: 'Acupuncture Study Chapter One',
            order: 0,
            originalText: '凡刺之法，必先明经络，知穴道，然后可施针。不知经络，不知穴道，妄施针石，伤人肌肤。',
            translation: 'All acupuncture methods must first understand the meridians, know the acupoint pathways, then apply needles. Without understanding meridians and acupoint pathways, blindly applying needles and stones injures people\'s skin and flesh.',
            interpretation: 'This chapter emphasizes the importance of understanding meridian theory and acupoint locations before practicing acupuncture.'
          }
        ]
      },
      {
        id: 'shu-xue',
        title: {
          en: 'Acupoints',
          zh: '腧穴'
        },
        order: 1,
        summary: 'Detailed description of acupuncture points and their functions',
        sections: [
          {
            id: 'shu-xue-1',
            title: 'Acupoints Chapter One',
            order: 0,
            originalText: '腧穴者，经络之所会，气血之所行。知其所在，明其功能，则针到病除。',
            translation: 'Acupoints are where meridians meet, where qi and blood flow. Knowing their locations and understanding their functions, needles arrive and illness is removed.',
            interpretation: 'This chapter explains the fundamental concept of acupoints as the intersection points of meridians and the flow of qi and blood.'
          }
        ]
      }
    ]
  },

  'shanghan-lun': {
    chapters: [
      {
        id: 'taiyang-bing-zheng',
        title: {
          en: 'Taiyang Disease Patterns',
          zh: '太阳病脉证并治'
        },
        order: 0,
        summary: 'Detailed discussion of Taiyang disease patterns and treatments',
        sections: [
          {
            id: 'taiyang-bing-zheng-1',
            title: 'Taiyang Disease Patterns Chapter One',
            order: 0,
            originalText: '太阳病，发热而渴，不恶寒者，为温病。太阳病，发热而渴，恶寒者，为伤寒。',
            translation: 'In Taiyang disease, with fever and thirst but no aversion to cold, it is a warm disease. In Taiyang disease, with fever and thirst and aversion to cold, it is cold damage.',
            interpretation: 'This chapter distinguishes between warm diseases and cold damage within Taiyang patterns, providing diagnostic criteria.'
          }
        ]
      },
      {
        id: 'yangming-bing-zheng',
        title: {
          en: 'Yangming Disease Patterns',
          zh: '阳明病脉证并治'
        },
        order: 1,
        summary: 'Discussion of Yangming disease patterns in cold damage',
        sections: [
          {
            id: 'yangming-bing-zheng-1',
            title: 'Yangming Disease Patterns Chapter One',
            order: 0,
            originalText: '阳明病，外证云何？曰：身热，汗自出，不恶寒，反恶热也。',
            translation: 'What are the exterior signs of Yangming disease? The answer is: body heat, spontaneous sweating, no aversion to cold, but rather aversion to heat.',
            interpretation: 'This chapter describes the characteristic exterior manifestations of Yangming disease patterns.'
          }
        ]
      }
    ]
  },

  'jinkui-yaolue': {
    chapters: [
      {
        id: 'zang-fu-bing',
        title: {
          en: 'Zang-Fu Diseases',
          zh: '脏腑经络先后病脉证'
        },
        order: 0,
        summary: 'Comprehensive discussion of zang-fu organ diseases',
        sections: [
          {
            id: 'zang-fu-bing-1',
            title: 'Zang-Fu Diseases Chapter One',
            order: 0,
            originalText: '问曰：上工治未病，中工治已病，何谓也？师曰：上工治未病者，见肝之病，知肝传脾，当先实脾。',
            translation: 'Question: The superior physician treats not-yet-occurred diseases, the middle physician treats already-occurred diseases, what does this mean? The teacher said: The superior physician treating not-yet-occurred diseases means seeing liver disease, knowing it will transmit to the spleen, should first strengthen the spleen.',
            interpretation: 'This chapter introduces the concept of preventive medicine and disease transmission patterns in Chinese medicine.'
          }
        ]
      },
      {
        id: 'xue-bing',
        title: {
          en: 'Blood Diseases',
          zh: '血痹虚劳病脉证并治'
        },
        order: 1,
        summary: 'Discussion of blood-related diseases and deficiency conditions',
        sections: [
          {
            id: 'xue-bing-1',
            title: 'Blood Diseases Chapter One',
            order: 0,
            originalText: '血痹者，身体不仁，风痹也。虚劳者，阴阳两虚也。',
            translation: 'Blood impediment means the body lacks sensation, it is wind impediment. Deficiency taxation means both yin and yang are deficient.',
            interpretation: 'This chapter distinguishes between blood impediment and deficiency conditions, providing diagnostic criteria.'
          }
        ]
      }
    ]
  },

  'wenzhen-xue': {
    chapters: [
      {
        id: 'wei-qi-ying-xue',
        title: {
          en: 'Wei-Qi-Ying-Xue Theory',
          zh: '卫气营血学说'
        },
        order: 0,
        summary: 'The theoretical foundation of warm-disease diagnosis and treatment',
        sections: [
          {
            id: 'wei-qi-ying-xue-1',
            title: 'Wei-Qi-Ying-Xue Theory Chapter One',
            order: 0,
            originalText: '温邪上受，首先犯肺，逆传心包。肺主气属卫，心主血属营。',
            translation: 'Warm pathogens first attack from above, first affecting the lung, then retrogradely transmit to the pericardium. The lung governs qi and belongs to wei, the heart governs blood and belongs to ying.',
            interpretation: 'This chapter establishes the core theory of warm-disease transmission through the four levels: wei, qi, ying, and xue.'
          }
        ]
      },
      {
        id: 'san-jiao-bian-zheng',
        title: {
          en: 'Three Jiao Differentiation',
          zh: '三焦辨证'
        },
        order: 1,
        summary: 'Three jiao theory for warm disease diagnosis',
        sections: [
          {
            id: 'san-jiao-bian-zheng-1',
            title: 'Three Jiao Differentiation Chapter One',
            order: 0,
            originalText: '上焦如雾，中焦如沤，下焦如渎。',
            translation: 'The upper jiao is like mist, the middle jiao is like foam, the lower jiao is like a ditch.',
            interpretation: 'This chapter uses vivid metaphors to describe the characteristics and functions of the three jiao in warm disease pathology.'
          }
        ]
      }
    ]
  },

  'yixue-rumen': {
    chapters: [
      {
        id: 'yi-xue-yuan-liu',
        title: {
          en: 'Origin and Development of Medicine',
          zh: '医学源流'
        },
        order: 0,
        summary: 'Historical development and theoretical foundations of Chinese medicine',
        sections: [
          {
            id: 'yi-xue-yuan-liu-1',
            title: 'Medical Origin Chapter One',
            order: 0,
            originalText: '医者，意也。意者，心之所之也。心有所之，谓之医。',
            translation: 'Medicine means intention. Intention is what the mind holds. When the mind holds something, it is called medicine.',
            interpretation: 'This chapter explores the philosophical foundation of medicine as the intention or will to heal.'
          }
        ]
      },
      {
        id: 'yi-xue-gang-mu',
        title: {
          en: 'Medical Fundamentals',
          zh: '医学纲目'
        },
        order: 1,
        summary: 'Basic principles and methods of medical practice',
        sections: [
          {
            id: 'yi-xue-gang-mu-1',
            title: 'Medical Fundamentals Chapter One',
            order: 0,
            originalText: '医道之大，莫过于阴阳。阴阳者，天地之道也，万物之纲纪。',
            translation: 'The great way of medicine is none other than yin and yang. Yin and yang are the way of heaven and earth, the principle of all things.',
            interpretation: 'This chapter establishes yin-yang theory as the fundamental principle of Chinese medicine.'
          }
        ]
      }
    ]
  }
};

// 创建章节目录和内容
console.log('开始生成书籍章节目录和内容...');

Object.entries(booksChapters).forEach(([bookId, bookData]) => {
  const bookDir = path.join(__dirname, '../src/data/snapshots/en/content/ancient-books', bookId);
  const chaptersDir = path.join(bookDir, 'chapters');
  
  // 创建目录
  if (!fs.existsSync(bookDir)) {
    fs.mkdirSync(bookDir, { recursive: true });
  }
  
  if (!fs.existsSync(chaptersDir)) {
    fs.mkdirSync(chaptersDir, { recursive: true });
  }
  
  // 生成章节文件
  bookData.chapters.forEach((chapter) => {
    const chapterFilePath = path.join(chaptersDir, `${chapter.id}.json`);
    
    try {
      fs.writeFileSync(chapterFilePath, JSON.stringify(chapter, null, 2), 'utf8');
      console.log(`✅ 成功创建章节: ${bookId}/${chapter.id}.json`);
    } catch (error) {
      console.error(`❌ 创建章节失败: ${bookId}/${chapter.id}.json`, error.message);
    }
  });
});

console.log('🎉 书籍章节目录和内容生成完成!');
