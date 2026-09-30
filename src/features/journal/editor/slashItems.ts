import type { Editor, Range } from '@tiptap/core'

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
]

export function filterSlashItems(query: string): SlashItem[] {
  const q = query.toLowerCase().trim()
  if (!q) return SLASH_ITEMS
  return SLASH_ITEMS.filter((item) => item.title.toLowerCase().includes(q))
}
