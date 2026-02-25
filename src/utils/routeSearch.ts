export type CompareSearch = {
  devices?: string;
  collapsed?: string;
  diff?: string;
  dense?: string;
};

export const validateCompareSearch = (search: Record<string, unknown>): CompareSearch => {
  const max = 4;
  const sanitizeCsv = (val: unknown) => {
    if (typeof val !== 'string') return undefined;
    const parts = val
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .filter(s => /^[a-zA-Z0-9-_]+$/.test(s));
    const dedup: string[] = [];
    for (const p of parts) if (!dedup.includes(p)) dedup.push(p);
    const sliced = dedup.slice(0, max);
    return sliced.length ? sliced.join(',') : undefined;
  };
  const allowedCollapsed = new Set([
    'deviceComparison.basicInfo',
    'deviceComparison.coreSpecs',
    'deviceComparison.performance',
    'deviceComparison.electrical',
    'deviceComparison.physical',
    'deviceComparison.features',
    'deviceComparison.certifications',
  ]);
  const sanitizeCollapsed = (val: unknown) => {
    if (typeof val !== 'string') return undefined;
    const parts = val
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .filter(s => allowedCollapsed.has(s));
    const dedup: string[] = [];
    for (const p of parts) if (!dedup.includes(p)) dedup.push(p);
    return dedup.length ? dedup.join(',') : undefined;
  };
  return {
    devices: sanitizeCsv(search.devices),
    collapsed: sanitizeCollapsed(search.collapsed),
    diff:
      typeof search.diff === 'string' &&
      ['1', 'true'].includes(search.diff.toLowerCase())
        ? '1'
        : undefined,
    dense:
      typeof search.dense === 'string' &&
      ['1', 'true'].includes(search.dense.toLowerCase())
        ? '1'
        : undefined,
  };
};
