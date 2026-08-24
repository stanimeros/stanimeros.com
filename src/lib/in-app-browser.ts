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
