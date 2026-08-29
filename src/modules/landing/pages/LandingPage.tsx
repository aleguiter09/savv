import { getTranslations } from "next-intl/server";
import { FinalCtaSection } from "../ui/FinalCtaSection";
import { HeroSection } from "../ui/HeroSection";
import { HowItWorksSection } from "../ui/HowItWorksSection";
import { LandingFooter } from "../ui/LandingFooter";
import { LandingHeader } from "../ui/LandingHeader";
import { ProductSection } from "../ui/ProductSection";

export async function LandingPage() {
  const t = await getTranslations("landing");

  const navItems = [
    { href: "#product", label: t("nav.product") },
    { href: "#how-it-works", label: t("nav.howItWorks") },
  ] as const;

  return (
    <>
      {/*
        THESIS: Distilled canon fintech — one promise, Home mock, register.
        OWN-WORLD: gray/white + blue-600; Inter; shadcn; sobrio.
        STORY: Visitor sees the real Home, trusts manual clarity, registers.
        FIRST VIEWPORT: Short headline + one CTA; labeled Home mock at scale.
        FORM: Category canon · distill+quieter+polish · sobrio gray/blue.
        FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
      */}
      <LandingHeader
        brand={t("brand")}
        navItems={[...navItems]}
        loginLabel={t("cta.login")}
        registerLabel={t("cta.register")}
        openMenuLabel={t("nav.openMenu")}
      />
      <main>
        <HeroSection />
        <ProductSection />
        <HowItWorksSection />
        <FinalCtaSection />
      </main>
      <LandingFooter navItems={[...navItems]} />
    </>
  );
}
