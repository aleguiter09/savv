import { enUS, es, type Locale } from "date-fns/locale";

export function getDateFnsLocale(locale: string): Locale {
  return locale.startsWith("es") ? es : enUS;
}
