/**
 * 從本地 CMS (Strapi) 匯出資料到 src/data/ 靜態檔案
 * 同時下載媒體檔案到 public/uploads/
 *
 * Usage: node scripts/export-cms.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DATA_DIR = path.join(ROOT, 'src/data')
const UPLOADS_DIR = path.join(ROOT, 'public/uploads')

const CMS_URL = 'http://localhost:1337'

// ── Helpers ──────────────────────────────────────────────

async function fetchApi(endpoint, params = {}) {
  const url = new URL(`${CMS_URL}/api/${endpoint}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`API ${endpoint} failed: ${res.status}`)
  const json = await res.json()
  return json.data
}

async function downloadMedia(media) {
  if (!media) return null
  const mediaUrl = media.url || media
  if (!mediaUrl) return null

  const fullUrl = mediaUrl.startsWith('http') ? mediaUrl : `${CMS_URL}${mediaUrl}`
  const filename = path.basename(mediaUrl)
  const localPath = path.join(UPLOADS_DIR, filename)

  // 已下載過就跳過
  if (fs.existsSync(localPath)) {
    return `/uploads/${filename}`
  }

  const res = await fetch(fullUrl)
  if (!res.ok) {
    console.warn(`  ⚠ 下載失敗: ${fullUrl}`)
    return null
  }

  const buffer = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(localPath, buffer)
  console.log(`  📥 ${filename}`)
  return `/uploads/${filename}`
}

function writeDataFile(filename, varName, data, isDefault = false) {
  const filePath = path.join(DATA_DIR, filename)
  const json = JSON.stringify(data, null, 2)
  const exportStatement = isDefault
    ? `export const ${varName} = ${json}\n`
    : `export const ${varName} = ${json}\n`
  fs.writeFileSync(filePath, exportStatement)
  console.log(`  ✅ ${filename}`)
}

// ── Export Experiences ────────────────────────────────────

async function exportExperiences() {
  console.log('\n📋 匯出工作經歷...')
  const items = await fetchApi('experiences', {
    populate: '*',
    sort: 'sortOrder:asc',
  })

  if (!items?.length) {
    console.log('  ⚠ CMS 沒有工作經歷資料，跳過')
    return
  }

  const experiences = []
  for (const exp of items) {
    const logo = await downloadMedia(exp.logo)
    experiences.push({
      id: exp.externalId || exp.slug || exp.id,
      logo: logo,
      company: exp.company,
      role: exp.role || '',
      dateRange: exp.dateRange || '',
      highlights: exp.highlights || [],
      responsibilities: exp.responsibilities || [],
      works: exp.works || '',
    })
  }

  writeDataFile('experiences.js', 'experiences', experiences)
}

// ── Export Projects ──────────────────────────────────────

async function exportProjects() {
  console.log('\n🎨 匯出作品集...')
  const items = await fetchApi('projects', {
    'populate[0]': 'coverImage',
    'populate[1]': 'images',
    'populate[2]': 'meta',
    'populate[3]': 'detail',
    sort: 'sortOrder:asc',
  })

  if (!items?.length) {
    console.log('  ⚠ CMS 沒有作品資料，跳過')
    return
  }

  const projects = []
  for (const p of items) {
    const coverImage = await downloadMedia(p.coverImage)
    const images = []
    if (p.images?.length) {
      for (const img of p.images) {
        const imgUrl = await downloadMedia(img)
        if (imgUrl) images.push(imgUrl)
      }
    }

    projects.push({
      id: p.externalId || p.slug || p.id,
      tag: p.tag || '',
      title: p.title,
      subtitle: p.subtitle || '',
      coverImage: coverImage,
      meta: p.meta
        ? {
            client: p.meta.client || '',
            year: p.meta.year || '',
            role: p.meta.role || '',
            team: p.meta.team || '',
          }
        : {},
      images: images,
      detail: p.detail
        ? {
            projectTypes: p.detail.projectTypes || [],
            industryTypes: p.detail.industryTypes || [],
            taskTags: p.detail.taskTags || [],
            links: p.detail.links || [],
            goal: p.detail.goal || '',
            designSections: p.detail.designSections || [],
          }
        : null,
    })
  }

  writeDataFile('projects.js', 'projects', projects)
}

// ── Export Resume ────────────────────────────────────────

async function exportResume() {
  console.log('\n📄 匯出履歷...')
  const d = await fetchApi('resume', { populate: '*' })

  if (!d) {
    console.log('  ⚠ CMS 沒有履歷資料，跳過')
    return
  }

  const avatar = await downloadMedia(d.avatar)
  const resumePdf = await downloadMedia(d.resumePdf)

  const resume = {
    name: d.name,
    nameEn: d.nameEn || '',
    intro: d.intro || [],
    skills: d.skills || [],
    education: d.education || [],
    featuredWorks: d.featuredWorks || [],
    workExperience: d.workExperience || [],
    avatar: avatar,
    resumePdf: resumePdf,
  }

  writeDataFile('resume.js', 'resume', resume)
}

// ── Main ────────────────────────────────────────────────

async function main() {
  console.log('🚀 從 CMS 匯出資料...')
  console.log(`   CMS: ${CMS_URL}`)

  // 確認 CMS 在跑
  try {
    await fetch(`${CMS_URL}/api/experiences`)
  } catch {
    console.error('\n❌ 無法連線到 CMS，請確認 Strapi 已啟動 (localhost:1337)')
    process.exit(1)
  }

  // 建立 uploads 目錄
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })

  await exportExperiences()
  await exportProjects()
  await exportResume()

  console.log('\n✅ CMS 資料匯出完成！')
}

main().catch(err => {
  console.error('❌ 匯出失敗:', err.message)
  process.exit(1)
})
