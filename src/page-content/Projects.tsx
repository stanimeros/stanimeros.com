import { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { motion, type HTMLMotionProps } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PortfolioCard } from "@/components/PortfolioCard"
import { BriefcaseIcon, PhoneIcon } from "@heroicons/react/24/outline"
import { trackEvent } from "@/lib/events"
import { useScrollAnimation } from "@/lib/hooks"
import { portfolioItems, keyToSlug } from "@/lib/portfolio-data"

interface PortfolioProps {
  lang: "en" | "el"
}

export default function Portfolio({ lang }: PortfolioProps) {
  const { t } = useTranslation()
  const prefix = lang === "el" ? "/el" : ""

  const heroRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLElement>(null)

  const heroAnimation = useScrollAnimation(heroRef)
  const gridAnimation = useScrollAnimation(gridRef)
  const ctaAnimation = useScrollAnimation(ctaRef)

  useEffect(() => {
    trackEvent("pageView", { page: "portfolio" })
  }, [])

  return (
    <>
      {/* Hero */}
      <motion.section
        ref={heroRef}
        className="py-20 scroll-mt-10 overflow-hidden"
        {...(heroAnimation as HTMLMotionProps<"section">)}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <BriefcaseIcon className="size-8 text-primary" />
              {t("portfolio.title")}
            </h1>
            <Separator className="w-24 mx-auto mb-4" />
            <p className="text-xl text-muted-foreground mb-4">{t("portfolio.subtitle")}</p>
            <p className="text-muted-foreground">{t("portfolioPage.intro")}</p>
          </div>
        </div>
      </motion.section>

      {/* All projects */}
      <motion.section
        ref={gridRef}
        className="py-20 bg-card/70 scroll-mt-10 overflow-hidden"
        {...(gridAnimation as HTMLMotionProps<"section">)}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {portfolioItems.map((item) => (
              <PortfolioCard
                key={item.key}
                title={t(`portfolio.items.${item.key}.title`)}
                description={t(`portfolio.items.${item.key}.description`)}
                technologies={item.technologies}
                bgColor={item.bgColor}
                textColor={item.textColor}
                bgImage={item.bgImage}
                logo={item.logo}
                logoBg={item.logoBg}
                url={item.url}
                caseStudyHref={`${prefix}/work/${keyToSlug(item.key)}`}
                storeLinks={item.storeLinks}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        ref={ctaRef}
        className="py-20 scroll-mt-10 overflow-hidden"
        {...(ctaAnimation as HTMLMotionProps<"section">)}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-3">{t("portfolioPage.cta.title")}</h2>
            <p className="text-foreground font-medium mb-8">{t("portfolioPage.cta.description")}</p>
            <Button variant="green" size="lg" asChild className="mb-10">
              <a href={`${prefix}/contact?source=portfolio`}>
                <PhoneIcon className="size-5 mr-2 stroke-[1.5]" />
                {t("portfolioPage.cta.button")}
              </a>
            </Button>

            <div className="flex justify-center gap-6 text-sm">
              <a href={`${prefix}/about`} className="text-muted-foreground hover:text-primary transition-colors">
                {t("servicesPage.links.about")}
              </a>
              <a href={`${prefix}/services`} className="text-muted-foreground hover:text-primary transition-colors">
                {t("servicesPage.title")}
              </a>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  )
}
