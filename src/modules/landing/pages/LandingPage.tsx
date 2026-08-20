import { getTranslations } from "next-intl/server";
import { FinalCtaSection } from "../ui/FinalCtaSection";
import { HeroSection } from "../ui/HeroSection";
import { HowItWorksSection } from "../ui/HowItWorksSection";
import { LandingFooter } from "../ui/LandingFooter";
import { LandingHeader } from "../ui/LandingHeader";
import { PlanningSection } from "../ui/PlanningSection";
import { ProblemsSection } from "../ui/ProblemsSection";
import { ProductSection } from "../ui/ProductSection";

export async function LandingPage() {
  const t = await getTranslations("landing");

  const navItems = [
    { href: "#product", label: t("nav.product") },
    { href: "#planning", label: t("nav.planning") },
    { href: "#how-it-works", label: t("nav.howItWorks") },
  ] as const;

  return (
    <>
      <LandingHeader
        brand={t("brand")}
        navItems={[...navItems]}
        loginLabel={t("cta.login")}
        registerLabel={t("cta.register")}
        openMenuLabel={t("nav.openMenu")}
      />
      <main>
        <HeroSection />
        <ProblemsSection />
        <ProductSection />
        <PlanningSection />
        <HowItWorksSection />
        <FinalCtaSection />
      </main>
      <LandingFooter navItems={[...navItems]} />
    </>
  );
}
