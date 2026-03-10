// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.330Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase env. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

type ManufacturerRow = {
  id: string;
  slug: string;
  name?: string;
  name_en?: string;
  name_zh?: string;
  country?: string;
  published?: boolean;
};

const mappings = [
  {
    label: 'Anke',
    targetSlug: 'anke',
    candidateSlugs: ['anke', 'anke-medical'],
    defaultRow: {
      name_en: 'Anke Medical',
      name_zh: '安科医疗',
      country: 'China',
      published: true
    }
  },
  {
    label: 'Minfound (Mingfeng)',
    targetSlug: 'minfound',
    candidateSlugs: ['minfound', 'mingfeng-medical'],
    defaultRow: {
      name_en: 'Minfound Medical',
      name_zh: '明峰医疗',
      country: 'China',
      published: true
    }
  },
  {
    label: 'Changfeng (CHF)',
    targetSlug: 'chf',
    candidateSlugs: ['chf'],
    defaultRow: {
      name_en: 'Changfeng Imaging',
      name_zh: '长峰影像',
      country: 'China',
      published: true
    }
  }
];

async function ensureSlug({ label, targetSlug, candidateSlugs, defaultRow }: {
  label: string;
  targetSlug: string;
  candidateSlugs: string[];
  defaultRow: Partial<ManufacturerRow>;
}) {
  console.log(`\n[${label}] Ensuring slug "${targetSlug}"`);

  const { data: existingTarget, error: targetErr } = await supabase
    .from('manufacturers')
    .select('id, slug, name, name_en, name_zh, country, published')
    .eq('slug', targetSlug)
    .maybeSingle();
  if (targetErr) {
    console.error(`  Query error for target slug ${targetSlug}:`, targetErr);
    return;
  }

  if (existingTarget) {
    console.log(`  ✓ Target slug already exists: ${existingTarget.slug} (id=${existingTarget.id})`);
    return;
  }

  const candidates = [...candidateSlugs.filter(s => s !== targetSlug)];
  let sourceRow: ManufacturerRow | null = null;
  for (const cand of candidates) {
    const { data: candRow, error: candErr } = await supabase
      .from('manufacturers')
      .select('id, slug, name, name_en, name_zh, country, published')
      .eq('slug', cand)
      .maybeSingle();
    if (candErr) {
      console.warn(`  Candidate query error for ${cand}:`, candErr);
      continue;
    }
    if (candRow) {
      sourceRow = candRow as ManufacturerRow;
      console.log(`  Found candidate "${cand}" (id=${candRow.id}) → will rename to "${targetSlug}"`);
      break;
    }
  }

  if (sourceRow) {
    const { error: updErr } = await supabase
      .from('manufacturers')
      .update({ slug: targetSlug })
      .eq('id', sourceRow.id);
    if (updErr) {
      console.error(`  ✗ Failed to update slug to "${targetSlug}":`, updErr);
    } else {
      console.log(`  ✓ Updated slug "${sourceRow.slug}" → "${targetSlug}" (id=${sourceRow.id})`);
    }
    return;
  }

  const insertPayload = {
    slug: targetSlug,
    name: defaultRow.name_en || defaultRow.name_zh || targetSlug.toUpperCase(),
    name_en: defaultRow.name_en,
    name_zh: defaultRow.name_zh,
    country: defaultRow.country || 'China',
    published: defaultRow.published ?? true
  };

  const { data: insRow, error: insErr } = await supabase
    .from('manufacturers')
    .insert(insertPayload)
    .select()
    .maybeSingle();

  if (insErr) {
    console.error(`  ✗ Failed to insert "${targetSlug}":`, insErr);
  } else {
    console.log(`  ✓ Inserted manufacturer "${targetSlug}" (id=${insRow?.id})`);
  }
}

async function main() {
  for (const map of mappings) {
    await ensureSlug(map);
  }
  console.log('\nAll done.');
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
