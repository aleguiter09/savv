import { createClient } from "@/utils/supabase/server";
import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export default getRequestConfig(async () => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_settings")
    .select("language")
    .single();

  if (data?.language) {
    return {
      locale: data.language,
      messages: (await import(`../messages/${data.language}.json`)).default,
    };
  }

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
