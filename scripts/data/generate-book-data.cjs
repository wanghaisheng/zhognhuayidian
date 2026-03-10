// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.338Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

// 书籍数据定义
const booksData = {
  'shanghan-zabing-lun': {
    labels: {
      title: "Treatise on Cold Damage and Miscellaneous Diseases",
      description: "The foundational work of syndrome differentiation and treatment in Chinese medicine"
    },
    content: {
      id: "shanghan-zabing-lun",
      title: {
        en: "Treatise on Cold Damage and Miscellaneous Diseases",
        zh: "伤寒杂病论"
      },
      dynasty: "Eastern Han",
      author: "Zhang Zhongjing",
      category: "shanghan",
      metadata: {
        dynasty: "Eastern Han",
        author: "Zhang Zhongjing",
        chapters: 16,
        wordCount: 45000,
        publishYear: "200",
        tags: ["Cold Damage", "Miscellaneous Diseases", "Syndrome Differentiation", "Zhang Zhongjing", "Eastern Han Medicine"],
        coverImage: "/images/books/shanghan-zabing-lun-cover.jpg",
        difficulty: "High",
        influence: "Foundation of Syndrome Differentiation and Treatment",
        preservation: "Good"
      },
      chapters: [
        {
          id: "taiyang-bing",
          title: {
            en: "Taiyang Disease Patterns",
            zh: "太阳病脉证并治"
          },
          order: 0,
          summary: "Discusses the diagnosis and treatment of Taiyang disease patterns",
          sections: [
            {
              id: "taiyang-bing-1",
              title: "Taiyang Disease Chapter One",
              order: 0,
              originalText: "太阳之为病，脉浮，头项强痛而恶寒。太阳病，发热汗出者，恶风也，其脉缓者，名为中风。太阳病，或已发热，或未发热，必恶寒，体痛呕逆，脉阴阳俱紧者，名为伤寒。",
              translation: "When Taiyang is diseased, the pulse is floating, there is stiffness and pain in the head and neck, and aversion to cold. In Taiyang disease with fever and sweating, there is aversion to wind; when the pulse is slow, it is called wind strike. In Taiyang disease, whether there is already fever or not yet, there is necessarily aversion to cold, body pain, vomiting, and when both yin and yang pulses are tight, it is called cold damage.",
              interpretation: "This chapter establishes the basic diagnostic criteria for Taiyang disease patterns, which represent the exterior stage of disease according to the six meridian theory.",
              keyConcepts: [
                {
                  id: "taiyang-disease",
                  term: "Taiyang Disease",
                  description: "The first stage of six meridian disease progression, representing exterior patterns",
                  category: "Six Meridians",
                  relatedConcepts: ["Yangming Disease", "Shaoyang Disease", "Cold Damage"]
                }
              ]
            }
          ],
          keyConcepts: [
            {
              id: "six-meridians",
              term: "Six Meridians Theory",
              description: "A theoretical framework for disease progression and treatment in Chinese medicine",
              category: "Basic Theory",
              relatedConcepts: ["Syndrome Differentiation", "Cold Damage", "Exterior-Interior"]
            }
          ]
        }
      ],
      relatedBooks: ["huangdi-neijing", "shanghan-lun", "jinkui-yaolue", "bencao-gangmu"],
      readingTime: {
        estimated: "6 hours",
        difficulty: "Advanced",
        prerequisites: ["Understanding of six meridians theory", "Basic diagnostic methods", "Herbal medicine knowledge"]
      },
      studyNotes: {
        keyPoints: [
          "Established the foundation of syndrome differentiation and treatment",
          "Created the six meridian diagnostic system",
          "Systematically organized treatment principles for cold damage",
          "Integrated diagnosis and treatment methodology"
        ],
        clinicalApplications: [
          "Treatment of acute febrile diseases",
          "Foundation for herbal formula prescriptions",
          "Diagnostic principles for exterior and interior patterns",
          "Treatment protocols for various disease stages"
        ],
        historicalSignificance: [
          "First comprehensive work on clinical medicine",
          "Established evidence-based medicine approach",
          "Influenced medical practice for over 1800 years",
          "Foundation of all clinical schools in Chinese medicine"
        ]
      }
    },
    metrics: {
      totalChapters: 16,
      totalWords: 45000,
      totalSections: 398,
      relatedBooks: 4,
      keyConcepts: 89,
      readingTime: 360,
      difficulty: 5
    },
    updatedAt: "2024-01-01T00:00:00Z",
    metadata: {
      sourceFlags: ["db", "markdown", "seed"],
      version: "1.0.0",
      lastReviewed: "2024-01-01T00:00:00Z"
    }
  },
  
  'bencao-gangmu': {
    labels: {
      title: "Compendium of Materia Medica",
      description: "The most comprehensive pharmacological work in Chinese medical history"
    },
    content: {
      id: "bencao-gangmu",
      title: {
        en: "Compendium of Materia Medica",
        zh: "本草纲目"
      },
      dynasty: "Ming",
      author: "Li Shizhen",
      category: "materia-medica",
      metadata: {
        dynasty: "Ming",
        author: "Li Shizhen",
        chapters: 52,
        wordCount: 1900000,
        publishYear: "1596",
        tags: ["Pharmacology", "Materia Medica", "Li Shizhen", "Ming Dynasty Medicine", "Drug Classification"],
        coverImage: "/images/books/bencao-gangmu-cover.jpg",
        difficulty: "Medium",
        influence: "Comprehensive Pharmacological Masterpiece",
        preservation: "Excellent"
      },
      chapters: [
        {
          id: "shui-bu",
          title: {
            en: "Water Section",
            zh: "水部"
          },
          order: 0,
          summary: "Discusses various types of water and their medicinal properties",
          sections: [
            {
              id: "shui-bu-1",
              title: "Water Section Chapter One",
              order: 0,
              originalText: "天水为一，地水为二，人之水为三。水为万物之源，水为百药之长。",
              translation: "Heavenly water is one, earthly water is two, human water is three. Water is the source of all things, water is the chief of all medicines.",
              interpretation: "This chapter establishes the fundamental importance of water in both nature and medicine, reflecting the holistic view of Chinese pharmacology.",
              keyConcepts: [
                {
                  id: "water-source",
                  term: "Water as Source",
                  description: "The fundamental role of water in nature and medicine",
                  category: "Basic Theory",
                  relatedConcepts: ["Five Elements", "Yin-Yang", "Pharmacology"]
                }
              ]
            }
          ],
          keyConcepts: [
            {
              id: "water-classification",
              term: "Water Classification",
              description: "Classification of different types of water based on their properties and uses",
              category: "Pharmacology",
              relatedConcepts: ["Drug Properties", "Medicinal Water", "Natural Sources"]
            }
          ]
        }
      ],
      relatedBooks: ["huangdi-neijing", "shen-nong-ben-cao-jing", "qianjin-fang", "bencao-jing-jizhu"],
      readingTime: {
        estimated: "40 hours",
        difficulty: "Intermediate",
        prerequisites: ["Basic knowledge of Chinese pharmacology", "Understanding of drug properties", "Herbal medicine basics"]
      },
      studyNotes: {
        keyPoints: [
          "Comprehensive collection of 1892 medicinal substances",
          "Systematic classification of drugs by nature and properties",
          "Detailed descriptions of drug processing and preparation",
          "Integration of previous pharmacological works"
        ],
        clinicalApplications: [
          "Foundation for modern Chinese materia medica",
          "Reference for herbal formula composition",
          "Guide to drug processing and preparation",
          "Source for pharmacological research"
        ],
        historicalSignificance: [
          "Most comprehensive pharmacological work in Chinese history",
          "Influenced pharmacology worldwide",
          "Standardized drug classification system",
          "Bridge between traditional and modern pharmacology"
        ]
      }
    },
    metrics: {
      totalChapters: 52,
      totalWords: 1900000,
      totalSections: 1892,
      relatedBooks: 4,
      keyConcepts: 11096,
      readingTime: 2400,
      difficulty: 3
    },
    updatedAt: "2024-01-01T00:00:00Z",
    metadata: {
      sourceFlags: ["db", "markdown", "seed"],
      version: "1.0.0",
      lastReviewed: "2024-01-01T00:00:00Z"
    }
  },
  
  'qianjin-fang': {
    labels: {
      title: "Thousand Golden Prescriptions",
      description: "The first comprehensive clinical encyclopedia in Chinese medical history"
    },
    content: {
      id: "qianjin-fang",
      title: {
        en: "Thousand Golden Prescriptions",
        zh: "千金要方"
      },
      dynasty: "Tang",
      author: "Sun Simiao",
      category: "prescriptions",
      metadata: {
        dynasty: "Tang",
        author: "Sun Simiao",
        chapters: 30,
        wordCount: 680000,
        publishYear: "652",
        tags: ["Prescriptions", "Clinical Medicine", "Sun Simiao", "Tang Dynasty Medicine", "Medical Encyclopedia"],
        coverImage: "/images/books/qianjin-fang-cover.jpg",
        difficulty: "Medium",
        influence: "Clinical Medicine Encyclopedia",
        preservation: "Good"
      },
      chapters: [
        {
          id: "fu-ren-bing",
          title: {
            en: "Women's Diseases",
            zh: "妇人方"
          },
          order: 0,
          summary: "Comprehensive discussion of gynecological and obstetric diseases",
          sections: [
            {
              id: "fu-ren-bing-1",
              title: "Women's Diseases Chapter One",
              order: 0,
              originalText: "妇人者，众阴所集也。阴者，静也，藏也。故妇人病多，多于男子。",
              translation: "Women are the gathering of all yin. Yin is quiet, it is storage. Therefore, women have more illnesses than men.",
              interpretation: "This reflects the understanding of women's unique physiology in Chinese medicine and the need for specialized treatment approaches.",
              keyConcepts: [
                {
                  id: "yin-nature",
                  term: "Yin Nature of Women",
                  description: "The physiological characteristics of women from the perspective of yin-yang theory",
                  category: "Gynecology",
                  relatedConcepts: ["Yin-Yang Theory", "Women's Physiology", "Gynecological Treatment"]
                }
              ]
            }
          ],
          keyConcepts: [
            {
              id: "women-specialization",
              term: "Women's Medical Specialization",
              description: "The specialized approach to women's health in Chinese medicine",
              category: "Clinical Medicine",
              relatedConcepts: ["Gynecology", "Obstetrics", "Women's Health"]
            }
          ]
        }
      ],
      relatedBooks: ["huangdi-neijing", "shanghan-zabing-lun", "qianjin-yifang", "fu-ren-da-quan"],
      readingTime: {
        estimated: "20 hours",
        difficulty: "Intermediate",
        prerequisites: ["Basic clinical medicine knowledge", "Understanding of prescriptions", "Medical ethics knowledge"]
      },
      studyNotes: {
        keyPoints: [
          "First comprehensive clinical encyclopedia",
          "Systematic organization by medical specialties",
          "Integration of ethics and medical practice",
          "Comprehensive collection of 5300+ prescriptions"
        ],
        clinicalApplications: [
          "Foundation for clinical practice",
          "Reference for prescription formulation",
          "Guide to medical ethics and practice",
          "Source for various medical specialties"
        ],
        historicalSignificance: [
          "First medical encyclopedia in world history",
          "Established clinical medicine standards",
          "Integrated ethics into medical practice",
          "Influenced medical education for centuries"
        ]
      }
    },
    metrics: {
      totalChapters: 30,
      totalWords: 680000,
      totalSections: 5300,
      relatedBooks: 4,
      keyConcepts: 234,
      readingTime: 1200,
      difficulty: 3
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
console.log('开始生成书籍数据文件...');

Object.entries(booksData).forEach(([bookId, bookData]) => {
  const filePath = path.join(outputDir, `${bookId}.json`);
  
  try {
    fs.writeFileSync(filePath, JSON.stringify(bookData, null, 2), 'utf8');
    console.log(`✅ 成功创建: ${bookId}.json`);
  } catch (error) {
    console.error(`❌ 创建失败: ${bookId}.json`, error.message);
  }
});

console.log('🎉 书籍数据文件生成完成!');
