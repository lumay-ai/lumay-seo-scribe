import { Author } from "@/types/blog";
import { Twitter, Linkedin } from "lucide-react";

interface AuthorCardProps {
  author: Author;
  showBio?: boolean;
}

const AuthorCard = ({ author, showBio = true }: AuthorCardProps) => {
  return (
    <div className="flex items-start gap-4 p-6 bg-card rounded-lg border border-border">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl font-heading font-bold text-primary shrink-0">
        {author.name.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-heading font-semibold text-heading">{author.name}</h4>
          <span className="text-sm text-muted-foreground">• {author.role}</span>
        </div>
        {showBio && (
          <p className="mt-2 text-muted-foreground text-sm">{author.bio}</p>
        )}
        {author.social && (
          <div className="flex items-center gap-3 mt-3">
            {author.social.twitter && (
              <a
                href={author.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={`Follow ${author.name} on Twitter`}
              >
                <Twitter className="h-4 w-4" />
              </a>
            )}
            {author.social.linkedin && (
              <a
                href={author.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={`Connect with ${author.name} on LinkedIn`}
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorCard;
