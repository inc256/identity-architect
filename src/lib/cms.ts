import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type WebsiteService = Tables<"cms_website_services">;
export type PortfolioProject = Tables<"cms_portfolio_projects">;
export type BlogPost = Tables<"cms_blog_posts">;

const optionalText = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().optional(),
);

const websiteSettingsSchema = z.object({
  public_email: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().email().optional(),
  ),
  phone: optionalText,
  instagram: optionalText,
  linkedin: optionalText,
  show_quote: z.boolean().optional(),
  maintenance_mode: z.boolean().optional(),
});

export type WebsiteSettings = z.infer<typeof websiteSettingsSchema>;

function throwQueryError(area: string, error: { code: string; message: string }): never {
  console.error(`[Supabase] ${area} query failed`, { code: error.code, message: error.message });
  throw new Error(`Unable to load ${area}. Please try again later.`);
}

export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  const { data, error } = await supabase
    .from("cms_website_settings")
    .select("settings")
    .eq("id", true)
    .single();

  if (error) throwQueryError("website settings", error);

  const parsed = websiteSettingsSchema.safeParse(data.settings);
  if (!parsed.success) {
    console.error("[Supabase] Website settings contain invalid values", parsed.error.flatten());
    throw new Error("Website settings could not be loaded. Please try again later.");
  }

  return parsed.data;
}

export async function getPublishedServices() {
  const { data, error } = await supabase
    .from("cms_website_services")
    .select("id,parent_id,name,description,sort_order,status")
    .eq("status", "Published")
    .order("sort_order")
    .order("name");

  if (error) throwQueryError("published services", error);

  const rows = data ?? [];
  return rows
    .filter((service) => service.parent_id === null)
    .map((parent) => ({
      ...parent,
      children: rows.filter((service) => service.parent_id === parent.id),
    }));
}

export async function getPublishedProjects() {
  const { data, error } = await supabase
    .from("cms_portfolio_projects")
    .select("id,title,slug,project_url,service,year,summary,description,image_paths,featured")
    .eq("status", "Published")
    .order("featured", { ascending: false })
    .order("year", { ascending: false });

  if (error) throwQueryError("published portfolio projects", error);
  return data ?? [];
}

export async function getPublishedProject(slug: string) {
  const { data, error } = await supabase
    .from("cms_portfolio_projects")
    .select("id,title,slug,project_url,service,year,summary,description,image_paths,featured")
    .eq("slug", slug)
    .eq("status", "Published")
    .maybeSingle();

  if (error) throwQueryError("portfolio project", error);
  return data;
}

export async function getPublishedBlogPosts() {
  const { data, error } = await supabase
    .from("cms_blog_posts")
    .select("id,title,slug,category,author,excerpt,body,image_path,publish_date,created_at")
    .eq("status", "Published")
    .order("publish_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) throwQueryError("published articles", error);
  return data ?? [];
}

export async function getPublishedBlogPost(slug: string) {
  const { data, error } = await supabase
    .from("cms_blog_posts")
    .select("id,title,slug,category,author,excerpt,body,image_path,publish_date,created_at")
    .eq("slug", slug)
    .eq("status", "Published")
    .maybeSingle();

  if (error) throwQueryError("article", error);
  return data;
}

export function getPublicImageUrl(bucket: "blog-images" | "portofio-images", path: string) {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export function getSafeExternalUrl(value: string | null) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function getSocialUrl(value: string | undefined, network: "instagram" | "linkedin") {
  if (!value?.trim()) return null;
  const externalUrl = getSafeExternalUrl(value);
  if (externalUrl) return externalUrl;

  const identifier = value.trim().replace(/^@/, "").replace(/^\/+/, "");
  if (!identifier || identifier.includes("://")) return null;
  const path =
    network === "instagram"
      ? identifier
      : identifier.startsWith("company/") || identifier.startsWith("in/")
        ? identifier
        : `in/${identifier}`;
  return `https://${network === "instagram" ? "instagram.com" : "linkedin.com"}/${path}`;
}
