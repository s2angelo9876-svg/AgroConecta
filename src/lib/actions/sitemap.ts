"use server";

import { createClient } from "@/lib/supabase/server";

/** Lista de agricultores verificados para incluir en el sitemap. */
export async function getVerifiedFarmersForSitemap(): Promise<
  Array<{ id: string }>
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("farmer_profiles")
    .select("user_id")
    .eq("verified", true)
    .limit(200);
  return (data ?? []).map((f) => ({ id: f.user_id }));
}