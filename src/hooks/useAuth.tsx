import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isEditor: boolean;
  hasAccess: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [loading, setLoading] = useState(true);

  const hasAccess = isAdmin || isEditor;

  const checkRoles = async (userId: string) => {
    try {
      const [adminRes, editorRes] = await Promise.all([
        supabase.rpc("has_role", { _user_id: userId, _role: "admin" }),
        supabase.rpc("has_role", { _user_id: userId, _role: "editor" }),
      ]);

      setIsAdmin(!!adminRes.data);
      setIsEditor(!!editorRes.data);
    } catch (error) {
      console.error("Failed to check user roles:", error);
      setIsAdmin(false);
      setIsEditor(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          void checkRoles(session.user.id);
        } else {
          setIsAdmin(false);
          setIsEditor(false);
        }

        setLoading(false);
      }
    );

    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await checkRoles(session.user.id);
        }
      } catch (error) {
        console.error("Failed to initialize auth session:", error);
        if (mounted) {
          setIsAdmin(false);
          setIsEditor(false);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void initSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error as Error | null };
    } catch (error) {
      console.error("Sign-in failed:", error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Sign-out failed:", error);
    } finally {
      setIsAdmin(false);
      setIsEditor(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, isEditor, hasAccess, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
