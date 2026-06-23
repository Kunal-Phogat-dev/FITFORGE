"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useStore } from "@/store/useStore";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const clearStore = useStore(state => state.clearStore);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) {
        clearStore();
        router.replace("/login");
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        clearStore();
        router.replace("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, clearStore]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1118]">
        <Activity className="h-10 w-10 text-primary animate-pulse" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
