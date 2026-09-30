import type { Editor } from '@tiptap/core'
import { BubbleMenu } from '@tiptap/react/menus'
import { useEffect, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'

function ToolbarButton({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex h-7 min-w-7 items-center justify-center rounded px-1.5 text-xs font-medium transition-colors ${
        active ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
      }`}
    >
      {label}
    </button>
  )
}

export function BubbleToolbar({ editor }: { editor: Editor }) {
  const [linkMode, setLinkMode] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  useEffect(() => {
    const reset = () => {
      if (editor.state.selection.empty) {
        setLinkMode(false)
        setLinkUrl('')
      }
    }
    editor.on('selectionUpdate', reset)
    return () => {
      editor.off('selectionUpdate', reset)
    }
  }, [editor])

  function applyLink() {
    const url = linkUrl.trim()
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    }
    setLinkMode(false)
    setLinkUrl('')
  }

  return (
    <BubbleMenu
      editor={editor}
      className="flex items-center gap-0.5 rounded-lg border border-stone-200 bg-white p-1 shadow-lg"
    >
      {linkMode ? (
        <input
          autoFocus
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          onKeyDown={(e: ReactKeyboardEvent) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              applyLink()
            }
            if (e.key === 'Escape') {
              setLinkMode(false)
              setLinkUrl('')
            }
          }}
          placeholder="Paste a link…"
          className="h-7 w-40 rounded px-2 text-xs text-stone-800 focus:outline-none"
        />
      ) : (
        <>
          <ToolbarButton
            label="B"
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            label="I"
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <ToolbarButton
            label="U"
            active={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          />
          <ToolbarButton
            label="S"
            active={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          />
          <span className="mx-0.5 h-4 w-px bg-stone-200" />
          <ToolbarButton
            label="H1"
            active={editor.isActive('heading', { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          />
          <ToolbarButton
            label="H2"
            active={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          />
          <span className="mx-0.5 h-4 w-px bg-stone-200" />
          <ToolbarButton
            label="•"
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
          <ToolbarButton
            label={'"'}
            active={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          />
          <ToolbarButton
            label="🔗"
            active={editor.isActive('link')}
            onClick={() => {
              setLinkUrl(editor.getAttributes('link').href ?? '')
              setLinkMode(true)
            }}
          />
        </>
      )}
    </BubbleMenu>
  )
}
