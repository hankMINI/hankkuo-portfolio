import { ref } from 'vue'

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'

/**
 * 從 Strapi media 物件取得完整 URL
 */
export function getStrapiMediaUrl(media) {
  if (!media) return null
  const url = media.url || media
  if (typeof url === 'string' && url.startsWith('http')) return url
  return `${STRAPI_URL}${url}`
}

/**
 * 通用 Strapi REST API fetch
 */
async function fetchApi(endpoint, params = {}) {
  const url = new URL(`${STRAPI_URL}/api/${endpoint}`)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })

  const response = await fetch(url.toString())
  if (!response.ok) throw new Error(`API error: ${response.status}`)
  const json = await response.json()
  return json.data
}

/**
 * 取得 Single Type 資料（profile, resume）
 */
export function useSingleType(contentType, options = {}) {
  const data = ref(options.fallback || null)
  const loading = ref(true)
  const error = ref(null)

  async function load() {
    try {
      const result = await fetchApi(contentType, options.params || {})
      if (result) data.value = result
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  load()

  return { data, loading, error, refetch: load }
}

/**
 * 取得 Collection Type 資料（experiences, skill-cards, projects）
 */
export function useCollection(contentType, options = {}) {
  const data = ref(options.fallback || [])
  const loading = ref(true)
  const error = ref(null)

  async function load() {
    try {
      const result = await fetchApi(contentType, options.params || {})
      if (Array.isArray(result) && result.length > 0) {
        data.value = result
      }
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  load()

  return { data, loading, error, refetch: load }
}
