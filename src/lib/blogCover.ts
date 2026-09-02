export function getBlogCover(post: {
  coverImageUrl?: string;
  coverImageAlt?: string;
  contentMarkdown: string;
}): { url: string; alt: string } | null {
  if (post.coverImageUrl) {
    return { url: post.coverImageUrl, alt: post.coverImageAlt ?? "" };
  }
  const match = /^!\[([^\]]*)\]\(([^)]+)\)/.exec(post.contentMarkdown.trimStart());
  if (!match) return null;
  const url = match[2].trim();
  if (!(url.startsWith("/") || url.startsWith("https://"))) return null;
  return { url, alt: match[1] };
}

export function stripLeadingCoverImage(markdown: string): string {
  return markdown.replace(/^\s*!\[([^\]]*)\]\(([^)]+)\)\s*/, "");
}

export function useUnoptimizedCover(url: string): boolean {
  return !url.startsWith("/") || url.startsWith("/blog/media/");
}
