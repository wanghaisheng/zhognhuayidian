import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'
import yaml from 'js-yaml'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function listMd(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter(f => f.endsWith('.md'))
}

function readText(p) {
  return fs.readFileSync(p, 'utf-8')
}

function parseFrontMatter(content) {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontMatterRegex)
  if (!match) return { data: {}, body: content }
  const [, frontMatterStr, bodyContent] = match
  try {
    const data = yaml.load(frontMatterStr)
    return { data: data || {}, body: bodyContent }
  } catch {
    return { data: {}, body: bodyContent }
  }
}

function markdownToHtml(markdown) {
  return marked.parse(markdown)
}

function generateExcerpt(content, maxLength = 200) {
  const plain = content
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()
  if (plain.length <= maxLength) return plain
  const truncated = plain.substring(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')
  return lastSpaceIndex > 0 ? truncated.substring(0, lastSpaceIndex) + '...' : truncated + '...'
}

function getCategories(contentDir) {
  if (!fs.existsSync(contentDir)) return []
  return fs.readdirSync(contentDir).filter(f => {
    const p = path.join(contentDir, f)
    return fs.statSync(p).isDirectory()
  })
}

async function buildSnapshots(locales) {
  const contentDir = path.join(root, 'content')
  const outRoot = path.join(root, 'src', 'data', 'snapshots')
  let total = 0
  for (const category of getCategories(contentDir)) {
    for (const locale of locales) {
      const srcDir = path.join(contentDir, category, locale)
      if (!fs.existsSync(srcDir)) continue
      const files = listMd(srcDir)
      const outDir = path.join(outRoot, locale, 'content', category)
      ensureDir(outDir)
      // Clean stale snapshots: remove JSON files not present in markdown list
      const existingJson = fs.readdirSync(outDir).filter(f => f.endsWith('.json'))
      const validSlugs = new Set(files.map(f => f.replace(/\.md$/, '')))
      for (const jf of existingJson) {
        const slug = jf.replace(/\.json$/i, '')
        if (!validSlugs.has(slug)) {
          try {
            fs.unlinkSync(path.join(outDir, jf))
          } catch {}
        }
      }
      for (const file of files) {
        const slug = file.replace(/\.md$/, '')
        const raw = readText(path.join(srcDir, file))
        const { data, body } = parseFrontMatter(raw)
        const html = await markdownToHtml(body)
        const excerpt = generateExcerpt(body)
        const payload = {
          slug,
          frontMatter: data || {},
          content: body,
          htmlContent: html,
          excerpt
        }
        fs.writeFileSync(path.join(outDir, `${slug}.json`), JSON.stringify(payload))
        total++
      }
    }
  }
  return total
}

async function main() {
  const args = process.argv.slice(2)
  const locales = args.length ? args.map(a => a.toLowerCase()) : ['en', 'zh']
  const count = await buildSnapshots(locales)
  console.log(`Markdown snapshots generated: ${count}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
