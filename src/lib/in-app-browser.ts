/**
 * Instagram, Facebook, and TikTok's iOS in-app browsers block Universal Links,
 * so tapping an apps.apple.com link just loads the web page instead of opening
 * the App Store app (or fails outright on some devices/versions).
 */
const RESTRICTED_IN_APP_BROWSER_UA = /Instagram|FBAN|FBAV|TikTok|musical_ly|BytedanceWebview/i

export function isIosRestrictedInAppBrowser(ua: string): boolean {
  const isIos = /iPhone|iPad|iPod/i.test(ua)
  return isIos && RESTRICTED_IN_APP_BROWSER_UA.test(ua)
}

/**
 * On Android, these same embedded browsers load Google Play's web page inline
 * and Play then refuses to proceed ("copy this link and open it in your
 * browser"). Even the `intent://` rewrite isn't reliable on every device in
 * these WebViews, so callers should offer a copy-link/open-in-browser dialog
 * instead of a blind redirect when this returns true.
 */
export function isAndroidRestrictedInAppBrowser(ua: string): boolean {
  const isAndroid = /Android/i.test(ua)
  return isAndroid && RESTRICTED_IN_APP_BROWSER_UA.test(ua)
}

/**
 * Same embedded browsers load Google Play's web page inside their own WebView
 * on Android, and Play's web page then refuses to proceed ("copy this link and
 * open it in your browser"). Converting the link to an `intent://` URI makes
 * Android resolve it as a native intent instead of web content, which opens the
 * Play Store app directly even from inside a restrictive in-app browser.
 */
export function toAndroidPlayIntentUrl(playUrl: string): string {
  try {
    const url = new URL(playUrl)
    const id = url.searchParams.get('id')
    if (!id) return playUrl
    const fallback = encodeURIComponent(playUrl)
    return `intent://details?id=${id}#Intent;scheme=market;package=com.android.vending;S.browser_fallback_url=${fallback};end`
  } catch {
    return playUrl
  }
}

/** Fired to open the "open in browser" dialog from wherever a store link was tapped. */
export const STORE_LINK_TAPPED_EVENT = 'store-link-tapped'

export function shouldShowIosStoreDialog(ua: string): boolean {
  return isIosRestrictedInAppBrowser(ua)
}

export type AndroidStoreClickResult =
  | { type: 'show-dialog' }
  | { type: 'open-intent'; url: string }
  | { type: 'open-web'; url: string }
  | { type: 'default' }

/**
 * Decides what an Apple/Play store button click on Android should do:
 * show the "open in browser" dialog inside a restricted in-app WebView,
 * otherwise resolve to a native Play intent (on Android) or a plain web
 * fallback link (elsewhere), or fall through to the link's own href.
 */
export function resolveAndroidStoreClick(
  ua: string,
  androidHref: string,
  androidWebHref?: string
): AndroidStoreClickResult {
  if (isAndroidRestrictedInAppBrowser(ua)) return { type: 'show-dialog' }
  if (/Android/i.test(ua)) return { type: 'open-intent', url: toAndroidPlayIntentUrl(androidHref) }
  if (androidWebHref) return { type: 'open-web', url: androidWebHref }
  return { type: 'default' }
}

/**
 * Wires up click handling for `[data-apple-link]`/`[data-android-link]`
 * anchors already rendered on the page (used by the plain-DOM Astro pages;
 * React components call `shouldShowIosStoreDialog`/`resolveAndroidStoreClick`
 * directly instead). `dispatchDialog` receives the store link that should be
 * offered for copying.
 */
export function bindStoreLinkClicks(dispatchDialog: (href: string) => void): void {
  document.querySelectorAll<HTMLAnchorElement>('[data-apple-link]').forEach((link) => {
    link.addEventListener('click', () => {
      const href = link.dataset.appleHref
      if (href && shouldShowIosStoreDialog(navigator.userAgent)) dispatchDialog(href)
    })
  })

  document.querySelectorAll<HTMLAnchorElement>('[data-android-link]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const androidHref = link.dataset.androidHref
      if (!androidHref) return
      const result = resolveAndroidStoreClick(navigator.userAgent, androidHref, link.dataset.androidWebHref)
      if (result.type === 'show-dialog') {
        e.preventDefault()
        dispatchDialog(androidHref)
      } else if (result.type === 'open-intent') {
        e.preventDefault()
        window.location.href = result.url
      } else if (result.type === 'open-web') {
        e.preventDefault()
        window.open(result.url, '_blank', 'noopener,noreferrer')
      }
    })
  })
}
