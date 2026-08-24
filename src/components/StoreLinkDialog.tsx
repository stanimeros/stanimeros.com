import { ArrowUpRight, Link2, XIcon } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export interface StoreLinkDialogStrings {
  title: string
  subtitle: string
}

export interface StoreLinkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  strings: StoreLinkDialogStrings
}

export function StoreLinkDialog({ open, onOpenChange, strings }: StoreLinkDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-0 left-0 flex h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 flex-col rounded-none border-0 p-0 gap-0"
      >
        <DialogClose className="ring-offset-background focus:ring-ring absolute top-4 left-4 z-10 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden">
          <XIcon className="size-6" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <ArrowUpRight
          className="absolute top-2 right-3 size-16 -translate-y-2 translate-x-3 text-primary"
          strokeWidth={1.5}
        />

        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Link2 className="size-8 text-primary" />
          </div>

          <DialogHeader className="items-center gap-2">
            <DialogTitle className="text-2xl">{strings.title}</DialogTitle>
            <DialogDescription className="max-w-[16rem] text-base">
              {strings.subtitle}
            </DialogDescription>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  )
}
