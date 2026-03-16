import { SettingsPage } from "@/modules/settings/pages/SettingsPage";

export const dynamic = "force-static";

export default async function Page() {
  return <SettingsPage />;
}
