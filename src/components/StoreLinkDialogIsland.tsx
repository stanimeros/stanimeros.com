import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { StoreLinkDialog } from "@/components/StoreLinkDialog"
import {
  isAndroidRestrictedInAppBrowser,
  isIosRestrictedInAppBrowser,
  STORE_LINK_TAPPED_EVENT,
} from "@/lib/in-app-browser"

export default function StoreLinkDialogIsland() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent
    if (isIosRestrictedInAppBrowser(ua) || isAndroidRestrictedInAppBrowser(ua)) {
      setOpen(true)
    }

    const handler = () => setOpen(true)
    window.addEventListener(STORE_LINK_TAPPED_EVENT, handler)
    return () => window.removeEventListener(STORE_LINK_TAPPED_EVENT, handler)
  }, [])

  return (
    <StoreLinkDialog
      open={open}
      onOpenChange={setOpen}
      strings={{
        title: t("storeLinkDialog.title"),
        subtitle: t("storeLinkDialog.subtitle"),
      }}
    />
  )
}
