import { computed } from 'vue'
import { useSingleType, useCollection, getStrapiMediaUrl } from './useStrapiApi'

// Static fallbacks
import { profile as staticProfile } from '@/data/profile'
import { experiences as staticExperiences } from '@/data/experiences'
import { skillCards as staticSkillCards } from '@/data/skills'
import { projects as staticProjects } from '@/data/projects'
import { resume as staticResume } from '@/data/resume'

export function useProfile() {
  const { data, loading, error } = useSingleType('profile', {
    params: { populate: '*' },
    fallback: staticProfile,
  })

  const profile = computed(() => {
    const d = data.value
    if (!d || !d.documentId) return staticProfile
    return {
      name: d.name,
      title: d.title || [],
      intro: d.intro || '',
      skills: d.skills || [],
      contact: {
        phone: d.contact?.phone || '',
        email: d.contact?.email || '',
      },
    }
  })

  return { profile, loading, error }
}

export function useExperiences() {
  const { data, loading, error } = useCollection('experiences', {
    params: { populate: '*', 'sort': 'sortOrder:asc' },
    fallback: staticExperiences,
  })

  const experiences = computed(() => {
    const items = data.value
    if (!items?.length || !items[0].documentId) return staticExperiences
    return items.map(exp => ({
      id: exp.externalId,
      logo: exp.logo ? getStrapiMediaUrl(exp.logo) : null,
      company: exp.company,
      role: exp.role || '',
      dateRange: exp.dateRange || '',
      highlights: exp.highlights || [],
      responsibilities: exp.responsibilities || [],
      works: exp.works || '',
    }))
  })

  return { experiences, loading, error }
}

export function useSkillCards() {
  const { data, loading, error } = useCollection('skill-cards', {
    params: { populate: '*', 'sort': 'sortOrder:asc' },
    fallback: staticSkillCards,
  })

  const skillCards = computed(() => {
    const items = data.value
    if (!items?.length || !items[0].documentId) return staticSkillCards
    return items.map(card => ({
      label: card.label,
      highlight: card.highlight || false,
      items: card.items || [],
      tools: card.tools || [],
    }))
  })

  return { skillCards, loading, error }
}

export function useProjects() {
  const { data, loading, error } = useCollection('projects', {
    params: {
      'populate[coverImage]': '*',
      'populate[images]': '*',
      'populate[meta]': '*',
      'populate[detail][populate][links]': '*',
      'populate[detail][populate][designSections]': '*',
      'sort': 'sortOrder:asc',
    },
    fallback: staticProjects,
  })

  const projects = computed(() => {
    const items = data.value
    if (!items?.length || !items[0].documentId) return staticProjects
    return items.map(p => ({
      id: p.externalId,
      tag: p.tag || '',
      title: p.title,
      subtitle: p.subtitle || '',
      coverImage: p.coverImage ? getStrapiMediaUrl(p.coverImage) : null,
      meta: p.meta
        ? {
            client: p.meta.client || '',
            year: p.meta.year || '',
            role: p.meta.role || '',
            team: p.meta.team || '',
          }
        : {},
      images: p.images?.map(img => getStrapiMediaUrl(img)) || [],
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
    }))
  })

  return { projects, loading, error }
}

export function useResume() {
  const { data, loading, error } = useSingleType('resume', {
    params: {
      'populate[skills]': '*',
      'populate[featuredWorks]': '*',
      'populate[workExperience]': '*',
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
    }
  })

  return { resume, loading, error }
}
