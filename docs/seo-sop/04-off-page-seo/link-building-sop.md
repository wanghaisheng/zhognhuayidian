# 外链建设SOP

> "Backlinks remain one of the strongest ranking signals." — 外链仍是最强排名信号之一。

## 📋 外链建设策略概览

### 目标外链类型

| 外链类型 | 优先级 | 目标数量/月 | 难度 |
|---------|-------|------------|------|
| 行业权威站点 | P0 | 2-3 | 高 |
| 医疗设备目录站 | P0 | 5-10 | 中 |
| Guest Post | P1 | 3-5 | 中 |
| HARO/记者请求 | P1 | 5-8 | 中 |
| 资源页链接 | P2 | 5-10 | 低 |
| 合作伙伴链接 | P2 | 2-3 | 低 |

### 外链质量评估标准

```
✅ 高质量外链特征：
- DR/DA ≥ 40
- 相关性高（医疗、设备、B2B行业）
- 真实流量（非纯链接农场）
- DoFollow（优先）
- 锚文本自然多样

❌ 避免的外链：
- PBN（私人博客网络）
- 付费链接（违反Google指南）
- 无关站点（赌博、成人等）
- 链接农场
- 自动化批量外链
```

---

## 🎯 外链获取渠道与执行

### 1. HARO (Help A Reporter Out)

**执行频率**: 每日查看，每周回复5-8次

**订阅设置**:
- 注册: https://www.helpareporter.com/
- 订阅类别: Healthcare, Technology, Business
- 接收时间: 5:35am, 12:35pm, 5:35pm EST

**回复流程**:
1. 筛选相关请求（医疗设备、中国制造、B2B贸易）
2. 使用模板快速响应（见 `haro-outreach-template.md`）
3. 24小时内回复（越快越好）
4. 追踪发布情况

**成功率预期**: 5-10%

### 2. Guest Posting

**目标站点类型**:
- 医疗设备行业博客
- B2B贸易资讯站
- 医院管理媒体
- 健康科技网站

**Pitch流程**:
1. 研究目标站点内容风格
2. 发送个性化Pitch（见 `guest-post-pitch-template.md`）
3. 提供3-5个话题选项
4. 撰写高质量原创内容
5. 包含1-2个自然的回链

**成功率预期**: 10-20%

### 3. 行业目录提交

**优先目录列表**: 见 `directory-submission-list.md`

**提交信息准备**:
```
公司名称: [品牌名]
网站URL: https://chinactscanner.org
描述: Leading platform for Chinese CT and MRI scanner information...
类别: Medical Equipment, Imaging Devices, Healthcare Technology
联系邮箱: info@chinactscanner.org
```

### 4. 资源页链接建设

**寻找方法**:
```
Google搜索运算符:
- "medical imaging" + "resources"
- "CT scanner" + "useful links"
- "healthcare equipment" + "directory"
- "radiology" + "recommended sites"
```

**外联模板**:
```
Subject: Suggested Addition to Your [Resource Page Topic]

Hi [Name],

I noticed your helpful resource page on [topic]. 

I wanted to suggest adding [our specific resource] which covers [value proposition].

It might be valuable for your readers who are interested in [specific benefit].

Best,
[Name]
```

### 5. 竞品外链分析

**工具**: Ahrefs, Semrush, Moz

**分析流程**:
1. 输入竞争对手域名
2. 导出外链数据
3. 筛选DR≥30的链接
4. 分析链接来源类型
5. 复制可获取的链接机会

**重点分析对象**:
- medicalexpo.com
- dotmed.com
- 主要竞品网站

---

## 📊 外链追踪与管理

### 追踪表格结构

| 字段 | 说明 |
|-----|------|
| target_url | 目标页面URL |
| target_site | 目标站点域名 |
| dr_da | 域名权重 |
| contact_email | 联系邮箱 |
| outreach_date | 外联日期 |
| status | 状态（待联系/已发送/已回复/已获取/已拒绝） |
| link_type | 链接类型（Guest Post/Directory/Resource等） |
| anchor_text | 锚文本 |
| link_url | 获取的链接URL |
| dofollow | 是否DoFollow |
| acquired_date | 获取日期 |
| notes | 备注 |

### 月度外链报告

```markdown
## 月度外链报告 - [YYYY-MM]

### 概览
- 新增外链数: XX
- 新增引荐域: XX
- 平均DR: XX
- DoFollow比例: XX%

### 外链来源分布
- Guest Post: XX个
- HARO: XX个
- 目录提交: XX个
- 资源页: XX个
- 其他: XX个

### 锚文本分布
- 品牌词: XX%
- 产品词: XX%
- 通用词: XX%
- 裸URL: XX%

### 下月目标
- [具体目标1]
- [具体目标2]
```

---

## ⚠️ 风险控制

### 外链增长速度

```
安全增长范围:
- 新站（<6个月）: 5-15 links/月
- 成长站（6-24个月）: 15-30 links/月
- 成熟站（>24个月）: 30-50+ links/月

警告信号:
- 单日新增>20个外链
- 单一锚文本占比>30%
- 低质量外链突然增加
```

### 锚文本多样性

```
理想锚文本分布:
- 品牌词（China CT Scanner等）: 30-40%
- URL/裸链接: 20-25%
- 通用词（click here, learn more）: 15-20%
- 长尾/自然短语: 10-15%
- 精确匹配关键词: 5-10%
```

### 外链审计（季度）

**检查项目**:
- [ ] 识别有毒外链（Spam Score高）
- [ ] 检查丢失的外链
- [ ] 分析竞品新增外链
- [ ] 更新外链追踪表
- [ ] 必要时使用Disavow工具

---

## 🔗 相关文档

- [HARO回复模板](./haro-outreach-template.md)
- [Guest Post Pitch模板](./guest-post-pitch-template.md)
- [目录提交清单](./directory-submission-list.md)

---

**文档版本**: v1.0  
**创建日期**: 2026-01-03  
**负责人**: SEO Team
