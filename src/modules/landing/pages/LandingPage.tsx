import { getTranslations } from "next-intl/server";
import { FinalCtaSection } from "../ui/FinalCtaSection";
import { HeroSection } from "../ui/HeroSection";
import { LandingFooter } from "../ui/LandingFooter";
import { LandingHeader } from "../ui/LandingHeader";
import { MarginSection } from "../ui/MarginSection";
import { ProductShowcaseSection } from "../ui/ProductShowcaseSection";
import { ValuePillarsSection } from "../ui/ValuePillarsSection";

export async function LandingPage() {
  const t = await getTranslations("landing");

  const navItems = [
    { href: "#how-it-works", label: t("nav.value") },
    { href: "#product", label: t("nav.product") },
    { href: "#margin", label: t("nav.margin") },
  ] as const;

  return (
    <>
      <LandingHeader
        brand={t("brand")}
        loginLabel={t("cta.login")}
        registerLabel={t("cta.register")}
        openMenuLabel={t("nav.openMenu")}
      />
      <main>
        <HeroSection />
        <ValuePillarsSection />
        <ProductShowcaseSection />
        <MarginSection />
        <FinalCtaSection />
      </main>
      <LandingFooter navItems={[...navItems]} />
    </>
  );
}
