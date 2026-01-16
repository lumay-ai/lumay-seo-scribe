import { Source } from "@/types/blog";
import { ExternalLink } from "lucide-react";

interface SourcesSectionProps {
  sources: Source[];
}

const SourcesSection = ({ sources }: SourcesSectionProps) => {
  if (sources.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="font-heading text-2xl font-semibold text-heading mb-6">
        Sources & References
      </h2>
      <ul className="space-y-3">
        {sources.map((source, index) => (
          <li key={index} className="flex items-start gap-2">
            <ExternalLink className="h-4 w-4 mt-1 text-primary shrink-0" />
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link hover:text-link-hover underline underline-offset-4 transition-colors"
            >
              {source.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SourcesSection;
