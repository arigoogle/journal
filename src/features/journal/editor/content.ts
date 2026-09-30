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
