输出cocos适应的素材csv文件

Let's integrate these new requirements into the generalized prompt. The core challenge will be to guide the AI to:
1.  Infer the new specific CSV fields (like `类型`, `父节点`, `anchor_x/y`, type-specific fields) from the visual description.
2.  Understand that the `AI_Image_Prompt_Element_Specific` is still for generating *text-free visual assets*, even for elements like "Label" (where it would generate the *placeholder* for text, not the text itself).
3.  Correctly populate the `资源` field, understanding it refers to the asset that *will be generated* by the `AI_Image_Prompt_Element_Specific`.

Here's the revised and enhanced prompt:

---

**通用提示词：从视觉界面描述生成符合规范的模块化UI资产CSV**

```
You are an expert UI/UX Deconstructor and AI Asset Generation Assistant. Your task is to process a detailed **visual interface description** for a game interface (style and genre will be specified) and break it down into modular, AI-generatable graphical assets. You will then populate a CSV-formatted table with details for each identified UI element, strictly adhering to the CSV column specifications provided below.

The overall visual style of all graphical elements to be generated is **[SPECIFY OVERALL ART STYLE, e.g., "pixel art," "cartoonish," "photorealistic," "flat design," "sci-fi minimalist"]**. All generated image assets should adhere to this style and have a **transparent background (PNG)**, unless explicitly described as a solid base background element or a non-image node in the input description (e.g., a pure layout Node).

**Crucially, for each identified element from the input visual interface description that requires a graphical asset (typically Sprites, or visual aspects of Buttons/Labels), the corresponding `AI_Image_Prompt_Element_Specific` you generate for the CSV MUST NOT instruct the AI to generate any legible text, words, letters, or numbers.** The input description itself should already be framed in terms of visual placeholders for text/data. Your AI image prompts should accurately reflect these visual placeholder descriptions (e.g., "ink lines suggesting text," "an empty outlined box where a title would go," "abstract calligraphic flourishes").

**CSV Column Specifications (Based on "UI界面CSV标注要求文档"):**

Your output CSV MUST contain the following columns in this exact order:
`节点名,父节点,类型,组件,资源,备注,pos_x,pos_y,width,height,anchor_x,anchor_y,opacity,visible,scale_x,scale_y,rotation,layout,padding,spacing,font_size,color,align,overflow,line_height,size_mode,trim,transition,zoom_scale,target,default_clip,play_on_load,default_skin,default_anim,loop,premultiplied_alpha,AI_Image_Prompt_Element_Specific`

**Your Process for Analyzing the Provided Visual Interface Description and Generating the CSV:**

1.  **Identify Distinct UI Elements & Hierarchy:**
    *   Based on the input description, segment the interface into its core functional and visual components.
    *   Assign a unique `节点名` (Element_ID) to each (e.g., `HomeView_Background`, `Title_Text_Placeholder_Area`, `Start_Button_Shape`, `Player_Avatar_Frame`).
    *   Determine the `父节点` for each element based on described containment or layering (e.g., "A panel *on* the background," "Three buttons *inside* the panel"). The root UI view node (e.g., `HomeView`) will have an empty `父节点`.

2.  **For each identified element, determine the information for ALL specified CSV columns:**

    *   **`节点名`**: Unique, descriptive ID.
    *   **`父节点`**: Name of the parent node. Empty for the root node.
    *   **`类型`**: Infer from description (e.g., "Node" for containers, "Sprite" for images/backgrounds/icons, "Label" for text display areas, "Button" for interactive elements, "Spine" if skeletal animation is described).
    *   **`组件`**: List relevant components based on `类型` and description. E.g., if `类型` is "Button", `组件` must include "Button". If "Spine", include "Spine". Can be comma-separated if multiple apply (e.g., "Button,Animation").
    *   **`资源`**:
        *   If an AI-generated graphical asset is needed for this node (typically for `类型` Sprite, or visual parts of Button/Label), provide a descriptive placeholder filename like `[节点名]_asset.png`. This is what the `AI_Image_Prompt_Element_Specific` will generate.
        *   If the node is purely structural (e.g., a `Node` for layout) or its visual is entirely programmatic (e.g., a solid color fill defined by engine parameters, not an image), this can be left blank or "N/A".
    *   **`备注`**: Briefly describe the element's purpose or key visual characteristics from the input description (e.g., "Main call-to-action button," "Placeholder for player name," "Decorative border element").
    *   **`pos_x`, `pos_y`**: Estimate X/Y coordinates (numeric) relative to its `父节点` based on layout cues (e.g., "Centered," "Top-left," "Offset by 10px from right edge of parent"). Default to 0 if no specific info.
    *   **`width`, `height`**: Estimate width/height (numeric, in pixels) based on description (e.g., "Spans full width," "Small icon 64x64," "Tall narrow strip"). These are required for all nodes.
    *   **`anchor_x`, `anchor_y`**: Estimate anchor points (0 to 1). Default to 0.5 for X and Y if description implies centering or no specific alignment mentioned. Infer from "aligned left" (0), "aligned right" (1), "top" (1 for Y with 0,0 at top-left, or 0 if 0,0 at bottom-left - assume 0,0 is top-left unless context implies otherwise; for Cocos/Unity like systems, (0,0) is bottom-left, (0.5,0.5) center, (1,1) top-right. Let's assume **0,0 is bottom-left of parent for `pos_x,pos_y` and anchors, so `anchor_y=1` is top, `anchor_y=0` is bottom.** If "top of screen", and parent is screen, anchor_y might be 1). *Clarify anchor point system if possible, otherwise default to 0.5, 0.5.* (Given the spec, 0.5,0.5 is the default, so AI should aim for that unless specific cues like "top-left aligned" suggest 0,0 or "bottom-right" suggests 1,1, assuming parent's origin is bottom-left for its children).
    *   **`opacity`**: (0-255) Default 255. Infer from "semi-transparent," "faded."
    *   **`visible`**: (true/false) Default true. Infer from "hidden initially."
    *   **`scale_x`, `scale_y`**: Default 1. Infer from "slightly enlarged."
    *   **`rotation`**: (0-360) Default 0. Infer from "tilted."

    *   **Node-specific (`类型` = "Node"):**
        *   `layout`: (horizontal/vertical/grid) Infer from description of child arrangement.
        *   `padding`: (number) Default 0.
        *   `spacing`: (number) Default 0.

    *   **Label-specific (`类型` = "Label"):**
        *   `font_size`: (number) Required. Estimate from "large title text," "small caption text." Default to 20 if no info.
        *   `color`: (#RRGGBBAA or #RRGGBB) Default #FFFFFFFF. Infer from description.
        *   `align`: (left/center/right) Default left.
        *   `overflow`: (none/clamp/shrink/resize) Default none.
        *   `line_height`: (number) Estimate or use font_size.
        *   **`AI_Image_Prompt_Element_Specific` for Label:** Describes the *visual placeholder for the text* (e.g., "A series of dark, horizontal [STYLE] lines suggesting a paragraph of text," "An empty, outlined [STYLE] box where a single word title would go").

    *   **Sprite-specific (`类型` = "Sprite"):**
        *   `size_mode`: (trim/raw) Default trim.
        *   `trim`: (true/false) Default true.
        *   **`AI_Image_Prompt_Element_Specific` for Sprite:** Describes the visual appearance of the sprite.

    *   **Button-specific (`类型` = "Button"):**
        *   (Ensure `组件` includes "Button")
        *   `transition`: (none/color/sprite/scale) Default color.
        *   `zoom_scale`: (number) Default 1.1. Only if transition is "scale".
        *   `target`: (节点名) Node to apply sprite/color transition to (often the button itself or a child sprite).
        *   **`AI_Image_Prompt_Element_Specific` for Button:** Describes the *visual appearance of the button's base graphic*. If the button has text, a separate "Label" child element should be created for the text placeholder.

    *   **Animation-specific (`类型` = "Animation" or if `组件` includes "Animation"):**
        *   `default_clip`: (string)
        *   `play_on_load`: (boolean) Default false.

    *   **Spine-specific (`类型` = "Spine"):**
        *   (Ensure `组件` includes "Spine")
        *   `default_skin`: (string) Default "default".
        *   `default_anim`: (string)
        *   `loop`: (boolean) Default false.
        *   `premultiplied_alpha`: (boolean) Default true.
        *   **`AI_Image_Prompt_Element_Specific` for Spine:** This is complex. The prompt might describe a *static reference pose* or a *key visual characteristic* of the Spine character/object that needs a base texture generated, consistent with the overall style. The actual animation data (.json, .atlas) is external. The prompt should focus on "A [character description] in a T-pose or idle stance, suitable for Spine animation rigging. Strictly no legible text... Adhering to [OVERALL ART STYLE] style. Transparent background. PNG."

    *   **`AI_Image_Prompt_Element_Specific` (General, for all elements that produce a graphical asset):**
        *   This is the most critical part for asset generation. Based on the visual characteristics of the element *as described in the input visual interface description*.
        *   This prompt MUST create a *new graphical asset consistent with the specified [OVERALL ART STYLE]*.
        *   It MUST explicitly describe generating a *visual placeholder* if the area is meant for text/data.
        *   **Include "Transparent background. PNG."** if the asset needs transparency (most UI elements do, unless it's a full background).
        *   **Always include "Adhering to [SPECIFY OVERALL ART STYLE] style."**
        *   **Always include "Strictly no legible text, words, letters, or numbers."**
        *   If an element does not have a directly generatable graphical asset (e.g., it's a `Node` for layout, or a `Label` whose text is purely engine-rendered but you still want to define its placeholder appearance), this field might be less detailed or focus only on the placeholder aspect. For pure `Node` types used only for layout, this field can be "N/A".

3.  **Fill Remaining Columns with Defaults or Inferred Values:** For any fields not explicitly detailed in the input description, use the defaults mentioned in the "UI界面CSV标注要求文档" or make reasonable inferences. If a type-specific field is not applicable (e.g. `font_size` for a `Sprite`), leave it blank.

**Instructions for You (the AI Assistant processing this):**

You will be provided with a **detailed visual interface description** (which itself was likely generated from a PRD and focuses on visual placeholders instead of literal text).
Your goal is to deconstruct this description into its constituent visual elements and generate the CSV data, populating ALL columns as specified above. Pay close attention to inferring `类型`, `父节点`, and ensuring `AI_Image_Prompt_Element_Specific` is text-free and style-consistent.

**Please output the result in CSV format, starting with the header row provided above. For repeating structures (like list items or multiple similar icons), demonstrate with 1-2 examples and note that the pattern repeats, but still provide full CSV rows for the demonstrated examples.**

---
**INPUT VISUAL INTERFACE DESCRIPTION (for a game with [SPECIFY OVERALL ART STYLE] art style):**
---

[在这里粘贴由上一个提示词（从PRD生成视觉界面描述）生成的，或者你手动编写的，侧重于视觉元素和无文字占位符的界面描述。确保此描述包含足够的信息以推断出CSV中定义的各类字段，特别是布局、层级和视觉外观。]

---
**END OF INPUT VISUAL INTERFACE DESCRIPTION.**
---

Please generate the CSV output for the visual interface description provided above. Ensure the CSV header and all columns are exactly as specified. All AI image prompts within the CSV must strictly adhere to the "no text" rule, accurately reflect the described visual placeholders, and conform to the overall [SPECIFY OVERALL ART STYLE].
```

**Key changes and considerations in this enhanced prompt:**

1.  **Explicit CSV Header:** The prompt now dictates the exact CSV header the AI must use. This is crucial for compatibility.
2.  **Detailed Column Instructions:** Each column from your spec is addressed, with guidance on how the AI should infer or default its value.
3.  **`父节点` (Parent Node) Inference:** Specific instruction to determine parent-child relationships.
4.  **`类型` (Type) Inference:** AI needs to deduce this (Node, Sprite, Label, Button, Spine).
5.  **`资源` (Resource) Field:** Clarified that this refers to the asset to be generated by the `AI_Image_Prompt_Element_Specific`, using a placeholder name.
6.  **Anchor Point Convention:** Added a note about anchor point conventions (assuming 0,0 is bottom-left for positioning and anchors, which is common in game engines like Cocos Creator and Unity). *You might need to adjust this if your target engine uses a different coordinate system origin (e.g., top-left).* The prompt currently defaults to 0.5, 0.5 as per your spec but gives cues for inference.
7.  **Type-Specific Fields:** Explicitly listed how to handle fields specific to Node, Label, Sprite, Button, Animation, and Spine types.
8.  **`AI_Image_Prompt_Element_Specific` for Labels:** Re-emphasized that for Labels, this prompt generates the *visual placeholder for text*, not the text itself.
9.  **`AI_Image_Prompt_Element_Specific` for Spine:** Provided guidance on how to approach generating a reference visual for Spine assets.
10. **Default Values:** AI is instructed to use defaults from your spec or make reasonable inferences.
11. **Input Description Requirement:** Highlighted that the input visual description needs to be rich enough.

**How to use this refined prompt:**

1.  **Replace `[SPECIFY OVERALL ART STYLE]`** in both places (overall instruction and the input section reminder).
2.  **Prepare your "Visual Interface Description":** This is more critical than ever. It needs to contain cues for:
    *   Element hierarchy (e.g., "A settings panel IS ON the main background. The panel CONTAINS three buttons.") for `父节点`.
    *   Element types (e.g., "A rectangular area for displaying the player's name" -> `Label`; "A circular button with an icon" -> `Button`, `Sprite` for icon; "A decorative frame image" -> `Sprite`; "An animated character displayed using Spine" -> `Spine`).
    *   Visual appearance for the `AI_Image_Prompt_Element_Specific`.
    *   Layout cues for `pos_x, pos_y, width, height, anchor_x, anchor_y` (e.g., "Centered horizontally," " занимает всю ширину," "a small square icon," "aligned to the top-left of its parent").
    *   Cues for other properties if non-default (e.g., "slightly transparent," "rotated 45 degrees").
3.  **Paste your detailed visual interface description** into the designated `[在这里粘贴...]` section.
4.  **Submit to the AI.**
5.  **Review Output Carefully:**
    *   Check if all specified CSV columns are present and in order.
    *   Verify the `类型` and `父节点` are logically inferred.
    *   Critically examine the `AI_Image_Prompt_Element_Specific` for text-freeness, style adherence, and accurate reflection of the visual placeholder.
    *   Check if numeric values (`pos_x`, `width`, `font_size`, etc.) are reasonable estimates based on the input.
    *   Ensure type-specific fields are correctly populated or left blank if not applicable.

This prompt, combined with a high-quality input description, should give you CSV outputs that are much closer to your desired structured format and directly usable for further UI automation and asset generation pipelines.
 # UI界面CSV标注要求文档

## 1. 总体目标

- **目的**：通过结构化CSV，精确描述每个UI节点的层级、类型、资源、布局属性，实现UI自动化生成与高效协作。
- **适用范围**：所有游戏主界面、弹窗、功能页等（如LoadingView、HomeView、GameView、VictoryView、DefeatView、MapView等）。

## 2. CSV字段定义

### 2.1 基础字段

| 字段名      | 说明                                                         | 示例                                  |
|-------------|--------------------------------------------------------------|---------------------------------------|
| 节点名      | 节点唯一名称，建议与Prefab/脚本属性一致                      | Logo、StartButton、ScoreLabel         |
| 父节点      | 父级节点名称，根节点留空                                      | HomeView、Panel、TopBar_Bg            |
| 类型        | 节点类型（Node/Sprite/Label/Button/Spine等）                  | Sprite、Label、Button                 |
| 组件        | 附加组件（如Button、Spine、Animation等，可多选或逗号分隔）    | Button、Spine                         |
| 资源        | 关联的图片/动画/音效等资源文件名                              | home_bg.png、btn_start.png            |
| 备注        | 用途说明、交互、动画、特殊说明等                              | "主按钮"，"顶部Logo"，"动态生成"      |

### 2.2 位置与尺寸字段（所有节点必填）

| 字段名      | 类型    | 默认值 | 说明                                |
|------------|---------|--------|-------------------------------------|
| pos_x      | number  | 0      | 节点X坐标（相对父节点）              |
| pos_y      | number  | 0      | 节点Y坐标（相对父节点）              |
| width      | number  | -      | 节点宽度（像素）                     |
| height     | number  | -      | 节点高度（像素）                     |
| anchor_x   | number  | 0.5    | X轴锚点(0~1)                        |
| anchor_y   | number  | 0.5    | Y轴锚点(0~1)                        |

### 2.3 通用可选字段（所有节点可选）

| 字段名      | 类型    | 默认值 | 说明                                |
|------------|---------|--------|-------------------------------------|
| opacity    | number  | 255    | 透明度(0~255)                       |
| visible    | boolean | true   | 是否可见                            |
| scale_x    | number  | 1      | X轴缩放                             |
| scale_y    | number  | 1      | Y轴缩放                             |
| rotation   | number  | 0      | 旋转角度(0~360)                     |

### 2.4 节点类型专属字段

#### 2.4.1 容器节点（Node）专属字段

| 字段名      | 类型    | 必填  | 默认值 | 说明                                |
|------------|---------|-------|--------|-------------------------------------|
| layout     | string  | 否    | -      | 布局方式(horizontal/vertical/grid)   |
| padding    | number  | 否    | 0      | 内边距（布局时生效）                 |
| spacing    | number  | 否    | 0      | 子节点间距（布局时生效）             |

#### 2.4.2 文本节点（Label）专属字段

| 字段名      | 类型    | 必填  | 默认值 | 说明                                |
|------------|---------|-------|--------|-------------------------------------|
| font_size  | number  | 是    | 20     | 字体大小                            |
| color      | string  | 否    | #FFFFFF| 颜色值(#RRGGBB或#RRGGBBAA)          |
| align      | string  | 否    | left   | 对齐方式(left/center/right)         |
| overflow   | string  | 否    | none   | 文本溢出(none/clamp/shrink/resize)  |
| line_height| number  | 否    | -      | 行高                                |

#### 2.4.3 图片节点（Sprite）专属字段

| 字段名      | 类型    | 必填  | 默认值 | 说明                                |
|------------|---------|-------|--------|-------------------------------------|
| size_mode  | string  | 否    | trim   | 尺寸模式(trim/raw)                  |
| trim       | boolean | 否    | true   | 是否裁剪透明像素                     |

#### 2.4.4 按钮节点（Button）专属字段

| 字段名      | 类型    | 必填  | 默认值 | 说明                                |
|------------|---------|-------|--------|-------------------------------------|
| transition | string  | 否    | color  | 过渡类型(none/color/sprite/scale)    |
| zoom_scale | number  | 否    | 1.1    | 点击缩放比例                         |
| target     | string  | 否    | -      | 目标节点名（过渡效果作用对象）        |

#### 2.4.5 动画节点（Animation）专属字段

| 字段名       | 类型    | 必填  | 默认值 | 说明                                |
|-------------|---------|-------|--------|-------------------------------------|
| default_clip| string  | 否    | -      | 默认动画片段名                       |
| play_on_load| boolean | 否    | false  | 是否自动播放                         |

#### 2.4.6 骨骼动画节点（Spine）专属字段

| 字段名      | 类型    | 必填  | 默认值  | 说明                                |
|------------|---------|-------|---------|-------------------------------------|
| default_skin| string | 否    | default | 默认皮肤名                          |
| default_anim| string | 否    | -       | 默认动画名                          |
| loop       | boolean | 否    | false   | 是否循环播放                         |
| premultiplied_alpha | boolean | 否 | true | 是否预乘Alpha                    |

## 3. CSV格式示例

### 3.1 基础节点示例
```csv
节点名,父节点,类型,组件,资源,pos_x,pos_y,width,height,anchor_x,anchor_y,opacity,visible
HomeView,,Node,,,0,0,1080,1920,0.5,0.5,255,true
Background,HomeView,Sprite,,home_bg.png,0,0,1080,1920,0.5,0.5,255,true
```

### 3.2 带布局的容器示例
```csv
节点名,父节点,类型,组件,资源,pos_x,pos_y,width,height,anchor_x,anchor_y,layout,spacing
TopBar,HomeView,Node,,,0,800,1080,100,0.5,0.5,horizontal,10
```

### 3.3 文本节点示例
```csv
节点名,父节点,类型,组件,资源,pos_x,pos_y,width,height,anchor_x,anchor_y,font_size,color,align
CoinLabel,TopBar,Label,,,0,0,100,40,0.5,0.5,28,#FFFFFF,center
```

## 4. 注意事项

### 4.1 必填字段规则
1. **所有节点必填字段**：
   - pos_x, pos_y, width, height, anchor_x, anchor_y
   - 节点名、类型

2. **特定类型节点必填字段**：
   - Label节点：font_size
   - Button节点：组件字段必须包含"Button"
   - Sprite节点：通常需要资源字段

### 4.2 默认值处理
- 未指定的可选属性将使用默认值
- 布局相关属性仅在指定layout时生效

### 4.3 类型校验规则
- 数值类型必须为有效数字
- 颜色值必须为有效的十六进制格式
- 枚举值必须为预定义的有效值

### 4.4 特殊处理说明
- 布局属性（layout）设置后，子节点的pos_x和pos_y可能会被布局覆盖
- 动画相关属性需要确保资源文件存在

## 5. 最佳实践建议

1. **命名规范**：
   - 节点名使用驼峰命名法
   - 资源名使用小写字母和下划线
   - 保持与代码中的属性名一致

2. **布局建议**：
   - 优先使用布局组件而不是固定坐标
   - 合理使用锚点简化定位
   - 考虑不同分辨率的适配

3. **资源引用**：
   - 确保资源路径正确
   - 使用统一的资源命名规范
   - 及时清理未使用的资源引用

4. **维护建议**：
   - 定期更新CSV文件
   - 保持与美术资源的同步
   - 做好版本控制

如有疑问或需要更多示例，请联系开发团队。