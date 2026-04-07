import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SummarizeWithProps {
  title: string;
  url: string;
}

const AI_TOOLS = [
  {
    name: "ChatGPT",
    icon: "🤖",
    buildUrl: (title: string, url: string) => {
      const prompt = encodeURIComponent(`Summarize this article in bullet points with key takeaways:\n\nTitle: ${title}\nURL: ${url}`);
      return `https://chatgpt.com/?q=${prompt}`;
    },
  },
  {
    name: "Perplexity",
    icon: "🔍",
    buildUrl: (title: string, url: string) => {
      const prompt = encodeURIComponent(`Summarize this article with key insights and takeaways: ${url}`);
      return `https://www.perplexity.ai/search?q=${prompt}`;
    },
  },
  {
    name: "Gemini",
    icon: "✨",
    buildUrl: (title: string, url: string) => {
      const prompt = encodeURIComponent(`Summarize this article in bullet points with key takeaways:\n\nTitle: ${title}\nURL: ${url}`);
      return `https://gemini.google.com/app?q=${prompt}`;
    },
  },
  {
    name: "Grok",
    icon: "⚡",
    buildUrl: (title: string, url: string) => {
      const prompt = encodeURIComponent(`Summarize this article with key insights:\n\nTitle: ${title}\nURL: ${url}`);
      return `https://grok.com/?q=${prompt}`;
    },
  },
  {
    name: "Claude",
    icon: "🧠",
    buildUrl: (title: string, url: string) => {
      const prompt = encodeURIComponent(`Summarize this article in bullet points with key takeaways:\n\nTitle: ${title}\nURL: ${url}`);
      return `https://claude.ai/new?q=${prompt}`;
    },
  },
];

const SummarizeWith = ({ title, url }: SummarizeWithProps) => {
  const handleClick = (tool: (typeof AI_TOOLS)[0]) => {
    const targetUrl = tool.buildUrl(title, url);
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          Summarize with AI
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {AI_TOOLS.map((tool) => (
          <DropdownMenuItem
            key={tool.name}
            onClick={() => handleClick(tool)}
            className="cursor-pointer gap-2"
          >
            <span className="text-base">{tool.icon}</span>
            <span>{tool.name}</span>
            <ExternalLink className="h-3 w-3 ml-auto opacity-40" />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SummarizeWith;
