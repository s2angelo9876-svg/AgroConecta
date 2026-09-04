"use server";

import { createClient } from "@/lib/supabase/server";

export interface Faq {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}

/** FAQs publicadas para mostrar en la web pública. */
export async function getPublishedFaqsAction(): Promise<Faq[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("id, question, answer, order_index")
    .eq("published", true)
    .order("order_index", { ascending: true })
    .limit(50);
  if (error) {
    console.error("[getPublishedFaqs]", error);
    return [];
  }
  return (data ?? []) as Faq[];
}