"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type UserRole = "agricultor" | "comprador" | "admin";

export interface CurrentUserState {
  user: User | null;
  profile: {
    id: string;
    full_name: string;
    role: UserRole;
    avatar_url: string | null;
  } | null;
  loading: boolean;
}

/**
 * Hook que lee el usuario autenticado de Supabase + su perfil (rol).
 * Se suscribe a onAuthStateChange para reflejar login/logout en vivo.
 */
export function useCurrentUser(): CurrentUserState {
  const [state, setState] = useState<CurrentUserState>({
    user: null,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setState({ user: null, profile: null, loading: false });
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, role, avatar_url")
        .eq("id", user.id)
        .single();
      setState({
        user,
        profile: (profile as CurrentUserState["profile"]) ?? null,
        loading: false,
      });
    };

    load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setState((s) => ({ ...s, user: session.user }));
        load();
      } else {
        setState({ user: null, profile: null, loading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return state;
}