import { Twitter, Facebook, Linkedin, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIncrementShare } from "@/hooks/useShareCount";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface SocialShareProps {
  postId: string;
  title: string;
  url: string;
}

const SocialShare = ({ postId, title, url }: SocialShareProps) => {
  const [copied, setCopied] = useState(false);
  const incrementShare = useIncrementShare();

  const shareToTwitter = () => {
    incrementShare.mutate({ postId, platform: "twitter" });
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const shareToFacebook = () => {
    incrementShare.mutate({ postId, platform: "facebook" });
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const shareToLinkedIn = () => {
    incrementShare.mutate({ postId, platform: "linkedin" });
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      incrementShare.mutate({ postId, platform: "copy_link" });
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The article link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-2">Share:</span>
      <Button
        variant="outline"
        size="icon"
        onClick={shareToTwitter}
        className="h-9 w-9 hover:bg-primary/10 hover:text-primary hover:border-primary"
        aria-label="Share on Twitter"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={shareToFacebook}
        className="h-9 w-9 hover:bg-primary/10 hover:text-primary hover:border-primary"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={shareToLinkedIn}
        className="h-9 w-9 hover:bg-primary/10 hover:text-primary hover:border-primary"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={copyLink}
        className="h-9 w-9 hover:bg-primary/10 hover:text-primary hover:border-primary"
        aria-label="Copy link"
      >
        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Link2 className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default SocialShare;
