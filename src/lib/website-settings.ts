import { createContext, useContext } from "react";
import type { WebsiteSettings } from "@/lib/cms";

export const WebsiteSettingsContext = createContext<WebsiteSettings | null>(null);

export function useWebsiteSettings() {
  const settings = useContext(WebsiteSettingsContext);
  if (!settings) throw new Error("Website settings are not available.");
  return settings;
}
