请扮演一个UI/UX资产分析师的角色。您的任务是将以下提供的移动应用程序页面详细描述文本，转换为结构化的CSV格式。

**目标CSV格式:**

CSV文件应包含以下列，并严格遵循逗号分隔规则（如果字段内包含逗号或双引号，请用双引号括起来）：

1.  **序号 (Sequence Number):** 每行的唯一整数标识，从1开始递增。
2.  **页面名称 (Page Name):** 该行所属的页面名称（例如：“主界面 / 花园页”，“日记记录/回顾页”）。对于同一页面的所有行，此值应相同。
3.  **章节名称 (Section Name):** 页面内的具体章节或区域名称（例如：“顶部导航栏”，“中心内容区域 - 感恩植物”，“日历进度追踪器”，“底部菜单栏”，“操作按钮”）。对于描述具体素材的行，此值应为其所属的章节名称。
4.  **章节/素材描述 (Section/Asset Description):**
    *   对于描述章节的行：提供该章节的整体功能和内容概述。
    *   对于描述素材的行：提供该具体素材的用途或说明（例如：“玩家头像图标”，“连续签到计数器显示”，“绿色勾选图标表示完成”，“3D收集罐模型”，“用于生成日记画卷的按钮”）。
5.  **素材类型 (Asset Type):** (仅素材行填写) 指明素材的类型，例如：Icon, Image, Banner, Video, 3D Model, Button, Background, Text Style, Animation Effect, Sound Effect。章节描述行留空。
6.  **建议尺寸/规格 (Suggested Size/Specs):** (仅素材行填写) 提供素材的建议尺寸（如 "24x24px", "Full Width", "1080p"）、格式或其他规格。章节描述行留空。
7.  **布局/位置说明 (Layout/Position Info):** (仅素材行填写) 描述素材在章节内的相对位置或布局要求（如 "Top Left Corner", "Center of Cell", "Below Title", "Placeholder within Jar Area", "Fixed Bottom"). 章节描述行留空。
8.  **生成Prompt/设计说明 (Generation Prompt/Design Notes):** (仅素材行填写) 如果素材需要AI生成，请提供具体的生成Prompt。如果不需要AI生成或Prompt未知，请提供关键的设计说明、视觉要求或引用（如 "Use Warm Sand #F7F3E9", "Shake animation", "Referencing generated image example", "Standard back arrow icon", "Subtle glow effect"). 章节描述行留空。

**处理规则:**

1.  仔细阅读提供的页面描述文本。
2.  为每个页面确定其包含的主要章节/区域。
3.  为每个章节创建一行CSV记录，填写序号、页面名称、章节名称、章节整体描述，并将素材相关列（5-8）留空。
4.  在每个章节描述中，识别所有提到的具体视觉或交互素材（图标、图片、按钮、动画、3D模型、特殊文本显示等）。
5.  **对于每一个识别出的素材，紧随其所属章节行之后，创建单独的一行CSV记录。**
6.  在新创建的素材行中，填写序号（递增）、页面名称（重复）、章节名称（重复所属章节名）、素材描述（描述该具体素材）、素材类型、建议尺寸/规格、布局/位置说明、以及生成Prompt/设计说明。如果文本中未提供某些素材细节（如精确尺寸或生成prompt），请根据上下文合理推断或注明“待定义”/“N/A”。
7.  确保所有描述和设计说明都**体现出统一的美术风格**（例如：温馨、自然、积极、简洁、使用预定义的颜色和字体）。
8.  输出严格的CSV格式。

**现在，请根据以下提供的页面描述文本生成CSV内容：**

[ **在此处粘贴您之前提供的所有详细页面描述文本，例如从“Page 1: Main Screen / Garden Page”开始，一直到“Page 7: Diary Scroll Creator Page (补充细节)”或“Page 8: Diary Scroll Showcase Page”的完整内容。** ]