import { useState } from "react"
import { CheckIcon, CopyIcon, ExternalLinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toAndroidPlayIntentUrl } from "@/lib/in-app-browser"

export interface StoreLinkDialogStrings {
  title: string
  description: string
  copyLink: string
  copied: string
  openInBrowser: string
  instructions: string
}

export interface StoreLinkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  url: string | null
  strings: StoreLinkDialogStrings
}

export function StoreLinkDialog({ open, onOpenChange, url, strings }: StoreLinkDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — nothing we can do.
    }
  }

  const handleOpen = () => {
    if (!url) return
    const target = url.includes("play.google.com") ? toAndroidPlayIntentUrl(url) : url
    window.open(target, "_blank", "noopener,noreferrer")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setCopied(false)
        onOpenChange(next)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{strings.title}</DialogTitle>
          <DialogDescription>{strings.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:flex-col sm:items-stretch gap-2">
          <Button onClick={handleOpen} className="w-full">
            <ExternalLinkIcon />
            {strings.openInBrowser}
          </Button>
          <Button onClick={handleCopy} variant="outline" className="w-full">
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? strings.copied : strings.copyLink}
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-1">{strings.instructions}</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
