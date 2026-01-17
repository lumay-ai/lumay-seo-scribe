import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface UserRole {
  role: "admin" | "editor" | "author";
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  roles: UserRole[];
  isAdmin: boolean;
  isEditor: boolean;
  isAuthor: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user roles
          const { data: userRoles } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id);
          
          setRoles(userRoles as UserRole[] || []);
        } else {
          setRoles([]);
        }
        
        setLoading(false);
      }
    );

    // Then get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .then(({ data }) => {
            setRoles(data as UserRole[] || []);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { display_name: displayName },
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const isAdmin = roles.some((r) => r.role === "admin");
  const isEditor = roles.some((r) => r.role === "editor") || isAdmin;
  const isAuthor = roles.some((r) => r.role === "author") || isEditor;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        roles,
        isAdmin,
        isEditor,
        isAuthor,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
