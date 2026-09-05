import { projectItems, type ProjectItem } from './projects-data'

/** camelCase portfolio key → URL slug (e.g. skiGreece → ski-greece) */
export function slugFromProjectKey(key: string): string {
  return key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

export interface AppDownloadPage extends ProjectItem {
  slug: string
}

export function getAppDownloadPages(): AppDownloadPage[] {
  return projectItems
    .filter(
      (item) =>
        item.storeComingSoon ||
        item.storeLinks?.apple ||
        item.storeLinks?.android
    )
    .map((item) => ({ ...item, slug: slugFromProjectKey(item.key) }))
}

export function getAppDownloadPage(slug: string): AppDownloadPage | undefined {
  return getAppDownloadPages().find((item) => item.slug === slug)
}
