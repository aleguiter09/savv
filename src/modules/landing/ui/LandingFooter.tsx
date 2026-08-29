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
    <footer className="border-t border-gray-200/80 bg-gray-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-semibold tracking-tight text-gray-900">
            <Image
              src="/finance.png"
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
            <span>{t("brand")}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            {t("footer.tagline")}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-gray-500">
            {t("footer.roadmapNote")}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-900">{t("footer.product")}</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-gray-900">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-900">{t("footer.account")}</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>
              <Link href="/login" className="hover:text-gray-900">
                {t("cta.login")}
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-gray-900">
                {t("cta.register")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
