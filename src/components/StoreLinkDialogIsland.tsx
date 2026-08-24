import { useEffect, useState } from "react"
import { StoreLinkDialog } from "@/components/StoreLinkDialog"
import en from "@/i18n/locales/en/main.json"
import el from "@/i18n/locales/el/main.json"

export const STORE_LINK_BLOCKED_EVENT = "store-link-blocked"

export interface StoreLinkBlockedDetail {
  url: string
}

export function StoreLinkDialogIsland({ lang }: { lang: "en" | "el" }) {
  const strings = (lang === "el" ? el : en).storeLinkDialog
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<StoreLinkBlockedDetail>).detail
      if (!detail?.url) return
      setUrl(detail.url)
      setOpen(true)
    }
    window.addEventListener(STORE_LINK_BLOCKED_EVENT, handler)
    return () => window.removeEventListener(STORE_LINK_BLOCKED_EVENT, handler)
  }, [])

  return <StoreLinkDialog open={open} onOpenChange={setOpen} url={url} strings={strings} />
}
