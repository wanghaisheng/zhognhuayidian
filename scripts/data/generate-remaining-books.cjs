// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.349Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

// 剩余书籍数据定义
const remainingBooks = {
  'mai-jing': {
    labels: {
      title: "The Pulse Classic",
      description: "The first systematic work on pulse diagnosis in Chinese medicine"
    },
    content: {
      id: "mai-jing",
      title: {
        en: "The Pulse Classic",
        zh: "脉经"
      },
      dynasty: "Western Jin",
      author: "Wang Shuhe",
      category: "diagnostics",
      metadata: {
        dynasty: "Western Jin",
        author: "Wang Shuhe",
        chapters: 10,
        wordCount: 25000,
        publishYear: "280",
        tags: ["Pulse Diagnosis", "Diagnostics", "Wang Shuhe", "Western Jin Medicine", "Pulse Theory"],
        coverImage: "/images/books/mai-jing-cover.jpg",
        difficulty: "High",
        influence: "Foundation of Pulse Diagnosis",
        preservation: "Fragmentary"
      },
      chapters: [
        {
          id: "mai-xue",
          title: {
            en: "Pulse Study",
            zh: "脉学"
          },
          order: 0,
          summary: "Systematic study of pulse diagnosis methods and theory",
          sections: [
            {
              id: "mai-xue-1",
              title: "Pulse Study Chapter One",
              order: 0,
              originalText: "脉者，血之府也。长则气治，短则气病，数则气烦，大则气病，细则气少。",
              translation: "Pulse is the mansion of blood. Long pulse indicates harmonious qi, short pulse indicates qi illness, rapid pulse indicates qi vexation, large pulse indicates qi illness, fine pulse indicates qi deficiency.",
              interpretation: "This chapter establishes the fundamental theory of pulse diagnosis, linking pulse characteristics to the state of qi and blood in the body.",
              keyConcepts: [
                {
                  id: "pulse-mansion",
                  term: "Pulse as Mansion of Blood",
                  description: "The theoretical foundation of pulse diagnosis in Chinese medicine",
                  category: "Pulse Theory",
                  relatedConcepts: ["Qi-Blood Theory", "Diagnosis", "Pulse Characteristics"]
                }
              ]
            }
          ],
          keyConcepts: [
            {
              id: "pulse-diagnosis",
              term: "Pulse Diagnosis",
              description: "The art and science of diagnosing disease through pulse examination",
              category: "Diagnostics",
              relatedConcepts: ["Four Examinations", "Wang Shuhe", "Pulse Theory"]
            }
          ]
        }
      ],
      relatedBooks: ["huangdi-neijing", "nan-jing", "shanghan-zabing-lun", "jiayi-jing"],
      readingTime: {
        estimated: "4 hours",
        difficulty: "Advanced",
        prerequisites: ["Understanding of pulse theory", "Basic diagnostic methods", "Qi-blood theory"]
      },
      studyNotes: {
        keyPoints: [
          "First systematic work on pulse diagnosis",
          "Established pulse classification system",
          "Integrated previous pulse knowledge",
          "Created diagnostic methodology"
        ],
        clinicalApplications: [
          "Foundation for pulse diagnosis",
          "Guide to pulse examination techniques",
          "Reference for pulse pattern identification",
          "Diagnostic methodology for various conditions"
        ],
        historicalSignificance: [
          "Earliest comprehensive pulse diagnosis work",
          "Established pulse as major diagnostic method",
          "Influenced diagnostic practice for centuries",
          "Foundation of modern pulse diagnosis"
        ]
      }
    },
    metrics: {
      totalChapters: 10,
      totalWords: 25000,
      totalSections: 24,
      relatedBooks: 4,
      keyConcepts: 89,
      readingTime: 240,
      difficulty: 5
    },
    updatedAt: "2024-01-01T00:00:00Z",
    metadata: {
      sourceFlags: ["db", "markdown", "seed"],
      version: "1.0.0",
      lastReviewed: "2024-01-01T00:00:00Z"
    }
  },

  'jiayi-jing': {
    labels: {
      title: "A-B Classic of Acupuncture and Moxibustion",
      description: "The earliest comprehensive work on acupuncture and moxibustion"
    },
    content: {
      id: "jiayi-jing",
      title: {
        en: "A-B Classic of Acupuncture and Moxibustion",
        zh: "甲乙经"
      },
      dynasty: "Wei-Jin",
      author: "Huangfu Mi",
      category: "acupuncture",
      metadata: {
        dynasty: "Wei-Jin",
        author: "Huangfu Mi",
        chapters: 12,
        wordCount: 38000,
        publishYear: "256",
        tags: ["Acupuncture", "Moxibustion", "Huangfu Mi", "Wei-Jin Medicine", "Acupoints"],
        coverImage: "/images/books/jiayi-jing-cover.jpg",
        difficulty: "High",
        influence: "Acupuncture Foundation Work",
        preservation: "Good"
      },
      chapters: [
        {
          id: "zhen-jiu-xue",
          title: {
            en: "Acupuncture and Moxibustion Study",
            zh: "针灸学"
          },
          order: 0,
          summary: "Comprehensive study of acupuncture points and techniques",
          sections: [
            {
              id: "zhen-jiu-xue-1",
              title: "Acupuncture Study Chapter One",
              order: 0,
              originalText: "凡刺之法，必先明经络，知穴道，然后可施针。不知经络，不知穴道，妄施针石，伤人肌肤。",
              translation: "All acupuncture methods must first understand the meridians, know the acupoint pathways, then apply needles. Without understanding meridians and acupoint pathways, blindly applying needles and stones injures people's skin and flesh.",
              interpretation: "This chapter emphasizes the importance of understanding meridian theory and acupoint locations before practicing acupuncture.",
              keyConcepts: [
                {
                  id: "meridian-theory",
                  term: "Meridian Theory",
                  description: "The theoretical foundation of acupuncture describing the pathways of qi flow",
                  category: "Acupuncture Theory",
                  relatedConcepts: ["Acupoints", "Qi Flow", "Meridian Pathways"]
                }
              ]
            }
          ],
          keyConcepts: [
            {
              id: "acupoint-knowledge",
              term: "Acupoint Knowledge",
              description: "The systematic understanding of acupoint locations and functions",
              category: "Acupuncture",
              relatedConcepts: ["Meridian Theory", "Acupuncture Techniques", "Point Selection"]
            }
          ]
        }
      ],
      relatedBooks: ["huangdi-neijing", "huangdi-neijing-ling-shu", "zhen-jiu-jia-yi-jing", "tong-ren-shu-xue-zhen-jiu-tu-jing"],
      readingTime: {
        estimated: "5 hours",
        difficulty: "Advanced",
        prerequisites: ["Understanding of meridian theory", "Basic acupuncture knowledge", "Point location skills"]
      },
      studyNotes: {
        keyPoints: [
          "Earliest comprehensive acupuncture work",
          "Systematic organization of 349 acupoints",
          "Integration of previous acupuncture knowledge",
          "Created acupuncture treatment methodology"
        ],
        clinicalApplications: [
          "Foundation for acupuncture practice",
          "Reference for acupoint location and function",
          "Guide to acupuncture techniques",
          "Treatment protocols for various conditions"
        ],
        historicalSignificance: [
          "Earliest systematic acupuncture work",
          "Established acupuncture as medical discipline",
          "Influenced acupuncture development worldwide",
          "Foundation of modern acupuncture practice"
        ]
      }
    },
    metrics: {
      totalChapters: 12,
      totalWords: 38000,
      totalSections: 654,
      relatedBooks: 4,
      keyConcepts: 156,
      readingTime: 300,
      difficulty: 5
    },
    updatedAt: "2024-01-01T00:00:00Z",
    metadata: {
      sourceFlags: ["db", "markdown", "seed"],
      version: "1.0.0",
      lastReviewed: "2024-01-01T00:00:00Z"
    }
  },

  'shanghan-lun': {
    labels: {
      title: "Treatise on Cold Damage",
      description: "The classic work on cold damage diseases and six meridian theory"
    },
    content: {
      id: "shanghan-lun",
      title: {
        en: "Treatise on Cold Damage",
        zh: "伤寒论"
      },
      dynasty: "Eastern Han",
      author: "Zhang Zhongjing",
      category: "shanghan",
      metadata: {
        dynasty: "Eastern Han",
        author: "Zhang Zhongjing",
        chapters: 10,
        wordCount: 35000,
        publishYear: "200",
        tags: ["Cold Damage", "Six Meridians", "Zhang Zhongjing", "Eastern Han Medicine", "Exterior Patterns"],
        coverImage: "/images/books/shanghan-lun-cover.jpg",
        difficulty: "High",
        influence: "Cold Disease Classic",
        preservation: "Good"
      },
      chapters: [
        {
          id: "taiyang-bing-zheng",
          title: {
            en: "Taiyang Disease Patterns",
            zh: "太阳病脉证并治"
          },
          order: 0,
          summary: "Detailed discussion of Taiyang disease patterns and treatments",
          sections: [
            {
              id: "taiyang-bing-zheng-1",
              title: "Taiyang Disease Patterns Chapter One",
              order: 0,
              originalText: "太阳病，发热而渴，不恶寒者，为温病。太阳病，发热而渴，恶寒者，为伤寒。",
              translation: "In Taiyang disease, with fever and thirst but no aversion to cold, it is a warm disease. In Taiyang disease, with fever and thirst and aversion to cold, it is cold damage.",
              interpretation: "This chapter distinguishes between warm diseases and cold damage within Taiyang patterns, providing diagnostic criteria.",
              keyConcepts: [
                {
                  id: "warm-vs-cold",
                  term: "Warm vs Cold Damage",
                  description: "Differentiation between warm diseases and cold damage in Taiyang patterns",
                  category: "Differential Diagnosis",
                  relatedConcepts: ["Taiyang Disease", "Six Meridians", "Seasonal Diseases"]
                }
              ]
            }
          ],
          keyConcepts: [
            {
              id: "six-meridian-theory",
              term: "Six Meridian Theory",
              description: "The theoretical framework for disease progression in cold damage",
              category: "Basic Theory",
              relatedConcepts: ["Taiyang Disease", "Yangming Disease", "Shaoyang Disease"]
            }
          ]
        }
      ],
      relatedBooks: ["huangdi-neijing", "shanghan-zabing-lun", "jinkui-yaolue", "wen-bing-tiao-bian"],
      readingTime: {
        estimated: "4 hours",
        difficulty: "Advanced",
        prerequisites: ["Understanding of six meridians theory", "Cold damage knowledge", "Herbal medicine"]
      },
      studyNotes: {
        keyPoints: [
          "Focus on cold damage diseases",
          "Systematic six meridian theory",
          "Detailed treatment protocols",
          "Integration with clinical practice"
        ],
        clinicalApplications: [
          "Treatment of cold damage diseases",
          "Six meridian diagnosis",
          "Herbal formula prescriptions",
          "Seasonal disease treatment"
        ],
        historicalSignificance: [
          "Classic of cold damage medicine",
          "Foundation of six meridian theory",
          "Influenced clinical practice",
          "Essential for Chinese medicine study"
        ]
      }
    },
    metrics: {
      totalChapters: 10,
      totalWords: 35000,
      totalSections: 398,
      relatedBooks: 4,
      keyConcepts: 89,
      readingTime: 240,
      difficulty: 5
    },
    updatedAt: "2024-01-01T00:00:00Z",
    metadata: {
      sourceFlags: ["db", "markdown", "seed"],
      version: "1.0.0",
      lastReviewed: "2024-01-01T00:00:00Z"
    }
  },

  'jinkui-yaolue': {
    labels: {
      title: "Essential Prescriptions of the Golden Cabinet",
      description: "The classic work on internal medicine and miscellaneous diseases"
    },
    content: {
      id: "jinkui-yaolue",
      title: {
        en: "Essential Prescriptions of the Golden Cabinet",
        zh: "金匮要略"
      },
      dynasty: "Eastern Han",
      author: "Zhang Zhongjing",
      category: "shanghan",
      metadata: {
        dynasty: "Eastern Han",
        author: "Zhang Zhongjing",
        chapters: 25,
        wordCount: 28000,
        publishYear: "200",
        tags: ["Internal Medicine", "Miscellaneous Diseases", "Zhang Zhongjing", "Eastern Han Medicine", "Zang-Fu Theory"],
        coverImage: "/images/books/jinkui-yaolue-cover.jpg",
        difficulty: "High",
        influence: "Internal Medicine Foundation",
        preservation: "Good"
      },
      chapters: [
        {
          id: "zang-fu-bing",
          title: {
            en: "Zang-Fu Diseases",
            zh: "脏腑经络先后病脉证"
          },
          order: 0,
          summary: "Comprehensive discussion of zang-fu organ diseases",
          sections: [
            {
              id: "zang-fu-bing-1",
              title: "Zang-Fu Diseases Chapter One",
              order: 0,
              originalText: "问曰：上工治未病，中工治已病，何谓也？师曰：上工治未病者，见肝之病，知肝传脾，当先实脾。",
              translation: "Question: The superior physician treats not-yet-occurred diseases, the middle physician treats already-occurred diseases, what does this mean? The teacher said: The superior physician treating not-yet-occurred diseases means seeing liver disease, knowing it will transmit to the spleen, should first strengthen the spleen.",
              interpretation: "This chapter introduces the concept of preventive medicine and disease transmission patterns in Chinese medicine.",
              keyConcepts: [
                {
                  id: "preventive-medicine",
                  term: "Preventive Medicine",
                  description: "The concept of treating diseases before they manifest or progress",
                  category: "Preventive Theory",
                  relatedConcepts: ["Disease Transmission", "Zang-Fu Theory", "Five Elements"]
                }
              ]
            }
          ],
          keyConcepts: [
            {
              id: "zang-fu-theory",
              term: "Zang-Fu Theory",
              description: "The theoretical system describing the functions and relationships of internal organs",
              category: "Basic Theory",
              relatedConcepts: ["Organ Theory", "Five Elements", "Yin-Yang"]
            }
          ]
        }
      ],
      relatedBooks: ["huangdi-neijing", "shanghan-zabing-lun", "shanghan-lun", "zhong-zang-zang-fu-lun"],
      readingTime: {
        estimated: "3 hours",
        difficulty: "Advanced",
        prerequisites: ["Understanding of zang-fu theory", "Internal medicine knowledge", "Herbal medicine"]
      },
      studyNotes: {
        keyPoints: [
          "Focus on internal medicine",
          "Systematic zang-fu theory",
          "Comprehensive disease coverage",
          "Preventive medicine concepts"
        ],
        clinicalApplications: [
          "Treatment of internal diseases",
          "Zang-fu organ diagnosis",
          "Herbal prescriptions",
          "Preventive health measures"
        ],
        historicalSignificance: [
          "Classic of internal medicine",
          "Foundation of zang-fu theory",
          "Essential for clinical practice",
          "Influenced medical education"
        ]
      }
    },
    metrics: {
      totalChapters: 25,
      totalWords: 28000,
      totalSections: 398,
      relatedBooks: 4,
      keyConcepts: 89,
      readingTime: 180,
      difficulty: 5
    },
    updatedAt: "2024-01-01T00:00:00Z",
    metadata: {
      sourceFlags: ["db", "markdown", "seed"],
      version: "1.0.0",
      lastReviewed: "2024-01-01T00:00:00Z"
    }
  },

  'wenzhen-xue': {
    labels: {
      title: "Treatise on Warm-Febrile Diseases",
      description: "The representative work of the warm-disease school"
    },
    content: {
      id: "wenzhen-xue",
      title: {
        en: "Treatise on Warm-Febrile Diseases",
        zh: "温病条辨"
      },
      dynasty: "Qing",
      author: "Ye Tianshi",
      category: "warm-diseases",
      metadata: {
        dynasty: "Qing",
        author: "Ye Tianshi",
        chapters: 4,
        wordCount: 45000,
        publishYear: "1746",
        tags: ["Warm Diseases", "Ye Tianshi", "Qing Dynasty Medicine", "Warm-Febrile School", "Seasonal Diseases"],
        coverImage: "/images/books/wenzhen-xue-cover.jpg",
        difficulty: "High",
        influence: "Warm-Disease School Representative",
        preservation: "Excellent"
      },
      chapters: [
        {
          id: "wei-qi-ying-xue",
          title: {
            en: "Wei-Qi-Ying-Xue Theory",
            zh: "卫气营血学说"
          },
          order: 0,
          summary: "The theoretical foundation of warm-disease diagnosis and treatment",
          sections: [
            {
              id: "wei-qi-ying-xue-1",
              title: "Wei-Qi-Ying-Xue Theory Chapter One",
              order: 0,
              originalText: "温邪上受，首先犯肺，逆传心包。肺主气属卫，心主血属营。",
              translation: "Warm pathogens first attack from above, first affecting the lung, then retrogradely transmit to the pericardium. The lung governs qi and belongs to wei, the heart governs blood and belongs to ying.",
              interpretation: "This chapter establishes the core theory of warm-disease transmission through the four levels: wei, qi, ying, and xue.",
              keyConcepts: [
                {
                  id: "four-levels-theory",
                  term: "Four Levels Theory",
                  description: "The theoretical framework describing disease progression in warm diseases",
                  category: "Warm-Disease Theory",
                  relatedConcepts: ["Wei Level", "Qi Level", "Ying Level", "Xue Level"]
                }
              ]
            }
          ],
          keyConcepts: [
            {
              id: "warm-disease-theory",
              term: "Warm-Disease Theory",
              description: "The theoretical system for understanding and treating warm-epidemic diseases",
              category: "Epidemic Theory",
              relatedConcepts: ["Four Levels Theory", "Seasonal Diseases", "Epidemic Medicine"]
            }
          ]
        }
      ],
      relatedBooks: ["huangdi-neijing", "shanghan-zabing-lun", "wen-bing-lun", "yi-xue-ru-men"],
      readingTime: {
        estimated: "3 hours",
        difficulty: "Advanced",
        prerequisites: ["Understanding of warm-disease theory", "Four levels theory", "Epidemic medicine"]
      },
      studyNotes: {
        keyPoints: [
          "Representative work of warm-disease school",
          "Four levels theory establishment",
          "Seasonal disease treatment",
          "Integration with previous theories"
        ],
        clinicalApplications: [
          "Treatment of warm-epidemic diseases",
          "Four levels diagnosis",
          "Seasonal disease protocols",
          "Epidemic prevention"
        ],
        historicalSignificance: [
          "Classic of warm-disease school",
          "Established four levels theory",
          "Influenced epidemic medicine",
          "Essential for seasonal diseases"
        ]
      }
    },
    metrics: {
      totalChapters: 4,
      totalWords: 45000,
      totalSections: 398,
      relatedBooks: 4,
      keyConcepts: 89,
      readingTime: 180,
      difficulty: 5
    },
    updatedAt: "2024-01-01T00:00:00Z",
    metadata: {
      sourceFlags: ["db", "markdown", "seed"],
      version: "1.0.0",
      lastReviewed: "2024-01-01T00:00:00Z"
    }
  },

  'yixue-rumen': {
    labels: {
      title: "Introduction to Medicine",
      description: "A comprehensive medical textbook for beginners"
    },
    content: {
      id: "yixue-rumen",
      title: {
        en: "Introduction to Medicine",
        zh: "医学入门"
      },
      dynasty: "Ming",
      author: "Li Chan",
      category: "comprehensive",
      metadata: {
        dynasty: "Ming",
        author: "Li Chan",
        chapters: 7,
        wordCount: 85000,
        publishYear: "1575",
        tags: ["Medical Education", "Comprehensive Medicine", "Li Chan", "Ming Dynasty Medicine", "Medical Textbook"],
        coverImage: "/images/books/yixue-rumen-cover.jpg",
        difficulty: "Low",
        influence: "Medical Education Classic",
        preservation: "Excellent"
      },
      chapters: [
        {
          id: "yi-xue-yuan-liu",
          title: {
            en: "Origin and Development of Medicine",
            zh: "医学源流"
          },
          order: 0,
          summary: "Historical development and theoretical foundations of Chinese medicine",
          sections: [
            {
              id: "yi-xue-yuan-liu-1",
              title: "Medical Origin Chapter One",
              order: 0,
              originalText: "医者，意也。意者，心之所之也。心有所之，谓之医。",
              translation: "Medicine means intention. Intention is what the mind holds. When the mind holds something, it is called medicine.",
              interpretation: "This chapter explores the philosophical foundation of medicine as the intention or will to heal.",
              keyConcepts: [
                {
                  id: "medical-intention",
                  term: "Medical Intention",
                  description: "The philosophical understanding of medicine as healing intention",
                  category: "Medical Philosophy",
                  relatedConcepts: ["Medical Ethics", "Healing Arts", "Mind-Body Connection"]
                }
              ]
            }
          ],
          keyConcepts: [
            {
              id: "medical-philosophy",
              term: "Medical Philosophy",
              description: "The theoretical and philosophical foundations of medical practice",
              category: "Medical Theory",
              relatedConcepts: ["Medical Ethics", "Healing Principles", "Mind-Body Medicine"]
            }
          ]
        }
      ],
      relatedBooks: ["huangdi-neijing", "nan-jing", "shanghan-zabing-lun", "yi-xue-zong-zong"],
      readingTime: {
        estimated: "2 hours",
        difficulty: "Beginner",
        prerequisites: ["Basic medical interest", "Understanding of Chinese culture", "Medical ethics"]
      },
      studyNotes: {
        keyPoints: [
          "Comprehensive medical textbook",
          "Systematic knowledge organization",
          "Educational approach",
          "Medical ethics integration"
        ],
        clinicalApplications: [
          "Foundation for medical study",
          "Reference for beginners",
          "Educational resource",
          "Medical ethics guide"
        ],
        historicalSignificance: [
          "Important medical textbook",
          "Educational innovation",
          "Medical ethics emphasis",
          "Influenced medical education"
        ]
      }
    },
    metrics: {
      totalChapters: 7,
      totalWords: 85000,
      totalSections: 398,
      relatedBooks: 4,
      keyConcepts: 89,
      readingTime: 120,
      difficulty: 1
    },
    updatedAt: "2024-01-01T00:00:00Z",
    metadata: {
      sourceFlags: ["db", "markdown", "seed"],
      version: "1.0.0",
      lastReviewed: "2024-01-01T00:00:00Z"
    }
  }
};

// 创建目录（如果不存在）
const outputDir = path.join(__dirname, '../src/data/snapshots/en/content/ancient-books');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 生成文件
console.log('开始生成剩余书籍数据文件...');

Object.entries(remainingBooks).forEach(([bookId, bookData]) => {
  const filePath = path.join(outputDir, `${bookId}.json`);
  
  try {
    fs.writeFileSync(filePath, JSON.stringify(bookData, null, 2), 'utf8');
    console.log(`✅ 成功创建: ${bookId}.json`);
  } catch (error) {
    console.error(`❌ 创建失败: ${bookId}.json`, error.message);
  }
});

console.log('🎉 剩余书籍数据文件生成完成!');
