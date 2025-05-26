import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export default getRequestConfig(async () => {
  /*const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();*/

  const headersList = headers();
  const defaultLocale = headersList.get("accept-language");
  const currentLocale =
    cookies().get("NEXT_LOCALE")?.value ?? defaultLocale ?? "en";

  const locale = currentLocale.split(",")[0].includes("es") ? "es" : "en";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
