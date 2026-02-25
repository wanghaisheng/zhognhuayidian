# UI Specification: Ancient Book Detail Page

## User Interface Requirements

### 1. Page Structure
```
┌─────────────────────────────────────────────────────────────┐
│ Header (Book Info)                                            │
├─────────────────────────────────────────────────────────────┤
│ Navigation Sidebar │           Main Content Area              │
│                    │                                       │
│ • Chapter List    │  ┌─────────────────────────────────────┐ │
│ • Search          │  │  Chapter Title                      │ │
│ • Bookmarks       │  └─────────────────────────────────────┘ │
│ • Notes           │  ┌─────────────────────────────────────┐ │
│                    │  │  Original Text (古籍原文)            │ │
│                    │  │  Translation (白话译文)              │ │
│                    │  │  Interpretation (现代解读)            │ │
│                    │  └─────────────────────────────────────┘ │
│                    │  ┌─────────────────────────────────────┐ │
│                    │  │  Related Concepts & Knowledge Graph   │ │
│                    │  └─────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Footer (Related Books, Actions)                              │
└─────────────────────────────────────────────────────────────┘
```

### 2. Core Components

#### 2.1 Book Header
- **Book Title**: 古籍名称（中文/英文）
- **Meta Information**: 朝代、作者、成书年代、分类
- **Reading Progress**: 阅读进度条
- **Action Buttons**: 收藏、分享、导出

#### 2.2 Navigation Sidebar
- **Chapter Tree**: 章节树形导航
- **Search Box**: 全书搜索
- **Bookmarks List**: 用户书签
- **Notes List**: 用户笔记

#### 2.3 Content Viewer
- **Tab Navigation**: 原文/译文/解读切换
- **Text Display**: 支持繁简体切换
- **Highlight System**: 关键词高亮
- **Annotation Tool**: 添加注释功能

#### 2.4 Knowledge Graph
- **Concept Map**: 概念关系图谱
- **Herb Network**: 药材关系网络
- **Interactive Elements**: 可点击的知识节点

### 3. Responsive Design

#### 3.1 Desktop (≥1200px)
- **Layout**: 侧边栏 + 主内容区
- **Sidebar Width**: 280px (可折叠)
- **Content Max Width**: 800px
- **Font Size**: 16px (可调节)

#### 3.2 Tablet (768px - 1199px)
- **Layout**: 可折叠侧边栏
- **Sidebar**: 抽屉式设计
- **Content**: 全宽显示
- **Font Size**: 15px

#### 3.3 Mobile (<768px)
- **Layout**: 单列布局
- **Navigation**: 底部标签栏
- **Content**: 全屏阅读模式
- **Font Size**: 14px

### 4. Interaction Patterns

#### 4.1 Reading Experience
- **Smooth Scrolling**: 平滑滚动到章节
- **Auto Save**: 自动保存阅读位置
- **Gesture Support**: 手势操作（滑动翻页）
- **Focus Mode**: 专注阅读模式

#### 4.2 Content Interaction
- **Word Selection**: 文字选择显示解释
- **Double Click**: 双击添加笔记
- **Long Press**: 长按显示菜单
- **Drag & Drop**: 拖拽书签重排

#### 4.3 Social Features
- **Note Sharing**: 笔记分享功能
- **Discussion**: 章节讨论区
- **Expert Q&A**: 专家答疑
- **Reading Groups**: 读书小组

### 5. Accessibility

#### 5.1 Screen Reader Support
- **Semantic HTML**: 语义化HTML结构
- **ARIA Labels**: 完整的ARIA标签
- **Keyboard Navigation**: 键盘导航支持
- **High Contrast**: 高对比度模式

#### 5.2 Visual Accessibility
- **Font Scaling**: 字体缩放支持
- **Color Blind**: 色盲友好设计
- **Reduced Motion**: 减少动画选项
- **Focus Indicators**: 清晰的焦点指示

### 6. Performance Requirements

#### 6.1 Loading Performance
- **Initial Load**: < 2秒首屏加载
- **Chapter Switch**: < 500ms章节切换
- **Search Response**: < 300ms搜索响应
- **Image Loading**: 渐进式图片加载

#### 6.2 Memory Management
- **Content Caching**: 智能内容缓存
- **Lazy Loading**: 懒加载非关键内容
- **Virtual Scrolling**: 长文本虚拟滚动
- **Memory Limit**: < 100MB内存使用

### 7. Error Handling

#### 7.1 Content Errors
- **Missing Content**: 优雅处理缺失内容
- **Corrupted Data**: 数据损坏提示
- **Network Issues**: 网络错误重试
- **Fallback Content**: 降级内容显示

#### 7.2 User Errors
- **Invalid Navigation**: 无效导航处理
- **Search No Results**: 搜索无结果提示
- **Save Failures**: 保存失败重试
- **Permission Issues**: 权限错误提示
