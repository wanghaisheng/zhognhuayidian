# Specifications Schema 指南（DB + Markdown）

## 目标与范围
- 建立统一的规格数据 Schema，指导数据库写入与 Markdown 内容建设。
- 数据来源以结构化产物为准：data/processed/analysis（dimension-field-map、dimension-index、specs-catalog、standard-config）。
- 原始规格文本位于 data/rawdata/specifications，仅作为解析输入与证据追溯。
- 支持买方/卖方两类页面生产与前端消费。

## 核心原则
- 结构化权威：设备规格以数据库 JSONB 为权威来源；Markdown 仅承载摘要与解释，不复制完整规格。
- 分层模型：Raw → Domain 深度归一化，统一 null→undefined 与 translations JSONB 合并策略。
- 多语言一致：统一使用 translations；避免 *_en/*_zh 冗余；标签与键在 locales 维护。
- 证据与审计：保留 original_text、evidence_required 与 source 引用，确保可回溯。

## 数据库模型（建议）
- devices.specifications（JSONB，核心聚合）
  - model_key：如 mri_1_5t、mri_7_0t、ct_256 等
  - magnetSystem / rfTransmit / rfReceive / gradientSystem / clinicalParams / sequences / advancedImaging / advancedTech / siteRequirements / computerSystem / patientBed / configuration / meta
  - translations：多语言标签与说明（按键路径维护）
- device_specifications（明细表，可选）
  - device_id、section、key、value、unit、importance、original_text、source_file、source_line、notes
  - 保留每条解析行的细节，便于稽核与差异化展示

## 字段命名与单位规范
- 命名风格：snake_case；明确单位后缀与类型语义
  - 长度/尺寸：_mm/_cm/_m
  - 功率：_kw；电压：_kv；电流：_ma
  - 带宽：_khz；存储：_gb；频率精度：_hz
  - 速率：_images_s / _fps（图像/帧）
  - 磁体均匀性：uniformity_ppm_dsv_{10|20|30|40|50}
- 范围表示：使用 *_min/*_max 双键；单值直接数值+单位
- 枚举与布尔：枚举使用字符串；布尔使用 true/false（如 zero_boil_off）
- Map 型字段：以 key→value 结构存储（如 bandwidth_khz_by_sequence）

## MRI Schema 键（示例）
- magnetSystem
  - field_strength_T、shielding、shimming、magnet_length_cm、patient_bore_cm
  - helium_consumption、uniformity_ppm_dsv_10/20/30/40/50、gauss_area、magnet_weight_kg
  - zero_boil_off、gauss_footprint_xyz_m（数组或对象）
- rfTransmit
  - max_power_kw、bandwidth_khz_by_sequence、frequency_precision_hz
  - cooling（水/风）、signal_transport（digital/optical）、tx_channels
- rfReceive
  - max_channels_by_sequence、rx_bandwidth_khz、dynamic_range_db
  - coil_types_and_channels（列表/对象）、interfaces_count、noise_figure_db
- gradientSystem
  - max_gradient_mT_m、slew_rate_T_m_s（或 mT_m_ms）、duty_cycle_pct
  - shielding、noise_reduction、cooling（水）、simultaneous_capability
- clinicalParams
  - fov_min_cm/fov_max_cm、layer_thickness_2d_mm/3d_mm
  - tr_te_min_by_matrix、echo_chain_max、epi_factor_max、dwi_te_ms_b1000
- sequences：SE/IR/GRE/EPI/FFE/RARE/UTE/CS/ASL 等
- advancedImaging：neuro/vascular/cardiac/abdomen/joint/spectroscopy/pTx
- advancedTech：silent、parallel_acquisition（2D/3D/校准）、motion_correction、online_postprocessing
- siteRequirements：power_kVA、min_area_m2、min_clear_height_m、5_gauss_footprint
- computerSystem：cpu_ghz_cores、memory_gb、storage_gb_ssd、display_inch_resolution、reconstruction_speed_images_s
- patientBed：min_height_cm、max_load_kg、max_speed_cm_s、move_precision_mm、travel_range_cm、scan_range_cm、in_bore_features
- configuration：standard_packages、third_party_equipment
- meta：importance_mark（★/▲）、is_key_spec、original_text、evidence_required、source_file/line、notes

## CT Schema 键（示例）
- gantry：aperture_cm、control_panels、noise_db、slip_ring_type、data_rate_gbps
- detector：rows、slices_per_rotation、elements_per_row、total_elements、z_coverage_cm、min_z_element_mm
- xraySystem：generator_power_kw、tube_voltage_min_kv/max_kv、tube_current_min_ma/max_ma、current_step_ma、cooling_rate_mhu_min、focal_spots、spot_sizes_mm
- scanReconstruction：rotation_time_s、temporal_resolution_ms、pitch_range、recon_speed_images_s、matrix_display/recon、ct_value_range_hu、spatial_resolution_lp_cm
- patientBed：scan_length_mm、range_mm、max_speed_mm_s、load_kg、min_height_cm
- software：mpr/mip/minip/ssd/vr、artifact_reduction、ai_packages
- scanningFunctions：cta/ctu、perfusion/stroke、spectral_suite、worklist/mpps
- siteRequirements：ups、precision_air_conditioning、electrical_distribution、shielding、room_layout
- configuration：standard_config_list、workstations、injector、monitoring
- meta：importance_mark、is_key_spec、original_text、evidence_required、source_file/line、notes

## 证据与追溯
- original_text：保留原文句段（必要时截断）
- evidence_required：布尔或分类（registration/manual/whitepaper/brochure/test_report）
- source_file / source_line：来源文件与行号锚点
- proof_mapping：clause → evidence_file → page/figure → highlight_note

## 解析管线
- 标记识别：抽取 ★/▲ 并映射 importance_mark/is_key_spec
- 指标抽取：正则捕获数值/区间/单位，归一化为数值 + 单位（优先工程真值）
- 功能抽取：序列/技术项归入集合；避免重复项与别名混淆
- 归类映射：按 Schema 键分类；模型特定键在 model_key 命名空间下维护
- 写入策略：
  - 首次写入仅空值填充（COALESCE）
  - allowOverride 切换覆盖行为（迁移脚本参数）
- 解析缓存：scripts/.cache/specs-json/{category}/{slug}.json（不提交）

## Markdown 写作规范
- 目的定位：买方导向（能力/核对/安装/配置/TCO）、卖方导向（投标条款/证据映射）
- 文件命名与路由
  - 买方版：*-specifications-buyer；卖方版：*-specifications-seller
  - canonical 与 translations 统一维护；语言前缀通过路由封装（LangLink）
- 内容结构
  - summary：设备卡片与 SEO 摘要
  - specsNote / featuresNote：解释与选型建议（买方语态，避免冗余规格）
  - specHighlights：3–8 项关键规格高亮（引用 DB，不复制）
  - 互链：买方↔卖方页面互相链接，保持语义清晰

## 前端消费
- 规格页筛选键：src/pages/DeviceSpecificationPage.tsx
- 对比页键映射：src/pages/DeviceComparisonPage.tsx
- 规格渲染组件：src/components/organisms/DeviceSpecifications.tsx
- 多语言：src/locales 与 translations JSONB 合并；避免 *_en/*_zh 旧字段

## 质量保障
- 单元解析用例：覆盖区间/单位/工程值/别名；保证数值与单位正确归一
- 渲染验收：抽样设备核对页面显示与 JSON 一致（含高亮与证据链接）
- 数据审计：记录 original_text 与 evidence_required，确保追溯能力

