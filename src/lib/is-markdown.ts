const MARKDOWN_RE =
  /#{1,6}\s|\*{1,3}[^*]|_{1,3}[^_]|`{1,3}|\[.*\]\(.*\)|!\[.*\]\(.*\)|> |\n[-*+]\s|\n\d+\.\s|^[-*+]\s|^>\s|---|\*\*\*|```/;

export function isMarkdown(content: string): boolean {
  if (!content) return false;
  return MARKDOWN_RE.test(content);
}
