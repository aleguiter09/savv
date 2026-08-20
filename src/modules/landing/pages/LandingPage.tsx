import { getTranslations } from "next-intl/server";
import { AccountsSection } from "../ui/AccountsSection";
import { AnalyticsSection } from "../ui/AnalyticsSection";
import { FinalCtaSection } from "../ui/FinalCtaSection";
import { HeroSection } from "../ui/HeroSection";
import { HowItWorksSection } from "../ui/HowItWorksSection";
import { LandingFooter } from "../ui/LandingFooter";
import { LandingHeader } from "../ui/LandingHeader";
import { MovementsSection } from "../ui/MovementsSection";
import { PlanningSection } from "../ui/PlanningSection";

export async function LandingPage() {
  const t = await getTranslations("landing");

  const navItems = [
    { href: "#accounts", label: t("nav.accounts") },
    { href: "#movements", label: t("nav.movements") },
    { href: "#analytics", label: t("nav.analytics") },
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
        <AccountsSection />
        <MovementsSection />
        <AnalyticsSection />
        <PlanningSection />
        <HowItWorksSection />
        <FinalCtaSection />
      </main>
      <LandingFooter navItems={[...navItems]} />
    </>
  );
}
