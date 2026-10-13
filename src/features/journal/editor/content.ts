const HTML_START = /^\s*</

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * Journal content is stored as a plain string. Entries written before the
 * rich-text editor was introduced are plain text (no markup); entries
 * written since are HTML produced by Tiptap. This converts legacy plain
 * text into HTML paragraphs (preserving blank-line and single-newline
 * breaks) so old entries render and edit correctly in the new editor.
 * HTML content is passed through unchanged.
 */
export function toEditorContent(raw: string): string {
  const trimmed = raw.trim()
  if (trimmed === '') return ''
  if (HTML_START.test(trimmed)) return raw

  return trimmed
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('')
}

/** Returns the `src` of the first `<img>` in entry content, if any. */
export function extractFirstImageSrc(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/)
  return match ? match[1] : null
}

/** Strips tags and collapses whitespace, for search snippets and previews. */
export function toPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Plain-text excerpt centered on the first match of `query`, for search results. */
export function excerptAround(html: string, query: string, radius = 60): string {
  const text = toPlainText(html)
  const index = text.toLowerCase().indexOf(query.toLowerCase())
  if (index === -1) return text.slice(0, radius * 2)

  const start = Math.max(0, index - radius)
  const end = Math.min(text.length, index + query.length + radius)
  const prefix = start > 0 ? '…' : ''
  const suffix = end < text.length ? '…' : ''
  return `${prefix}${text.slice(start, end)}${suffix}`
}
