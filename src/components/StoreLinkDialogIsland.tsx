import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { StoreLinkDialog } from "@/components/StoreLinkDialog"
import { STORE_LINK_TAPPED_EVENT } from "@/lib/in-app-browser"

export default function StoreLinkDialogIsland() {
  const { t } = useTranslation()
  const [href, setHref] = useState<string | null>(null)

  useEffect(() => {
    const handler = (e: Event) => setHref((e as CustomEvent<string>).detail)
    window.addEventListener(STORE_LINK_TAPPED_EVENT, handler)
    return () => window.removeEventListener(STORE_LINK_TAPPED_EVENT, handler)
  }, [])

  return (
    <StoreLinkDialog
      open={href !== null}
      onOpenChange={(open) => {
        if (!open) setHref(null)
      }}
      href={href}
      strings={{
        title: t("storeLinkDialog.title"),
        subtitle: t("storeLinkDialog.subtitle"),
        copy: t("storeLinkDialog.copy"),
        copied: t("storeLinkDialog.copied"),
      }}
    />
  )
}
