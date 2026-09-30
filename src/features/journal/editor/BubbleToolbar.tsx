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
        active ? 'bg-white text-stone-900' : 'text-stone-300 hover:bg-white/10 hover:text-white'
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
      className="flex items-center gap-0.5 rounded-md bg-stone-900 p-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
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
          className="h-7 w-40 rounded bg-white/10 px-2 text-xs text-white placeholder-stone-400 focus:outline-none"
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
          <span className="mx-0.5 h-4 w-px bg-stone-700" />
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
          <span className="mx-0.5 h-4 w-px bg-stone-700" />
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
