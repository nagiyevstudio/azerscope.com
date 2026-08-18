import { marked } from "marked";

marked.use({ gfm: true, breaks: false });

/**
 * Рендер markdown-тела статьи в HTML.
 * Контент создаётся только доверенным администратором через локальную
 * dev-форму и попадает в репозиторий через git, поэтому дополнительный
 * санитайзер не требуется.
 */
export function renderMarkdown(markdown: string): string {
  if (!markdown.trim()) return "";
  return marked.parse(markdown, { async: false }) as string;
}
