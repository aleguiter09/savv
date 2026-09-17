import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

type NavItem = {
  href: string;
  label: string;
};

type Props = Readonly<{
  navItems: NavItem[];
}>;

export async function LandingFooter({ navItems }: Props) {
  const t = await getTranslations("landing");

  return (
    <footer className="border-t border-border/80 bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Image
              src="/finance.png"
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
            <span>{t("brand")}</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{t("footer.tagline")}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground">{t("footer.product")}</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-foreground">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground">{t("footer.account")}</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/login" className="hover:text-foreground">
                {t("cta.login")}
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-foreground">
                {t("cta.createAccount")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
