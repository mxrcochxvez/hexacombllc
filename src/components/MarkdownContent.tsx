import type { ReactNode } from "react";

function safeHref(value: string): string | null {
  const href = value.trim();
  if (href.startsWith("/") || href.startsWith("#")) return href;
  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:" ? href : null;
  } catch {
    return null;
  }
}

function inline(text: string): ReactNode[] {
  const pattern = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*)/g;
  const output: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > cursor) output.push(text.slice(cursor, match.index));
    const key = `${match.index}-${match[0]}`;
    if (match[2] && match[3]) {
      const href = safeHref(match[3]);
      output.push(href ? <a key={key} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>{match[2]}</a> : match[2]);
    } else if (match[4]) output.push(<strong key={key}>{match[4]}</strong>);
    else if (match[5]) output.push(<code key={key}>{match[5]}</code>);
    else if (match[6]) output.push(<em key={key}>{match[6]}</em>);
    cursor = match.index + match[0].length;
  }
  if (cursor < text.length) output.push(text.slice(cursor));
  return output;
}

export function MarkdownContent({ markdown }: { markdown: string }) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { index += 1; continue; }
    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) { code.push(lines[index]); index += 1; }
      index += 1;
      blocks.push(<pre key={`code-${index}`}><code data-language={language || undefined}>{code.join("\n")}</code></pre>);
      continue;
    }
    const heading = /^(#{2,6})\s+(.+)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const children = inline(heading[2]);
      if (level === 2) blocks.push(<h2 key={`h-${index}`}>{children}</h2>);
      else if (level === 3) blocks.push(<h3 key={`h-${index}`}>{children}</h3>);
      else blocks.push(<h4 key={`h-${index}`}>{children}</h4>);
      index += 1;
      continue;
    }
    if (/^---+$/.test(line.trim())) { blocks.push(<hr key={`hr-${index}`} />); index += 1; continue; }
    if (line.startsWith("> ")) { blocks.push(<blockquote key={`quote-${index}`}>{inline(line.slice(2))}</blockquote>); index += 1; continue; }
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index])) { items.push(lines[index].replace(/^[-*]\s+/, "")); index += 1; }
      blocks.push(<ul key={`ul-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>)}</ul>);
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) { items.push(lines[index].replace(/^\d+\.\s+/, "")); index += 1; }
      blocks.push(<ol key={`ol-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>)}</ol>);
      continue;
    }
    const paragraph = [line.trim()];
    index += 1;
    while (index < lines.length && lines[index].trim() && !/^(#{2,6})\s+|^```|^> |^[-*]\s+|^\d+\.\s+|^---+$/.test(lines[index])) { paragraph.push(lines[index].trim()); index += 1; }
    blocks.push(<p key={`p-${index}`}>{inline(paragraph.join(" "))}</p>);
  }
  return <div className="blog-prose">{blocks}</div>;
}
