import type { Editor, Range } from '@tiptap/core'
import { hasImage, insertImageViaFilePicker } from './imageUpload'

export interface SlashItem {
  title: string
  glyph: string
  command: (params: { editor: Editor; range: Range }) => void
}

export const SLASH_ITEMS: SlashItem[] = [
  {
    title: 'Heading 1',
    glyph: 'H1',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleHeading({ level: 1 }).run(),
  },
  {
    title: 'Heading 2',
    glyph: 'H2',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleHeading({ level: 2 }).run(),
  },
  {
    title: 'Heading 3',
    glyph: 'H3',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleHeading({ level: 3 }).run(),
  },
  {
    title: 'Bullet List',
    glyph: '•',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: 'Numbered List',
    glyph: '1.',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: 'Quote',
    glyph: '"',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    title: 'Code',
    glyph: '</>',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: 'Divider',
    glyph: '—',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
  {
    title: 'Image',
    glyph: '🖼',
    command: ({ editor, range }) => insertImageViaFilePicker(editor, range),
  },
]

/** Only one image per entry — hide the item once the doc already has one. */
export function filterSlashItems(query: string, editor: Editor): SlashItem[] {
  const q = query.toLowerCase().trim()
  const items = hasImage(editor)
    ? SLASH_ITEMS.filter((item) => item.title !== 'Image')
    : SLASH_ITEMS

  if (!q) return items
  return items.filter((item) => item.title.toLowerCase().includes(q))
}
