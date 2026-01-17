import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSubscribe = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.from("subscribers").insert({ email });

      if (error) {
        if (error.code === "23505") {
          throw new Error("You're already subscribed!");
        }
        throw error;
      }

      return true;
    },
  });
};
