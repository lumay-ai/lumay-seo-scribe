import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GeneratedContent {
  title: string;
  metaDescription: string;
  excerpt: string;
  tldr?: string;
  quickSummary?: string[];
  directAnswer?: string;
  content: string;
  keywords: {
    primary: string;
    lsi: string[];
    semantic: string[];
    related: string[];
    longTail: string[];
  };
  faqs: { question: string; answer: string }[];
  tableOfContents: { id: string; title: string; level: number }[];
  wordCount: number;
  readingTime: number;
}

interface GenerateParams {
  topic: string;
  keywords: string;
  brandName?: string;
  targetWordCount?: number;
}

export const useAIContentGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateContent = async (params: GenerateParams): Promise<GeneratedContent | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-blog-content', {
        body: params,
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setGeneratedContent(data);
      toast.success("Content generated successfully!");
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate content";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const clearContent = () => {
    setGeneratedContent(null);
    setError(null);
  };

  return {
    generateContent,
    isGenerating,
    generatedContent,
    error,
    clearContent,
  };
};
