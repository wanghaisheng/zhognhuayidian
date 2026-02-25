const fs = require('fs');
const path = require('path');

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }
function readText(p) { return fs.readFileSync(p, 'utf8'); }
function listMd(dir) { return fs.readdirSync(dir).filter(f => f.endsWith('.md')); }
function writeJson(p, obj) { fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8'); }

function classifyCategoryByFilename(fname) {
  const f = fname.toLowerCase();
  if (f.includes('mri')) return 'mri';
  if (f.includes('ct')) return 'ct';
  if (f.includes('dr')) return 'dr';
  return 'unknown';
}

function extractSections(lines) {
  const anchorIdx = lines.findIndex(l => /(关键词|技术要求)/.test(l));
  const useLines = anchorIdx >= 0 ? lines.slice(anchorIdx + 1) : lines;
  const sections = [];
  let current = { title: 'general', items: [] };
  const sectionStarts = [
    /具备超导磁体系统/,
    /具备射频发射系统/,
    /具备射频接收系统/,
    /具备核磁梯度系统/,
    /具备临床扫描参数/,
    /具备主控计算机系统/,
    /具备检查病床系统/,
    /具备磁共振扫描序列/,
    /具备磁共振高级成像技术/,
    /具备磁共振先进成像技术/,
    /满足磁共振安装场地要求/,
    /配置清单/
  ];

  for (const line of useLines) {
    const clean = line.trim().replace(/[；。]\s*$/, '');
    if (!clean) continue;
    const start = sectionStarts.find(re => re.test(clean));
    if (start) {
      if (current.items.length) sections.push(current);
      current = { title: clean.replace(/^\d+(\.\d+)?\s*/, ''), items: [] };
      continue;
    }
    // numbered items like "3.1 ..." or "★2.13 ..."
    if (/^([★▲]?\s*)?\d+(\.\d+)?/.test(clean)) {
      current.items.push(clean);
    }
  }
  if (current.items.length) sections.push(current);
  return sections;
}

function num(s) { const n = parseFloat(String(s)); return isNaN(n) ? null : n; }
function pick(re, text) { const m = text.match(re); return m ? m.slice(1) : null; }

function parseLineToKV(sectionTitle, line) {
  const isKey = /★/.test(line);
  const isImportant = /▲/.test(line);
  // Common captures
  // MRI magnet system
  let m;
  // -------- CT common specs --------
  if ((m = pick(/(\d{2,3})\s*(?:排|层)\s*CT/, line)) || (m = pick(/slice\s*count[:：]?\s*([0-9]+)/i, line))) {
    return { path: ['ctSpecs', 'slice_count'], value: num(m[0]), importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/机架(?:孔径|开孔直径)[^\d]*([0-9.]+)\s*cm/, line)) || (m = pick(/gantry\s*(?:aperture|bore)[^\d]*([0-9.]+)\s*cm/i, line))) {
    return { path: ['ctSpecs', 'gantry_aperture_cm'], value: num(m[0]), unit: 'cm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/旋转时间[^\d]*≤\s*([0-9.]+)\s*s/, line)) || (m = pick(/rotation\s*time[^\d]*≤\s*([0-9.]+)\s*s/i, line))) {
    return { path: ['ctSpecs', 'rotation_time_s'], value: num(m[0]), op: '<=', unit: 's', importance: { isKey, isImportant }, raw: line };
  }
  if (/螺旋扫描速度/.test(line) && (m = pick(/≤\s*([0-9.]+)\s*秒/, line))) {
    return { path: ['ctSpecs', 'rotation_time_s'], value: num(m[0]), op: '<=', unit: 's', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/Z[-\s]?轴覆盖[^\d]*≥\s*([0-9.]+)\s*mm/, line)) || (m = pick(/z[-\s]?coverage[^\d]*≥\s*([0-9.]+)\s*mm/i, line))) {
    return { path: ['ctSpecs', 'z_coverage_mm'], value: num(m[0]), op: '>=', unit: 'mm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/Z轴宽度[^\d]*≥\s*([0-9.]+)\s*cm/, line))) {
    return { path: ['ctSpecs', 'z_coverage_cm'], value: num(m[0]), op: '>=', unit: 'cm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/Z轴宽度.*单源CT[^\d]*[≥>＞]\s*([0-9.]+)\s*cm/, line))) {
    return { path: ['ctSpecs', 'z_coverage_cm'], value: num(m[0]), op: '>=', unit: 'cm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/探测器(?:排|行)数[^\d]*([0-9]+)/, line)) || (m = pick(/detector\s*rows[^\d]*([0-9]+)/i, line))) {
    return { path: ['ctSpecs', 'detector_rows'], value: num(m[0]), importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/探测器层数[^\d]*[≥>＞]\s*([0-9]+)\s*层/, line)) || (m = pick(/detector\s*layers[^\d]*[≥>＞]\s*([0-9]+)/i, line))) {
    return { path: ['ctSpecs', 'detector_layers'], value: num(m[0]), op: '>=', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/每排探测器物理个数[^\d]*≥\s*([0-9]+)/, line))) {
    return { path: ['ctSpecs', 'detector_elements_per_row'], value: num(m[0]), op: '>=', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/每排探测器(?:物理)?(?:单元)?个数[^\d]*≥\s*([0-9]+)/, line))) {
    return { path: ['ctSpecs', 'detector_elements_per_row'], value: num(m[0]), op: '>=', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/探测器单元总数[^\d]*[≥>＞]\s*([0-9.]+)\s*个/, line))) {
    return { path: ['ctSpecs', 'detector_elements_total'], value: num(m[0]), op: '>=', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/每秒采样次数.*≥\s*([0-9]+)\s*采样.*360°/, line)) || (m = pick(/SPS[^\d]*≥\s*([0-9]+)/i, line))) {
    return { path: ['ctSpecs', 'sps_per_360'], value: num(m[0]), op: '>=', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/(?:DAS|数据采集系统).*每秒数据采样率[^\d]*[≥>＞]\s*([0-9.]+)\s*Hz/i, line)) || (m = pick(/采样率[^\d]*[≥>＞]\s*([0-9.]+)\s*Hz/i, line))) {
    const op = /≥|＞/.test(line) ? '>=' : '>';
    return { path: ['ctSpecs', 'das_sampling_rate_Hz'], value: num(m[0]), op, unit: 'Hz', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/轴位扫描成像[^\d]*≥\s*([0-9]+)\s*层\/360°/, line))) {
    return { path: ['ctSpecs', 'axial_layers_per_360'], value: num(m[0]), op: '>=', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/焦点到探测器的距离[^\d]*[≥>＞]\s*([0-9.]+)\s*mm/, line))) {
    return { path: ['ctSpecs', 'focus_to_detector_distance_mm'], value: num(m[0]), op: '>=', unit: 'mm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/探测器Z轴最小物理尺寸[^\d]*≤\s*([0-9.]+)\s*mm/, line)) || (m = pick(/Z轴最小物理尺寸[^\d]*≤\s*([0-9.]+)\s*mm/, line))) {
    return { path: ['ctSpecs', 'z_min_physical_size_mm'], value: num(m[0]), op: '<=', unit: 'mm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/图像扫描矩阵[^\d]*≥\s*([0-9]+)\s*[×x]\s*([0-9]+)/, line)) || (m = pick(/重建矩阵(?:像素)?[^\d]*≥\s*([0-9]+)\s*[×x]\s*([0-9]+)/, line))) {
    return { path: ['ctSpecs', 'scan_matrix_min_pixels'], value: { width: num(m[0]), height: num(m[1]) }, importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/最小重建层厚[^\d]*≤\s*([0-9.]+)\s*mm/, line))) {
    return { path: ['ctSpecs', 'min_recon_layer_thickness_mm'], value: num(m[0]), op: '<=', unit: 'mm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/最大定位像长度[^\d]*≥\s*([0-9.]+)\s*mm/, line))) {
    return { path: ['ctSpecs', 'max_scout_length_mm'], value: num(m[0]), op: '>=', unit: 'mm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/CT值范围[:：]?\s*([+\-]?[0-9.]+)\s*[\-~～]\s*([+\-]?[0-9.]+)\s*HU/i, line))) {
    return { path: ['ctSpecs', 'ct_value_range_HU'], value: { min: num(m[0]), max: num(m[1]) }, unit: 'HU', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/管电压[^\d]*([0-9]{2,3})\s*kV/i, line))) {
    return { path: ['ctSpecs', 'tube_voltage_kV'], value: num(m[0]), unit: 'kV', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/管电流[^\d]*([0-9]{1,4})\s*mA\s*-\s*([0-9]{1,4})\s*mA/i, line))) {
    return { path: ['ctSpecs', 'tube_current_range_mA'], value: { min: num(m[0]), max: num(m[1]) }, unit: 'mA', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/管电流[^\d]*([0-9]{1,4})\s*mA/i, line))) {
    return { path: ['ctSpecs', 'tube_current_mA'], value: num(m[0]), unit: 'mA', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/台车速度[^\d]*≥\s*([0-9.]+)\s*mm\/s/, line)) || (m = pick(/table\s*speed[^\d]*≥\s*([0-9.]+)\s*mm\/s/i, line))) {
    return { path: ['ctSpecs', 'table_speed_mm_s'], value: num(m[0]), op: '>=', unit: 'mm/s', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/每旋转覆盖长度[^\d]*≥\s*([0-9.]+)\s*mm/, line))) {
    return { path: ['ctSpecs', 'coverage_per_rotation_mm'], value: num(m[0]), op: '>=', unit: 'mm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/(?:病人)?床水平移动(?:最大|最高)速度[^\d]*≥\s*([0-9.]+)\s*mm\/s/, line))) {
    return { path: ['patientBed', 'max_speed_mm_s'], value: num(m[0]), op: '>=', unit: 'mm/s', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/(?:病人)?床水平移动(?:最小|最低)速度[^\d]*≤\s*([0-9.]+)\s*mm\/s/, line))) {
    return { path: ['patientBed', 'min_speed_mm_s'], value: num(m[0]), op: '<=', unit: 'mm/s', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/最大可移动范围[^\d]*≥\s*([0-9.]+)\s*mm/, line))) {
    return { path: ['patientBed', 'horizontal_move_range_mm'], value: num(m[0]), op: '>=', unit: 'mm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/(?:病人)?床水平(?:可扫描|移动)距离[^\d]*≥\s*([0-9.]+)\s*(mm|cm)/, line))) {
    const val = num(m[0]) * (m[1].toLowerCase() === 'cm' ? 10 : 1);
    return { path: ['patientBed', 'horizontal_move_range_mm'], value: val, op: '>=', unit: 'mm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/床面可降至离地面最低距离[^\d]*≤\s*([0-9.]+)\s*mm/, line))) {
    return { path: ['patientBed', 'min_height_mm'], value: num(m[0]), op: '<=', unit: 'mm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/垂直升降最低点[^\d]*≤\s*([0-9.]+)\s*cm/, line))) {
    return { path: ['patientBed', 'min_height_mm'], value: num(m[0]) * 10, op: '<=', unit: 'mm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/最大可扫描长度[^\d]*≥\s*([0-9.]+)\s*mm/, line))) {
    return { path: ['patientBed', 'max_scan_length_mm'], value: num(m[0]), op: '>=', unit: 'mm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/螺旋扫描最大可扫描长度[^\d]*≥\s*([0-9.]+)\s*mm/, line))) {
    return { path: ['patientBed', 'spiral_max_scan_length_mm'], value: num(m[0]), op: '>=', unit: 'mm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/滑环数据传输速度[^\d]*≥\s*([0-9.]+)\s*Gbps/i, line))) {
    return { path: ['ctSpecs', 'ring_data_rate_Gbps'], value: num(m[0]), op: '>=', unit: 'Gbps', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/噪音[^\d]*≤\s*([0-9.]+)\s*dB/i, line))) {
    return { path: ['ctSpecs', 'gantry_noise_dB'], value: num(m[0]), op: '<=', unit: 'dB', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/高压发生器最大功率[^\d]*[≥>＞]\s*([0-9.]+)\s*KW/i, line))) {
    const op = /≥/.test(line) ? '>=' : '>';
    return { path: ['ctSpecs', 'generator_power_kW'], value: num(m[0]), op, unit: 'kW', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/管电压输出档位[^\d]*≥\s*([0-9]+)\s*档/, line))) {
    return { path: ['ctSpecs', 'tube_voltage_gears'], value: num(m[0]), op: '>=', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/球管焦点到探测器距离[^\d]*≤\s*([0-9.]+)\s*cm/, line))) {
    return { path: ['ctSpecs', 'focus_to_detector_distance_cm'], value: num(m[0]), op: '<=', unit: 'cm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/球管焦点到扫描野中心距离[^\d]*≥\s*([0-9.]+)\s*cm/, line))) {
    return { path: ['ctSpecs', 'focus_to_iso_distance_cm'], value: num(m[0]), op: '>=', unit: 'cm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/重建视野范围[:：]\s*([0-9.]+)\s*[\-~～]\s*([0-9.]+)\s*cm/, line))) {
    return { path: ['ctSpecs', 'recon_fov_cm_range'], value: { min: num(m[0]), max: num(m[1]) }, unit: 'cm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/CT螺距\s*([0-9.]+)\s*[\-~～]\s*([0-9.]+)/, line))) {
    return { path: ['ctSpecs', 'pitch_range'], value: { min: num(m[0]), max: num(m[1]) }, importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/单次连续螺旋扫描时长[^\d]*≥\s*([0-9.]+)\s*秒/, line))) {
    return { path: ['ctSpecs', 'single_spiral_scan_duration_s'], value: num(m[0]), op: '>=', unit: 's', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/X[-\s]?Y轴空间分辨率[:：]?\s*≥\s*([0-9.]+)\s*LP\/cm/i, line))) {
    return { path: ['ctSpecs', 'xy_resolution_lp_per_cm'], value: num(m[0]), op: '>=', unit: 'LP/cm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/密度分辨率[:：]?\s*≤\s*([0-9.]+)\s*mm@([0-9.]+)%/, line))) {
    return { path: ['ctSpecs', 'density_resolution'], value: { mm: num(m[0]), percent: num(m[1]) }, importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/CT值范围[:：]\s*([+\-]?[0-9.]+)\s*[\-~～]\s*([+\-]?[0-9.]+)\s*HU/i, line))) {
    return { path: ['ctSpecs', 'ct_value_range_HU'], value: { min: num(m[0]), max: num(m[1]) }, unit: 'HU', importance: { isKey, isImportant }, raw: line };
  }
  // -------- MRI magnet system --------
  if ((m = pick(/磁场强度\s*([0-9.]+)\s*T/, line))) {
    return { path: ['magnetSystem', 'field_strength_T'], value: num(m[0]), unit: 'T', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/孔径[^\d]*≥\s*([0-9.]+)\s*cm/, line)) || (m = pick(/最窄孔径[^\d]*≥\s*([0-9.]+)\s*cm/, line))) {
    return { path: ['magnetSystem', 'patient_bore_cm'], value: num(m[0]), op: '>=', unit: 'cm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/液氦消耗量.*?：\s*(.+)$/, line))) {
    return { path: ['magnetSystem', 'helium_consumption'], value: m[0], importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/液氦容积[^\d]*≤\s*([0-9.]+)\s*升/, line))) {
    return { path: ['magnetSystem', 'helium_volume_L'], value: num(m[0]), op: '<=', unit: 'L', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/高斯线范围[^\d]*≤\s*([0-9.]+)\s*m\s*x\s*([0-9.]+)\s*m/, line))) {
    return { path: ['magnetSystem', 'gauss_line_range_m'], value: [num(m[0]), num(m[1])], op: '<=', unit: 'm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/磁体长度.*?≤\s*([0-9.]+)\s*cm/, line))) {
    return { path: ['magnetSystem', 'magnet_length_cm'], value: num(m[0]), op: '<=', unit: 'cm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/磁体重量.*?≤\s*([0-9.]+)\s*kg/, line))) {
    return { path: ['magnetSystem', 'magnet_weight_kg'], value: num(m[0]), op: '<=', unit: 'kg', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/均匀度.*?10cm\s*DSV[^\d]*≤\s*([0-9.]+)\s*ppm/, line))) {
    return { path: ['magnetSystem', 'uniformity_ppm_dsv_10'], value: num(m[0]), op: '<=', unit: 'ppm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/均匀度.*?20cm\s*DSV[^\d]*≤\s*([0-9.]+)\s*ppm/, line))) {
    return { path: ['magnetSystem', 'uniformity_ppm_dsv_20'], value: num(m[0]), op: '<=', unit: 'ppm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/均匀度.*?30cm\s*DSV[^\d]*≤\s*([0-9.]+)\s*ppm/, line))) {
    return { path: ['magnetSystem', 'uniformity_ppm_dsv_30'], value: num(m[0]), op: '<=', unit: 'ppm', importance: { isKey, isImportant }, raw: line };
  }
  // RF transmit
  if ((m = pick(/频率控制精度[^\d]*≤\s*([0-9.]+)\s*Hz/, line))) {
    return { path: ['rfTransmit', 'frequency_precision_Hz'], value: num(m[0]), op: '<=', unit: 'Hz', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/射频发射总带宽要求[^\d]*≤\s*([0-9.]+)\s*kHz/, line))) {
    // sequence may be in context: T1/T2/PD/SWI/DWI
    const seq = line.match(/(T1|T2|PD|SWI|DWI)/i)?.[1]?.toUpperCase() || 'GENERAL';
    return { path: ['rfTransmit', 'bandwidth_kHz_by_sequence', seq], value: num(m[0]), op: '<=', unit: 'kHz', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/射频发射最大功率[^\d]*≤\s*([0-9.]+)\s*kW/, line))) {
    return { path: ['rfTransmit', 'max_power_kW'], value: num(m[0]), op: '<=', unit: 'kW', importance: { isKey, isImportant }, raw: line };
  }
  // RF receive
  if ((m = pick(/各通道接收带宽[^\d]*≥\s*([0-9.]+)\s*MHz/, line))) {
    return { path: ['rfReceive', 'min_receive_bandwidth_MHz'], value: num(m[0]), op: '>=', unit: 'MHz', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/最高接收动态范围[^\d]*≥\s*([0-9.]+)\s*dB/i, line))) {
    return { path: ['rfReceive', 'max_dynamic_range_dB'], value: num(m[0]), op: '>=', unit: 'dB', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/线圈接口数量[^\d]*≥\s*([0-9.]+)/, line)) || (m = pick(/最大线圈接口数量[^\d]*≥\s*([0-9.]+)/, line))) {
    return { path: ['rfReceive', 'interface_count'], value: num(m[0]), op: '>=', importance: { isKey, isImportant }, raw: line };
  }
  // Gradient
  if ((m = pick(/最大单轴梯度场强度.*?≥\s*([0-9.]+)\s*mT\/m/, line))) {
    return { path: ['gradientSystem', 'max_gradient_mT_m'], value: num(m[0]), op: '>=', unit: 'mT/m', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/最大单轴梯度切换率.*?≥\s*([0-9.]+)\s*mT\/m\/ms/, line))) {
    return { path: ['gradientSystem', 'max_slew_rate_mT_m_ms'], value: num(m[0]), op: '>=', unit: 'mT/m/ms', importance: { isKey, isImportant }, raw: line };
  }
  // Clinical params
  if ((m = pick(/最小扫描视野[^\d]*≤\s*([0-9.]+)\s*cm/, line))) {
    return { path: ['clinicalParams', 'fov_min_cm'], value: num(m[0]), op: '<=', unit: 'cm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/最大扫描视野[^\d]*≥\s*([0-9.]+)\s*cm/, line))) {
    return { path: ['clinicalParams', 'fov_max_cm'], value: num(m[0]), op: '>=', unit: 'cm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/最小二维层厚[^\d]*≤\s*([0-9.]+)\s*mm/, line))) {
    return { path: ['clinicalParams', 'min_2d_layer_thickness_mm'], value: num(m[0]), op: '<=', unit: 'mm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/最小三维层厚[^\d]*≤\s*([0-9.]+)\s*mm/, line))) {
    return { path: ['clinicalParams', 'min_3d_layer_thickness_mm'], value: num(m[0]), op: '<=', unit: 'mm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/最短TR时间.*?≤\s*([0-9.]+)\s*ms/, line))) {
    const seq = line.match(/自旋回波|快速自旋回波|梯度回波|平面回波|DWI|EPI/i)?.[0] || 'sequence';
    const matrix = line.match(/\(([^)]+)\)/)?.[1] || '';
    return { path: ['clinicalParams', 'min_TR_ms'], value: num(m[0]), meta: { seq, matrix }, op: '<=', unit: 'ms', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/最短TE时间.*?≤\s*([0-9.]+)\s*ms/, line))) {
    const seq = line.match(/自旋回波|快速自旋回波|梯度回波|平面回波|DWI|EPI/i)?.[0] || 'sequence';
    const matrix = line.match(/\(([^)]+)\)/)?.[1] || '';
    return { path: ['clinicalParams', 'min_TE_ms'], value: num(m[0]), meta: { seq, matrix }, op: '<=', unit: 'ms', importance: { isKey, isImportant }, raw: line };
  }
  // Computer system
  if ((m = pick(/CPU[^\d]*≥\s*([0-9.]+)\s*GHZ.*（?六核/i, line))) {
    return { path: ['computerSystem', 'cpu_GHz'], value: num(m[0]), op: '>=', unit: 'GHz', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/内存大小[^\d]*≥\s*([0-9.]+)\s*GB/, line))) {
    return { path: ['computerSystem', 'memory_GB'], value: num(m[0]), op: '>=', unit: 'GB', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/硬盘容量[^\d]*≥\s*([0-9.]+)\s*GB/, line))) {
    return { path: ['computerSystem', 'storage_GB'], value: num(m[0]), op: '>=', unit: 'GB', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/图像重建速度.*?≥\s*([0-9.]+)\s*幅\/秒/, line))) {
    return { path: ['computerSystem', 'reconstruction_speed_fps'], value: num(m[0]), op: '>=', unit: 'fps', importance: { isKey, isImportant }, raw: line };
  }
  // Patient bed
  if ((m = pick(/最低床位[^\d]*≤\s*([0-9.]+)\s*cm/, line))) {
    return { path: ['patientBed', 'min_height_cm'], value: num(m[0]), op: '<=', unit: 'cm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/最大承重[^\d]*≥\s*([0-9.]+)\s*kg/, line))) {
    return { path: ['patientBed', 'max_load_kg'], value: num(m[0]), op: '>=', unit: 'kg', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/最大床速[^\d]*≥\s*([0-9.]+)\s*cm\/s/, line))) {
    return { path: ['patientBed', 'max_speed_cm_s'], value: num(m[0]), op: '>=', unit: 'cm/s', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/移动精度[^\d]*≤\s*±?([0-9.]+)\s*mm/, line))) {
    return { path: ['patientBed', 'move_precision_mm'], value: num(m[0]), op: '<=', unit: 'mm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/最大水平移动范围[^\d]*≥\s*([0-9.]+)\s*cm/, line))) {
    return { path: ['patientBed', 'horizontal_move_range_cm'], value: num(m[0]), op: '>=', unit: 'cm', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/最大扫描范围[^\d]*≥\s*([0-9.]+)\s*cm/, line))) {
    return { path: ['patientBed', 'scan_range_cm'], value: num(m[0]), op: '>=', unit: 'cm', importance: { isKey, isImportant }, raw: line };
  }
  // Site requirements
  if ((m = pick(/电源连接容量[^\d]*≤\s*([0-9.]+)\s*kVA/i, line))) {
    return { path: ['siteRequirements', 'power_capacity_kVA'], value: num(m[0]), op: '<=', unit: 'kVA', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/最小安装面积[^\d]*≤\s*([0-9.]+)\s*m2/, line))) {
    return { path: ['siteRequirements', 'min_area_m2'], value: num(m[0]), op: '<=', unit: 'm2', importance: { isKey, isImportant }, raw: line };
  }
  if ((m = pick(/最低净层高要求[^\d]*≤\s*([0-9.]+)\s*m/, line))) {
    return { path: ['siteRequirements', 'min_clear_height_m'], value: num(m[0]), op: '<=', unit: 'm', importance: { isKey, isImportant }, raw: line };
  }
  // Sequences & advanced tech: capture lists
  if (/提供.*序列/.test(line)) {
    return { path: ['sequences', 'items'], value: line.replace(/^\d+(\.\d+)?\s*/, ''), importance: { isKey, isImportant }, raw: line, append: true };
  }
  if (/提供.*成像技术/.test(line) || /并行采集/.test(line) || /静音成像/.test(line) || /运动伪影校正/.test(line) || /在线自动/.test(line)) {
    return { path: ['advancedTech', 'items'], value: line.replace(/^\d+(\.\d+)?\s*/, ''), importance: { isKey, isImportant }, raw: line, append: true };
  }
  if (/临床应用软件/.test(line) || /软件/.test(line) || /功能/.test(line)) {
    return { path: ['software', 'items'], value: line.replace(/^\d+(\.\d+)?\s*/, ''), importance: { isKey, isImportant }, raw: line, append: true };
  }
  // Fallback: keep raw
  return { path: ['rawItems'], value: line, importance: { isKey, isImportant }, raw: line, append: true };
}

function normalizeEnumsFromLine(data, line) {
  const txt = line.toLowerCase();
  if (/屏蔽方式|shielding/.test(line)) {
    if (txt.includes('主动')) data.enums.shielding = 'active';
    if (txt.includes('被动')) data.enums.shielding = data.enums.shielding ? data.enums.shielding + '+passive' : 'passive';
    if (txt.includes('抗外界电磁干扰')) data.enums.shielding = (data.enums.shielding || '') + (data.enums.shielding ? '+emi-protection' : 'emi-protection');
  }
  if (/匀场方式|shimming/.test(line)) {
    if (txt.includes('超导线圈')) data.enums.shimming = 'superconducting-coil';
    if (txt.includes('主动') && txt.includes('被动')) data.enums.shimming = 'active+passive';
  }
  if (/冷却方式|cooling/.test(line)) {
    if (txt.includes('水冷')) data.enums.cooling = 'water';
    if (txt.includes('风冷') || txt.includes('空冷')) data.enums.cooling = 'air';
  }
  if (/传输方式|signal\s*transport|数据传输/.test(line)) {
    if (txt.includes('数字')) data.enums.transport = 'digital';
    if (txt.includes('光纤')) data.enums.transport = 'optical';
  }
}

function setDeep(obj, pathArr, value, meta = {}) {
  let cur = obj;
  for (let i = 0; i < pathArr.length; i++) {
    const key = pathArr[i];
    if (i === pathArr.length - 1) {
      cur[key] = value;
    } else {
      cur[key] = cur[key] || {};
      cur = cur[key];
    }
  }
  if (meta.op || meta.unit || meta.meta) {
    // Attach constraint metadata alongside value
    const key = pathArr[pathArr.length - 1];
    const parent = pathArr.slice(0, -1).reduce((o, k) => o[k], obj);
    parent[key + '_meta'] = { op: meta.op, unit: meta.unit, ...(meta.meta || {}) };
  }
}

function appendDeep(obj, pathArr, value) {
  let cur = obj;
  for (let i = 0; i < pathArr.length; i++) {
    const key = pathArr[i];
    if (i === pathArr.length - 1) {
      cur[key] = Array.isArray(cur[key]) ? cur[key] : [];
      cur[key].push(value);
    } else {
      cur[key] = cur[key] || {};
      cur = cur[key];
    }
  }
}

function parseFile(filePath) {
  const text = readText(filePath);
  const lines = text.split(/\r?\n/);
  const sections = extractSections(lines);
  const result = {
    source_file: path.basename(filePath),
    category_hint: classifyCategoryByFilename(path.basename(filePath)),
    parsed_at: new Date().toISOString(),
    sections: [],
    summary: {
      key_items_count: 0,
      important_items_count: 0
    }
  };
  const data = {
    magnetSystem: {},
    rfTransmit: {},
    rfReceive: {},
    gradientSystem: {},
    clinicalParams: {},
    computerSystem: {},
    patientBed: {},
    ctSpecs: {},
    sequences: { items: [] },
    advancedTech: { items: [] },
    software: { items: [] },
    siteRequirements: {},
    configuration: {},
    rawItems: [],
    enums: {}
  };
  let keyCount = 0, importantCount = 0;
  let matchedCount = 0, rawCount = 0;
  for (const sec of sections) {
    const secObj = { title: sec.title, items: [], matched: 0, total: 0 };
    for (const line of sec.items) {
      const kv = parseLineToKV(sec.title, line);
      if (kv.importance?.isKey) keyCount++;
      if (kv.importance?.isImportant) importantCount++;
      if (kv.append) {
        appendDeep(data, kv.path, kv.value);
      } else {
        setDeep(data, kv.path, kv.value, { op: kv.op, unit: kv.unit, meta: kv.meta });
      }
      normalizeEnumsFromLine(data, line);
      secObj.items.push({ text: line, importance: kv.importance, mapped_path: kv.path });
      secObj.total++;
      if (kv.path[0] === 'rawItems') {
        rawCount++;
      } else {
        matchedCount++;
        secObj.matched++;
      }
    }
    result.sections.push(secObj);
  }
  result.summary.key_items_count = keyCount;
  result.summary.important_items_count = importantCount;
  result.summary.matched_items_count = matchedCount;
  result.summary.raw_items_count = rawCount;
  result.summary.coverage = {
    total_items: matchedCount + rawCount,
    matched_percentage: (matchedCount + rawCount) ? Math.round((matchedCount / (matchedCount + rawCount)) * 100) : 0
  };
  result.summary.category_coverage = result.sections.map(s => ({
    title: s.title,
    matched: s.matched,
    total: s.total,
    matched_percentage: s.total ? Math.round((s.matched / s.total) * 100) : 0
  }));
  result.data = data;
  return result;
}

function main() {
  const root = process.cwd();
  const srcDir = path.join(root, 'data', 'rawdata', 'specifications');
  const outRoot = path.join(root, 'data', 'processed', 'specifications');
  ensureDir(outRoot);
  const files = listMd(srcDir);
  if (!files.length) {
    console.log('No specification markdown files found.');
    return;
  }
  let count = 0;
  for (const f of files) {
    const filePath = path.join(srcDir, f);
    const parsed = parseFile(filePath);
    const category = parsed.category_hint || 'unknown';
    const outDir = path.join(outRoot, category);
    ensureDir(outDir);
    const outPath = path.join(outDir, f.replace(/\.md$/i, '.json'));
    writeJson(outPath, parsed);
    count++;
    console.log(`Parsed ${f} -> ${path.relative(root, outPath)}`);
  }
  console.log(`Done. Parsed ${count} files.`);
}

main();
