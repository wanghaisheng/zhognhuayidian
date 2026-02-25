# 设备规格统一规范（CT/MRI/DR）— 唯一真源

本文统一整理 CT、MRI 及 DR（含移动 DR）的关键规格字段与阈值范围，用于品牌页、型号页与对比工具的结构化提取与展示。所有阈值均依据原始招标/技术白皮书条款提炼，含“★不可负偏离”和“▲重要评分项”标注规范。

## 目标
- 统一不同来源（64/128/256排 CT、1.5T/3.0T/5.0T/7.0T MRI、床边 DR）的字段命名与取值范围
- 明确设备分档的核心阈值，支持快速比对与合规校验
- 作为前端渲染与数据抽取的唯一真源文件，保持与原始文件的可溯源关系

## 字段规范（CT）
- 机架与定位
  - 机架孔径（Gantry Aperture，cm）
  - 机架倾角（±°）
  - 驱动方式（线性电机/其他）
  - 三维激光定位系统（是/否）
- 探测器与采集
  - 探测器排数（Rows）：单源≥256排、双源≥2×96排、双层≥128排
  - Z轴覆盖宽度（mm）
  - 每排探测器单元数（个）
  - 采样率（views/圈 或 SPS/360°）
- X线系统（球管/发生器）
  - 高压发生器最大功率（kW）
  - 管电压范围（kV）最小/最大
  - 管电流范围（mA）最小/最大
  - 阳极物理热容量（MHU，或等效无限热容量）
  - 阳极最大散热率（kHU/min）
  - 焦点尺寸（微/小/大，mm×mm）
  - 冷却方式（油冷/风冷/混合）
- 扫描床
  - 水平移动范围/最大扫描长度（cm/mm）
  - 水平移动速度（最大/最小，mm/s）
  - 垂直升降范围（mm）
  - 最低离地高度（mm）
  - 最大承重（kg）
  - 移床精度（mm）
- 扫描参数与重建
  - 最快扫描速度（秒/360°）
  - 最薄层厚（mm）
  - 螺距（最小/最大）
  - 最大重建矩阵（如 1024×1024）
  - 图像重建速度（幅/秒）
  - 最大扫描视野 FOV（cm）
  - 单次螺旋扫描最大范围（cm）
- 图像质量
  - 空间分辨率（lp/cm@MTF）
  - 密度分辨率（mm@%）
  - CT值范围（HU）
  - 图像噪声（%）
- 临床/后处理与能谱
  - 常规三维后处理（MPR/SSD/VR/VE/MIP/MinIP/CTA 等）
  - 低剂量迭代重建、自动 mA/kV 调制
  - 金属伪影抑制/射线硬化抑制/容积伪影抑制
  - 能谱平台：单能量图像、能谱曲线、有效原子序数、物质分离、虚拟平扫

## 字段规范（MRI）
- 磁体系统
  - 场强（T）
  - 病人检查孔径（cm）
  - 磁体长度（cm，不含/含外壳）
  - 磁场均匀度（DSV，10/20/30/40/50cm，ppm）
  - 稳定度（ppm/h）
  - 液氦容积与消耗（L，零挥发支持）
  - 5 高斯线范围（m×m）
  - 屏蔽与匀场模式（主动/被动，高阶匀场通道数）
- 梯度系统
  - 最大单轴梯度场强（mT/m）
  - 最大单轴梯度切换率（T/m/s）
  - 有效梯度场强/切换率（如需）
  - 降噪技术与冷却方式（水冷）
  - 最大占空比（%）
- 射频系统与线圈
  - 发射总功率（kW）
  - 发射通道（≥2/≥8，支持并行发射）
  - 接收通道（如 ≥96/≥128/≥32）
  - 接收带宽（kHz/MHz）
  - 线圈接口数量（个）
  - 原厂线圈约束（头颈/脊柱/体部/柔性/专科线圈）
- 计算机与重建
  - 主控 CPU/内存/硬盘（核数、频率、容量）
  - 重建矩阵（最大采集/最大重建）
  - 重建速度（幅/秒）
- 扫描参数与序列
  - FOV（最小/最大）
  - 最薄 2D/3D 层厚（mm）
  - 关键序列最短 TR/TE（不同矩阵下）
  - 最大发电弥散 b 值与 DTI 最大方向数
  - 静音序列、并行采集、运动伪影校正、心脏/血管/腹部/关节/波谱等高级技术

## 字段规范（DR/Mobile DR）
- 球管与发生器
  - 焦点尺寸（小/大，mm）
  - 最大输出电压（kV）
  - 最大工作管电流（mA）
  - 阳极热容量（kHU）与散热功率（W）
  - 发生器功率（kW）与输出频率（kHz）
  - 曝光时间范围（ms）与电流时间积（mAs）
- 平板探测器
  - 探测器材料（碘化铯/非晶硅等）
  - 平板尺寸（英寸）
  - 像素间距（μm）与矩阵大小
  - 空间分辨率（lp/mm）
  - A/D 转换位数（bit）与动态范围
  - 成像时间（预览/全图，s）
  - 承重（整板/局部，kg）
- 机械与运动（移动 DR）
  - 驱动方式（电助力/手动）
  - 伸缩立柱结构与旋转范围（±°）
  - 整机尺寸（高/宽，cm/mm）
  - 整机重量（kg）
  - 电池续航（曝光次数/行驶里程/充电时间）
  - 爬坡能力与防碰撞系统
- 工作站与显示
  - 屏幕尺寸（英寸）与类型（触控/一体化）
  - 图像处理功能（拼接/测量/去噪）
  - DICOM 支持（存储/打印/传输）
  - 高级功能（骨密度/双能/虚拟滤线栅）

## 分档核心阈值示例
- 64排/128层 CT（参考 64-ct-specifications.md）
  - 孔径 ≥72cm
  - Z 轴覆盖 ≥40mm
  - 最薄层厚 ≤0.625mm
  - 高压发生器 ≥72kW
  - 球管热容量 ≥8MHU（或 ≤1MHU 高散热率球管）
  - 阳极最大散热率 ≥1600KHU/min
  - 最小管电压 ≤70kV
  - 管电流：最小 ≤10mA；最大 ≥660mA
  - 病人床水平可扫描距离 ≥180cm
  - 病人床水平移动最高速度 ≥255mm/s
  - FBP 重建速度 ≥60 幅/秒
  - 最大重建矩阵 ≥1024×1024
  - 空间/密度分辨率满足临床要求
- 128排及以上 CT（参考 128-ct-specifications.md）
  - 探测器排数：≥128排；Z轴覆盖 ≥8cm（单源）或等效
  - 孔径 ≥80cm
  - 采样率 ≥8900Hz（或相应 views/圈）
  - 高压发生器 ＞100kW
  - 球管热容量 ≥6.8MHU 或等效 ≥32MHU
  - 最快扫描速度及覆盖范围满足高级心脏应用
- 256排及以上 CT（参考 256-ct-specifications*.md）
  - 探测器排数：≥256排；或双源 ≥2×96排；或双层单组 ≥128排
  - 孔径 ≥78–80cm
  - 最快扫描速度 ≤0.25–0.28 秒/360°
  - 最薄层厚 ≤0.3125–0.625mm
  - 高压发生器 ≥100kW
  - 最大管电流 ≥740–1000mA；最小管电压 ≤60–80kV
  - 空间分辨率 ≥20–21 lp/cm；最大重建矩阵 ≥1024×1024
  - 能谱平台具备单能量/物质分离/虚拟平扫等
- 1.5T MRI（参考 1.5t-mri-specifications-1.md）
  - 孔径 ≥60cm；液氦零消耗；磁体均匀度 10cm DSV ≤0.01ppm
  - 梯度 ≥33mT/m，切换率 ≥100mT/m/ms
  - 接收通道数 ≥96；主控重建速度 ≥47,000 幅/秒
  - 关键序列最短 TR/TE 满足高效临床成像
- 3.0T MRI（参考 mri-3.0-T-specifications.md）
  - 孔径 ≥70cm；均匀度 10cm DSV ≤0.001ppm
  - 梯度 ≥100mT/m，切换率 ≥200T/m/s（有效值规范可选）
  - 射频发射 ≥2×18kW；接收通道 ≥128；ADC ≥80MHz
  - 最大重建矩阵 ≥1024×1024；重建速度 ≥100,000 幅/秒
- 5.0T MRI（参考 5.0t-mri-specifications.md）
  - 场强 ≥5.0T；发射频率 ≥210MHz
  - 孔径 ≤60cm（通常限制）；液氦容积 ≥2000L（或零挥发）
  - 均匀度 10cm DSV ≤0.0006ppm；20cm DSV ≤0.006ppm
  - 梯度 ≥120mT/m，切换率 ≥200mT/m/ms（单轴）
  - 射频发射 ≥64kW；独立射频放大器 ≥8个
- 7.0T MRI（参考 7.0t-mri-specifications.md）
  - 场强 ≥7T；孔径 ≥60cm；高阶匀场与多核频谱
  - 均匀度（典型）50cm DSV ≤1.2ppm、40cm DSV ≤0.13ppm 等
  - 梯度 ≥100mT/m，切换率 ≥220T/m/s；发射通道 ≥8；接收通道 ≥32
  - 支持 7T 专用序列与科研平台（IDEA/并行发射/开放重建/深度学习重建）
- 床边 DR（参考 床边DR-specifications.md）
  - 发生器功率 ≥50kW；输出频率 ≥410kHz
  - 球管热容量 ≥300kHU；最大电流 ≥630mA
  - 平板像素间距 ≤100μm；空间分辨率 ≥5.0LP/mm；整板承重 ≥300kg
  - 整机重量 ≤390kg；行进时高度 ≤130cm
  - 具备虚拟滤线栅、双能摄影、骨密度测量等高级功能

## 64排/128层 CT（招标参数字段清单）
数据源：[64-ct-specifications.md](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md)

### 标配清单（默认包含）
| 序号 | 交付项 | 数量 | 单位 | 溯源 |
| --- | --- | --- | --- | --- |
| 1 | 扫描架系统 | 1 | 套 | [64-ct-specifications.md:L4-L22](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L4-L22) |
| 2 | X线球管及高压发生器 | 1 | 套 | [64-ct-specifications.md:L4-L22](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L4-L22) |
| 3 | 探测器 | 1 | 套 | [64-ct-specifications.md:L4-L22](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L4-L22) |
| 4 | 扫描床系统 | 1 | 套 | [64-ct-specifications.md:L4-L22](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L4-L22) |
| 5 | 微辐射平台 | 1 | 套 | [64-ct-specifications.md:L4-L22](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L4-L22) |
| 6 | 量体成像平台 | 1 | 套 | [64-ct-specifications.md:L4-L22](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L4-L22) |
| 7 | 金属伪影去除平台 | 1 | 套 | [64-ct-specifications.md:L4-L22](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L4-L22) |
| 8 | 操作台主控计算机 | 1 | 套 | [64-ct-specifications.md:L4-L22](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L4-L22) |
| 9 | 通用型临床应用软件 | 1 | 套 | [64-ct-specifications.md:L4-L22](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L4-L22) |
| 10 | 患者及陪员（成人及儿童）防护用品 | 2 | 套 | [64-ct-specifications.md:L4-L22](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L4-L22) |
| 11 | 防护用品配套铅衣放置专用衣架 | 1 | 套 | [64-ct-specifications.md:L4-L22](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L4-L22) |
| 12 | 专业影像阅片工作站 | 1 | 套 | [64-ct-specifications.md:L4-L22](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L4-L22) |
| 13 | 专业影像移动工作站 | 1 | 套 | [64-ct-specifications.md:L4-L22](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L4-L22) |
| 14 | 大功率抽湿机 | 1 | 套 | [64-ct-specifications.md:L4-L22](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L4-L22) |
| 15 | 激光打印机 | 1 | 套 | [64-ct-specifications.md:L4-L22](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L4-L22) |
| 16 | 原厂后处理工作站 | 1 | 套 | [64-ct-specifications.md:L4-L22](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L4-L22) |
| 17 | 主控计算机不间断电源 | 1 | 套 | [64-ct-specifications.md:L4-L22](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L4-L22) |

### 关键技术参数（字段化，便于页面/表格抽取）
| 字段 key | 中文字段 | 类型 | 单位 | 标注 | 阈值/要求 | 常见抽取别名 | 溯源 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ctDeviceType | 设备类型 | string | - | ★ | 高端64排128层螺旋CT | 设备类型/机型 | [64-ct-specifications.md:L25-L33](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L25-L33) |
| sliceCount | 排数（对外常用“64排”） | number | 排 | ★ | 64 | slice_count/slices | [64-ct-specifications.md:L1-L2](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L1-L2) |
| slicesPerRotation | 层数/圈（对外常用“128层/圈”） | number | 层/圈 | 普通 | 128 | layers_per_rotation | [64-ct-specifications.md:L56-L56](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L56) |
| bore | 扫描架孔径 | number | cm | ▲ | ≥72 | gantryAperture/boreSize | [64-ct-specifications.md:L29-L29](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L29) |
| slipRingType | 滑环类型 | string | - | 普通 | 低压滑环 | slipRing | [64-ct-specifications.md:L30-L30](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L30) |
| gantryCooling | 冷却方式 | string | - | 普通 | 高效风冷 | coolingMethod | [64-ct-specifications.md:L31-L31](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L31) |
| coverage | 探测器Z轴覆盖宽度 | number | mm | ▲ | ≥40 | zCoverage/z_coverage | [64-ct-specifications.md:L32-L32](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L32) |
| dualFocalSpot | 动态双焦点 | boolean | - | 普通 | 是 | dynamicDualFocalSpot | [64-ct-specifications.md:L33-L33](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L33) |
| sliceThicknessMin | 最薄采集层厚 | number | mm | 普通 | ≤0.625 | minSliceThickness | [64-ct-specifications.md:L34-L34](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L34) |
| tableVerticalTravelCm | 病人床垂直升降距离 | number | cm | 普通 | ≥45 | tableVerticalTravel | [64-ct-specifications.md:L38-L38](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L38) |
| tableHorizontalScanLengthCm | 病人床水平可扫描距离 | number | cm | ▲ | ≥180 | tableScanLength | [64-ct-specifications.md:L39-L39](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L39) |
| tableHorizontalSpeedMinMmS | 病人床水平移动最低速度 | number | mm/s | 普通 | ≤1 | tableSpeedMin | [64-ct-specifications.md:L40-L40](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L40) |
| tableLoadKg | 病人床承重 | number | kg | 普通 | ≥200 | tableWeightLimit | [64-ct-specifications.md:L41-L41](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L41) |
| tableHorizontalSpeedMaxMmS | 病人床水平移动最高速度 | number | mm/s | ▲ | ≥255 | tableSpeedMax | [64-ct-specifications.md:L42-L42](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L42) |
| tubeCurrentStepMa | 球管电流递增幅度 | number | mA | 普通 | ≤1 | tubeCurrentStep | [64-ct-specifications.md:L44-L44](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L44) |
| tubeCurrentMinMa | 球管最小电流 | number | mA | ▲ | ≤10 | minTubeCurrent | [64-ct-specifications.md:L45-L45](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L45) |
| tubeCurrentMaxMa | 球管最大电流 | number | mA | ▲ | ≥660 | maxTubeCurrent | [64-ct-specifications.md:L45-L45](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L45) |
| tubeHeatCapacityMhu | 球管阳极物理热容量（非等效） | number | MHU | ▲ | ≥8.0（或 ≤1 且为高散热率球管） | tubeHeatCapacity | [64-ct-specifications.md:L46-L47](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L46-L47) |
| tubeMaxKv | 球管最大电压 | number | kV | 普通 | ≥140 | maxKv | [64-ct-specifications.md:L48-L48](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L48) |
| tubeMinKv | 球管最小电压 | number | kV | ▲ | ≤70 | minKv | [64-ct-specifications.md:L49-L49](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L49) |
| tubeFocalSpotLarge | 球管大焦点尺寸 | string | mm×mm | 普通 | ≤1.0×1.0 | focalSpotLarge | [64-ct-specifications.md:L50-L50](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L50) |
| tubeFocalSpotSmall | 球管小焦点尺寸 | string | mm×mm | 普通 | ≤0.5×1.0 | focalSpotSmall | [64-ct-specifications.md:L51-L51](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L51) |
| generatorPower | 发生器功率 | number | kW | 普通 | ≥72 | power/generatorPowerKw | [64-ct-specifications.md:L53-L53](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L53) |
| tubeAnodeCoolingRateKhuMin | 阳极最大散热率 | number | KHU/min | ▲ | ≥1600 | anodeCoolingRate | [64-ct-specifications.md:L54-L54](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L54) |
| fovMinCm | 重建视野最小值 | number | cm | 普通 | 5 | fovMin | [64-ct-specifications.md:L57-L57](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L57) |
| fovMaxCm | 重建视野最大值 | number | cm | 普通 | 50 | fovMax | [64-ct-specifications.md:L57-L57](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L57) |
| pitchMin | 螺距最小值 | number | - | 普通 | 0.15 | pitch | [64-ct-specifications.md:L58-L58](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L58) |
| pitchMax | 螺距最大值 | number | - | 普通 | 1.5 | pitch | [64-ct-specifications.md:L58-L58](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L58) |
| maxContinuousHelicalScanTimeS | 单次连续螺旋扫描时长 | number | s | 普通 | ≥120 | helicalDuration | [64-ct-specifications.md:L59-L59](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L59) |
| spatialResolution | X-Y轴空间分辨率 | number | LP/cm | 普通 | ≥16 | spatialResolutionLpCm | [64-ct-specifications.md:L60-L60](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L60) |
| contrastResolution | 密度分辨率 | string | - | 普通 | ≤4mm@0.3% | densityResolution | [64-ct-specifications.md:L61-L61](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L61) |
| ctHuRange | CT值范围 | string | HU | 普通 | -1000～+3000 | ctValueRange | [64-ct-specifications.md:L62-L62](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L62) |
| reconstructionMatrixMax | 超高图像重建矩阵像素 | string | - | ▲ | ≥1024×1024 | reconstructionMatrix | [64-ct-specifications.md:L65-L65](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L65) |
| reconstructionSpeedFps | FBP图像重建速度 | number | 幅/秒 | ▲ | ≥60 | reconstructionSpeed | [64-ct-specifications.md:L66-L66](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L66) |
| hostMemoryGb | 操作台内存 | number | GB | 普通 | ≥64 | memory | [64-ct-specifications.md:L68-L68](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L68) |
| hostCpu | 操作台处理器 | string | - | 普通 | 主频≥2.2GHz，≥24核 | cpu | [64-ct-specifications.md:L69-L69](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L69) |
| hostStorageTb | 操作台硬盘容量 | number | TB | 普通 | ≥4 | storage | [64-ct-specifications.md:L70-L70](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L70) |
| dicom | 图像存储格式 | string | - | 普通 | DICOM 3.0 | connectivity | [64-ct-specifications.md:L73-L73](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L73) |
| clinicalAppsIncluded | 临床应用软件（功能集合） | string | - | 普通 | MPR/MIP/MinIP/VR/CTA去骨/剂量调控/去金属伪影等 | appList | [64-ct-specifications.md:L79-L133](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md#L79-L133) |

## 标注规则
- ★ 不可负偏离：不满足则视为未实质性满足招标要求
- ▲ 重要评分项：负偏离按相关评分细则重点扣分
- 普通指标：用于完整性与性能描述，不作为实质性/重点扣分依据

## 字段映射示例
- CT
  - “机架孔径/孔径/检查通道” → bore（兼容 gantryAperture/boreSize）
  - “探测器排数/双源排数/双层每层排数” → detectorRows
  - “Z轴覆盖宽度/探测器Z轴覆盖” → coverage（兼容 zCoverage）
  - “高压发生器功率/发生器功率” → generatorPower（兼容 power）
  - “球管电压/电流范围” → tubeMinKv/tubeMaxKv/tubeCurrentMinMa/tubeCurrentMaxMa（或 voltage/current 展示字段）
  - “球管热容量/散热率/焦点尺寸” → tubeHeatCapacityMhu/tubeAnodeCoolingRateKhuMin/tubeFocalSpotSmall/tubeFocalSpotLarge
  - “最薄层厚/螺距/重建矩阵/重建速度/FOV” → sliceThicknessMin/pitchMin/pitchMax/reconstructionMatrixMax/reconstructionSpeedFps/fovMinCm/fovMaxCm
  - “空间/密度分辨率/CT值范围” → spatialResolution/contrastResolution/ctHuRange
- MRI
  - “场强/孔径/均匀度/稳定度/液氦容积/5高斯线范围” → fieldStrengthT/boreCm/homogeneityDsvPpm/stabilityPpmPerHour/liquidHeliumL/fiveGaussLineArea
  - “梯度场强/切换率/冷却/占空比” → gradientStrength/gradientSlewRate/gradientCooling/dutyCycle
  - “发射功率/发射通道/接收通道/带宽/线圈接口/原厂线圈” → rfTxPower/rfTxChannels/rfRxChannels/rfBandwidth/coilPorts/coilRequirements
  - “主控/重建/矩阵/速度” → hostCpu/hostMemory/hostStorage/reconMatrix/reconSpeed
  - “FOV/层厚/TR/TE/b值/DTI方向/静音与并行采集/运动校正等” → fovMinMax/layerThicknessMin/trMin/teMin/bValueMax/dtiDirections/quietSequences/parallelImaging/motionCorrection
- DR
  - “焦点/电压/电流/热容量” → tubeFocus/maxKv/maxMa/anodeHeatCapacity
  - “发生器功率/频率” → generatorPower/frequency
  - “平板材料/尺寸/像素间距/分辨率” → detectorMaterial/size/pixelPitch/spatialResolution
  - “整机重量/高度/续航” → unitWeight/height/batteryLife

## 数据来源（可溯源）
- CT
  - [64-ct-specifications.md](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md)
  - [128-ct-specifications.md](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/128-ct-specifications.md)
  - [256-ct-specifications.md](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/256-ct-specifications.md)
  - [256-ct-specifications-1.md](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/256-ct-specifications-1.md)
  - [256-ct-specifications-2.md](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/256-ct-specifications-2.md)
  - [256-ct-specifications-3.md](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/256-ct-specifications-3.md)
- MRI
  - [1.5t-mri-specifications-1.md](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/1.5t-mri-specifications-1.md)
  - [mri-3.0-T-specifications.md](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/mri-3.0-T-specifications.md)
  - [3.0t-mri-specifications.md](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/3.0t-mri-specifications.md)
  - [5.0t-mri-specifications.md](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/5.0t-mri-specifications.md)
  - [7.0t-mri-specifications.md](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/7.0t-mri-specifications.md)
- DR
  - [床边DR-specifications.md](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/床边DR-specifications.md)

## 使用与更新流程
- 作为统一字段与阈值的唯一真源文件，前端/脚本应仅从此文档定义的键名与阈值抽取和对齐
- 新增或更新原始招标文件时，先补充“分档核心阈值”与“字段映射”，再更新相应字段规范
- 保留对原始文件的链接以便审计与合规复核
