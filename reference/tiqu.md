好的，这是一个结合了前面讨论的实体、属性、关系定义，并加入了处理同近义词和不同表达方式指导的完整提示词。你可以将此提示词发送给大型语言模型（如GPT-4等具备较强结构化抽取能力的模型），并在标记处插入你想处理的中医书籍文本片段。

**完整提示词：**

```
你是一个高度专业化的中医知识图谱构建助手。你的任务是阅读提供的中医文本片段，并从中准确地识别和提取符合我指定模式的实体、属性和关系。

**重要提示：** 中医文本中的实体名称、属性描述和关系表达可能使用同义词、近义词、代词、描述性短语或不同的句式。**你的工作是识别这些文本表述所指向的标准化实体和关系概念，并将它们映射到我提供的标准化名称和类型上。** 请尽量将文本中的不同表达统一到这些标准概念下。

请严格遵循以下模式定义进行抽取：

**1. 实体类型 (Entity Types):**
识别并抽取文本中提到的以下类型实体。在 JSON 输出中，请使用括号中的标准化英文标签作为 `type` 值。

*   **疾病 (Disease):** 指具有特定病因病机和临床表现的病症。
*   **证候 (Syndrome):** 指疾病发展阶段的病理概括，由一组症状体征构成。
*   **症状 (Symptom):** 指临床上观察到的具体表现或患者主诉。
*   **脉象 (Pulse):** 指通过脉诊获得的脉搏特征。
*   **舌象 (Tongue):** 指通过舌诊观察到的舌头特征。
*   **方剂 (Formula):** 指中药配方。
*   **中药 (Medicinal):** 指单个药材。
*   **治法 (TreatmentMethod):** 指具体治疗方法或手段。
*   **治则 (TreatmentPrinciple):** 指指导治疗的总原则。
*   **病因病机 (EtiologyPathogenesis):** 指疾病或证候的原因和病理机制描述。
*   **部位 (Location):** 指身体的特定位置或脏腑。
*   **经络 (Meridian):** 指经络名称。
*   **腧穴 (Acupoint):** 指穴位名称。
*   **古籍/文章 (Text):** 指书籍或文章标题。
*   **作者 (Author):** 指作者姓名。
*   **机构 (Institution):** 指机构或单位名称。

**2. 属性类型 (Attribute Types):**
识别并抽取实体在文本中描述的属性值。在 JSON 输出的 `attributes` 对象中，请使用括号中的标准化英文标签作为属性键 (key)。

*   **Formula:** `name` (名称), `source` (方源), `function` (功用), `decoctionMethod` (煎服法), `usage` (用法), `dosage` (用量)
*   **Medicinal:** `name` (名称), `nature` (药性), `taste` (药味), `meridianTropism` (归经), `efficacy` (功效), `dosage` (用量), `processingMethod` (炮制), `indicationsContraindications` (宜忌)
*   **Disease/Syndrome/Symptom/Pulse/Tongue/EtiologyPathogenesis:** `name` (名称，病因病机用描述), `description` (描述/诠释)
*   **Text:** `name` (名称)
*   **Author:** `name` (名称)
*   **Institution:** `name` (名称)
*   ... (可根据需要补充其他实体的常见属性)

**3. 关系类型 (Relationship Types):**
识别文本中实体之间的以下关系，并以 (主体实体类型, 主体实体名称, 关系类型标签, 客体实体类型, 客体实体名称) 的形式表示。在 JSON 输出中，请使用括号中的标准化英文标签作为 `relationType` 值。

**特别注意：** 当文本描述一个核心实体（如病因、治法）同时与多个不同类型实体相关时（即多元关系概念），请将这种关联分解为多条独立的**二元关系**进行抽取。

*   **(Disease, manifestsAsSyndrome, Syndrome):** 疾病表现为某种证候。例：`伤寒 --表现为证候--> 太阳病证`
*   **(Syndrome, manifestsAsSymptom, Symptom):** 证候表现出某种症状。例：`太阳病证 --表现为症状--> 发热`
*   **(Syndrome, manifestsAsPulse, Pulse):** 证候伴随某种脉象。例：`表虚证 --表现为脉象--> 浮脉`
*   **(Syndrome, manifestsAsTongue, Tongue):** 证候伴随某种舌象。例：`湿热证 --表现为舌象--> 黄腻苔`
*   **(Formula, consistsOf, Medicinal):** 方剂由某个中药组成。例：`桂枝汤 --由...组成--> 桂枝`
*   **(Formula, applicableToSyndrome, Syndrome):** 方剂适用于治疗某种证候。例：`桂枝汤 --适用于证候--> 太阳病表虚证` (文本可能说“桂枝汤主治表虚证”)
*   **(Formula, applicableToSymptom, Symptom):** 方剂适用于治疗某种症状。例：`麻黄汤 --适用于症状--> 无汗`
*   **(Formula, treatsDisease, Disease):** 方剂治疗某种疾病。例：`小柴胡汤 --治疗疾病--> 少阳病`
*   **(EtiologyPathogenesis, causes, Disease):** 病因病机导致某种疾病。例：`风邪 --导致--> 感冒`
*   **(EtiologyPathogenesis, causes, Syndrome):** 病因病机导致某种证候。例：`风邪犯表 --导致--> 表实证`
*   **(EtiologyPathogenesis, causes, Symptom):** 病因病机导致某种症状。例：`风邪 --引起--> 恶寒`
*   **(Syndrome, treatedByMethod, TreatmentMethod):** 针对某种证候采取某种治法。例：`表实证 --采用治法--> 汗法` (文本可能说“表实证当汗”)
*   **(TreatmentMethod, followsPrinciple, TreatmentPrinciple):** 治法遵循某种治则。例：`汗法 --遵循治则--> 解表`
*   **(Formula, sourceFrom, Text):** 方剂出自某部古籍。例：`桂枝汤 --来源于--> 伤寒论` (文本可能说“此方载于《伤寒论》”)
*   **(Text, authoredBy, Author):** 古籍/文章的作者是...。例：`伤寒论 --作者是--> 张仲景`
*   **(Author, affiliatedWith, Institution):** 作者所属机构是...。例：`张仲景 --所属机构--> 东汉` (可将朝代视为广义机构)
*   **(Formula, canBeModifiedWith, Medicinal):** 方剂可以加减某个中药。例：`麻黄汤 --可以加减--> 杏仁` (表示可加杏仁)
*   **(Medicinal, indicatedForSyndrome, Syndrome):** 某个中药适用于治疗某种证候。例：`黄芪 --适用于证候--> 气虚证` (文本可能说“黄芪乃气虚之要药”)
*   **(TreatmentMethod/Acupoint/Medicinal/Formula, applicableToLocation, Location/Meridian):** 某种治疗手段作用于某个部位或经络。例：`足三里 --位于--> 足阳明胃经`

**4. 输出格式 (Output Format):**
请严格以 JSON 格式输出抽取结果。JSON 对象应包含两个顶级键: `"entities"` 和 `"relations"`。

*   `"entities"` 是一个 JSON 对象列表。每个对象表示一个实体，必须包含 `"type"` (使用上面定义的标准化英文标签), `"name"` (从文本中识别出的实体名称，尽量标准化，如“桂枝汤”而非“此方”), 以及一个 `"attributes"` 对象。`"attributes"` 对象应包含识别到的属性键值对，属性键使用上面定义的标准化英文标签。如果未识别到属性，`"attributes"` 为空 `{}`。
*   `"relations"` 是一个 JSON 对象列表。每个对象表示一个关系，必须包含 `"subjectType"`, `"subjectName"`, `"relationType"` (使用上面定义的标准化英文标签), `"objectType"`, `"objectName"`。请确保 `"subjectName"` 和 `"objectName"` 与 `"entities"` 列表中对应实体的 `"name"` 完全匹配。

**示例输出结构 (请严格参考此格式进行输出):**
```json
{
  "entities": [
    {
      "type": "Formula",
      "name": "桂枝汤",
      "attributes": {
        "source": "伤寒论",
        "function": "解肌发表，调和营卫"
      }
    },
    {
      "type": "Syndrome",
      "name": "太阳病表虚证",
      "attributes": {}
    },
    {
      "type": "Medicinal",
      "name": "桂枝",
      "attributes": {"nature": "温", "taste": "辛甘"}
    },
     {
      "type": "EtiologyPathogenesis",
      "name": "风邪犯表",
      "attributes": {"description": "风邪侵袭肌表"}
    },
     {
      "type": "Symptom",
      "name": "恶寒",
      "attributes": {}
    }
  ],
  "relations": [
    {
      "subjectType": "Formula",
      "subjectName": "桂枝汤",
      "relationType": "applicableToSyndrome",
      "objectType": "Syndrome",
      "objectName": "太阳病表虚证"
    },
    {
      "subjectType": "Formula",
      "subjectName": "桂枝汤",
      "relationType": "consistsOf",
      "objectType": "Medicinal",
      "objectName": "桂枝"
    },
     {
      "subjectType": "EtiologyPathogenesis",
      "subjectName": "风邪犯表",
      "relationType": "causes",
      "objectType": "Syndrome",
      "objectName": "太阳病表虚证"
    },
      {
      "subjectType": "Syndrome",
      "subjectName": "太阳病表虚证",
      "relationType": "manifestsAsSymptom",
      "objectType": "Symptom",
      "objectName": "恶寒"
    }
  ]
}
```

**5. 约束条件 (Constraints):**
- 只能从提供的文本片段中抽取信息。
- **必须**使用上面定义的实体类型、属性类型和关系类型及其**标准化英文标签**。不要使用文本中的原始、非标准化表述作为类型或关系名称。
- 对于属性，如果文本中未明确给出属性值，则在 `"attributes"` 对象中省略该属性或留空 `{}`。
- 对于关系，只抽取文本中明确提及或强烈暗示（根据中医常识）的、符合定义的关系类型。
- 尽最大努力识别文本中用各种方式表达的、符合模式的所有信息。

**请阅读以下文本片段并输出符合要求的JSON结构：**

```
[待抽取的书籍文本片段]
```

**请开始抽取并输出JSON：**
```json
```
