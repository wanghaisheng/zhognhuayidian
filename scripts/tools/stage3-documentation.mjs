#!/usr/bin/env node

/**
 * 第三阶段：文档完善
 * 为每个子目录创建详细的 README 和使用指南
 */

import fs from 'fs';
import path from 'path';

const scriptsDir = path.resolve(process.cwd(), 'scripts');

console.log('📚 开始第三阶段：文档完善...');

// 子目录配置
const subDirectories = [
  {
    name: 'generate',
    title: '生成脚本',
    description: '用于生成项目数据、路由、快照等的脚本集合',
    usage: 'node scripts/generate/[script-name]',
    examples: [
      'node scripts/generate/generate-routes.ts',
      'node scripts/generate/generate-snapshots.mjs'
    ]
  },
  {
    name: 'check', 
    title: '检查脚本',
    description: '用于检查代码质量、链接、国际化等的脚本集合',
    usage: 'node scripts/check/[script-name]',
    examples: [
      'node scripts/check/check-hardcode.cjs',
      'node scripts/check/check-links.mjs'
    ]
  },
  {
    name: 'data',
    title: '数据处理脚本', 
    description: '用于数据迁移、对齐、转换等的脚本集合',
    usage: 'node scripts/data/[script-name]',
    examples: [
      'node scripts/data/align-book-data-structure.cjs',
      'node scripts/data/migrate-html-data.ts'
    ]
  },
  {
    name: 'utils',
    title: '工具脚本',
    description: '用于构建、优化、监控等的工具脚本集合',
    usage: 'node scripts/utils/[script-name]', 
    examples: [
      'node scripts/utils/post-build.js',
      'node scripts/utils/setup-build-optimization.js'
    ]
  },
  {
    name: 'archive',
    title: '归档脚本',
    description: '已废弃的脚本，保留作为参考',
    usage: '参考 docs/i18n/ 目录中的文档',
    examples: [
      '这些脚本已被新的实现替代',
      '请使用 i18n/ 目录下的国际化脚本'
    ]
  }
];

// 创建子目录 README
let createdReadmes = 0;

subDirectories.forEach(dir => {
  const dirPath = path.join(scriptsDir, dir.name);
  
  if (fs.existsSync(dirPath)) {
    const readmeContent = `# ${dir.title}

${dir.description}

## 🚀 使用方法

\`\`\`bash
${dir.usage}
\`\`\`

## 📋 脚本列表

${dir.examples.map(example => `- \`${example}\``).join('\n')}

## 📖 相关文档

- [主文档](../README.md)
- [国际化脚本](../i18n/README.md)
- [治理报告](../FINAL_GOVERNANCE_SUMMARY.md)

## ⚠️ 注意事项

- 运行前请确保 Node.js 版本 >= 16
- 部分脚本可能需要特定的依赖
- 请在项目根目录下运行脚本

## 🐛 故障排除

如果遇到问题，请检查：
1. Node.js 版本是否符合要求
2. 是否在正确的目录下运行
3. 是否有必要的权限

---

*最后更新: ${new Date().toISOString()}*
`;

    const readmePath = path.join(dirPath, 'README.md');
    fs.writeFileSync(readmePath, readmeContent, 'utf8');
    createdReadmes++;
    console.log(`✅ 创建 README: ${dir.name}/README.md`);
  }
});

// 创建脚本索引文件
const createScriptIndex = () => {
  const scriptIndex = {
    title: 'Scripts 目录索引',
    description: '所有脚本的快速索引和使用指南',
    lastUpdated: new Date().toISOString(),
    categories: subDirectories.map(dir => ({
      name: dir.name,
      title: dir.title,
      description: dir.description,
      path: `scripts/${dir.name}/`,
      scriptCount: fs.existsSync(path.join(scriptsDir, dir.name)) 
        ? fs.readdirSync(path.join(scriptsDir, dir.name)).filter(f => 
            (f.endsWith('.js') || f.endsWith('.mjs') || f.endsWith('.ts') || f.endsWith('.cjs'))
          ).length
        : 0
    })),
    quickReference: {
      '国际化检查': 'npm run check:hardcode',
      '链接检查': 'node scripts/check/check-links.mjs',
      '数据生成': 'node scripts/generate/generate-routes.ts',
      '构建优化': 'node scripts/utils/post-build.js'
    },
    bestPractices: [
      '始终在项目根目录运行脚本',
      '运行前备份重要数据',
      '定期检查脚本输出',
      '使用版本控制跟踪更改'
    ]
  };

  const indexPath = path.join(scriptsDir, 'SCRIPT_INDEX.json');
  fs.writeFileSync(indexPath, JSON.stringify(scriptIndex, null, 2), 'utf8');
  console.log('✅ 创建脚本索引: SCRIPT_INDEX.json');
};

createScriptIndex();

// 创建最佳实践指南
const bestPracticesContent = `# Scripts 最佳实践指南

## 🎯 开发规范

### 1. 脚本命名
- 使用 kebab-case 命名
- 功能描述性名称
- 包含版本号信息

### 2. 错误处理
- 完整的 try-catch 包装
- 详细的错误日志
- 优雅的失败处理

### 3. 文档要求
- 每个脚本都有使用说明
- 包含参数说明
- 提供使用示例

## 🚀 使用指南

### 运行环境
- Node.js >= 16.0.0
- 在项目根目录运行
- 确保有必要的权限

### 常用命令
\`\`\`bash
# 检查硬编码
npm run check:hardcode

# 生成路由
node scripts/generate/generate-routes.ts

# 检查链接
node scripts/check/check-links.mjs
\`\`\`

## 🔧 维护指南

### 定期任务
- [ ] 每月检查脚本有效性
- [ ] 季度更新依赖版本
- [ ] 年度清理废弃脚本

### 版本管理
- 使用语义化版本号
- 记录重要变更
- 维护变更日志

## 📚 相关资源

- [Node.js 最佳实践](https://nodejs.org/en/docs/guides/)
- [JavaScript 标准](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [项目文档](../README.md)

---

*创建时间: ${new Date().toISOString()}*
`;

const practicesPath = path.join(scriptsDir, 'BEST_PRACTICES.md');
fs.writeFileSync(practicesPath, bestPracticesContent, 'utf8');
console.log('✅ 创建最佳实践指南: BEST_PRACTICES.md');

// 生成第三阶段报告
const stage3Report = {
  stage: '第三阶段 - 文档完善',
  createdReadmes,
  createdIndex: 1,
  createdPractices: 1,
  timestamp: new Date().toISOString(),
  deliverables: [
    '各子目录 README.md',
    'SCRIPT_INDEX.json', 
    'BEST_PRACTICES.md'
  ]
};

fs.writeFileSync(
  path.join(scriptsDir, 'STAGE3_REPORT.json'),
  JSON.stringify(stage3Report, null, 2),
  'utf8'
);

console.log('\n📊 生成第三阶段报告: STAGE3_REPORT.json');
console.log(`\n🎉 第三阶段完成！`);
console.log(`✅ 创建 README: ${createdReadmes} 个`);
console.log('✅ 创建索引和指南文档');

// 创建最终总结
const finalSummary = {
  project: 'Scripts 目录治理',
  stages: [
    {
      name: '第一阶段',
      description: '脚本迁移',
      status: '✅ 已完成',
      result: '分类移动到对应目录'
    },
    {
      name: '第二阶段', 
      description: '清理和归档',
      status: '✅ 已完成',
      result: '清理临时文件，归档废弃脚本'
    },
    {
      name: '第三阶段',
      description: '文档完善', 
      status: '✅ 已完成',
      result: '创建完整文档体系'
    }
  ],
  totalImprovement: '建立了规范的脚本管理体系，提升了代码组织性和维护性',
  nextSteps: [
    '持续监控脚本使用情况',
    '定期更新文档',
    '优化脚本性能'
  ],
  completionDate: new Date().toISOString()
};

fs.writeFileSync(
  path.join(scriptsDir, 'FINAL_COMPLETION_REPORT.json'),
  JSON.stringify(finalSummary, null, 2),
  'utf8'
);

console.log('\n🎊 生成最终完成报告: FINAL_COMPLETION_REPORT.json');
console.log('\n🏆 Scripts 目录治理圆满完成！');
