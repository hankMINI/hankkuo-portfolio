import { computed, ref } from 'vue'
import { useSingleType, useCollection, getStrapiMediaUrl } from './useStrapiApi'

// Static data (不透過 CMS 管理)
import { profile as staticProfile } from '@/data/profile'
import { skillCards as staticSkillCards } from '@/data/skills'

// Static fallbacks (CMS 離線時使用)
import { experiences as staticExperiences } from '@/data/experiences'
import { projects as staticProjects } from '@/data/projects'
import { resume as staticResume } from '@/data/resume'

export function useProfile() {
  return { profile: ref(staticProfile), loading: ref(false), error: ref(null) }
}

export function useExperiences() {
  const { data, loading, error } = useCollection('experiences', {
    params: { populate: '*', 'sort': 'sortOrder:asc' },
    fallback: staticExperiences,
  })

  const staticExpMap = Object.fromEntries(staticExperiences.map(e => [e.id, e]))

  const experiences = computed(() => {
    const items = data.value
    if (!items?.length || !items[0].documentId) return staticExperiences
    return items.map(exp => {
      const fallback = staticExpMap[exp.externalId] || {}
      return {
        id: exp.externalId,
        logo: exp.logo ? getStrapiMediaUrl(exp.logo) : (fallback.logo || null),
        company: exp.company,
        role: exp.role || '',
        dateRange: exp.dateRange || '',
        highlights: exp.highlights || [],
        responsibilities: exp.responsibilities || [],
        works: exp.works || '',
      }
    })
  })

  return { experiences, loading, error }
}

export function useSkillCards() {
  return { skillCards: ref(staticSkillCards), loading: ref(false), error: ref(null) }
}

export function useProjects() {
  const { data, loading, error } = useCollection('projects', {
    params: {
      'populate[0]': 'coverImage',
      'populate[1]': 'images',
      'populate[2]': 'meta',
      'populate[3]': 'detail',
      'sort': 'sortOrder:asc',
    },
    fallback: staticProjects,
  })

  const staticProjectMap = Object.fromEntries(staticProjects.map(p => [p.id, p]))

  const projects = computed(() => {
    const items = data.value
    if (!items?.length || !items[0].documentId) return staticProjects
    return items.map(p => {
      const fallback = staticProjectMap[p.externalId] || {}
      return {
        id: p.externalId,
        tag: p.tag || '',
        title: p.title,
        subtitle: p.subtitle || '',
        coverImage: p.coverImage ? getStrapiMediaUrl(p.coverImage) : (fallback.coverImage || null),
        meta: p.meta
          ? {
              client: p.meta.client || '',
              year: p.meta.year || '',
              role: p.meta.role || '',
              team: p.meta.team || '',
            }
          : {},
        images: p.images?.length ? p.images.map(img => getStrapiMediaUrl(img)) : (fallback.images || []),
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
      }
    })
  })

  return { projects, loading, error }
}

export function useResume() {
  const { data, loading, error } = useSingleType('resume', {
    params: {
      'populate': '*',
    },
    fallback: staticResume,
  })

  const resume = computed(() => {
    const d = data.value
    if (!d || !d.documentId) return staticResume
    return {
      name: d.name,
      nameEn: d.nameEn || '',
      intro: d.intro || [],
      skills: d.skills || [],
      education: d.education || [],
      featuredWorks: d.featuredWorks || [],
      workExperience: d.workExperience || [],
      avatar: d.avatar ? getStrapiMediaUrl(d.avatar) : null,
      resumePdf: d.resumePdf ? getStrapiMediaUrl(d.resumePdf) : null,
    }
  })

  return { resume, loading, error }
}
