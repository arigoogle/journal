import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { BubbleToolbar } from './BubbleToolbar'
import { SlashCommand } from './SlashCommandExtension'

interface JournalEditorProps {
  content: string
  editable: boolean
  autoFocus?: boolean
  placeholder?: string
  onChange?: (html: string, isEmpty: boolean) => void
}

export function JournalEditor({
  content,
  editable,
  autoFocus,
  placeholder,
  onChange,
}: JournalEditorProps) {
  const editor = useEditor({
    editable,
    content,
    autofocus: autoFocus ? 'end' : false,
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: ({ editor }) => (editor.isEmpty ? (placeholder ?? '') : ''),
      }),
      ...(editable ? [SlashCommand] : []),
    ],
    editorProps: {
      attributes: {
        class: 'journal-prose focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML(), editor.isEmpty)
    },
  })

  if (!editor) return null

  return (
    <div>
      {editable && <BubbleToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  )
}
