import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface KeywordDistance {
  close: string[];
  medium: string[];
  far: string[];
}

interface IntentBasedKeywords {
  informational: string[];
  navigational: string[];
  transactional: string[];
  commercial: string[];
}

interface GeneratedKeywords {
  primary: string;
  coreVariations?: string[];
  secondary?: string[];
  secondaryVariations?: string[];
  withPrefix: string[];
  withSuffix: string[];
  lsi: string[];
  semantic: string[];
  related: string[];
  relatedness?: string[];
  longTail: string[];
  distance: KeywordDistance;
  llmQueries: string[];
  nlpEntities: string[];
  intentBased: IntentBasedKeywords;
}

interface LLMQuestion {
  question: string;
  answer: string;
  funnel: 'TOFU' | 'MOFU' | 'BOFU';
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
}

interface FunnelBreakdown {
  tofu: string[];
  mofu: string[];
  bofu: string[];
}

export interface GeneratedContent {
  title: string;
  metaDescription: string;
  excerpt: string;
  tldr?: string;
  quickSummary?: string[];
  directAnswer?: string;
  content: string;
  plainContent?: string;
  keywords: GeneratedKeywords;
  llmQuestions?: LLMQuestion[];
  faqs: { question: string; answer: string }[];
  tableOfContents: { id: string; title: string; level: number }[];
  funnelBreakdown?: FunnelBreakdown;
  schemaMarkup?: object;
  wordCount: number;
  readingTime: number;
  keywordDensity?: number;
}

export interface GenerateParams {
  topic: string;
  keywords: string;
  brandName?: string;
  location?: string;
  context?: string;
  targetWordCount?: number;
  keywordIntent?: string;
  powerWords?: string;
  keywordPrefix?: string;
  keywordSuffix?: string;
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

      // Extract table of contents from HTML if not provided
      if (data.content && (!data.tableOfContents || data.tableOfContents.length === 0)) {
        const tocItems: { id: string; title: string; level: number }[] = [];
        const headingRegex = /<h([23])[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h[23]>/gi;
        let match;
        while ((match = headingRegex.exec(data.content)) !== null) {
          tocItems.push({
            level: parseInt(match[1]),
            id: match[2] || `heading-${tocItems.length}`,
            title: match[3].replace(/<[^>]*>/g, '').trim()
          });
        }
        data.tableOfContents = tocItems;
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
    setGeneratedContent,
    error,
    clearContent,
  };
};
