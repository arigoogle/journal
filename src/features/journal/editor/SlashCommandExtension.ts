import { Extension } from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import Suggestion, { exitSuggestion, type SuggestionProps } from '@tiptap/suggestion'
import { SlashCommandList, type SlashCommandListHandle } from './SlashCommandList'
import { filterSlashItems, type SlashItem } from './slashItems'

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addProseMirrorPlugins() {
    return [
      Suggestion<SlashItem, SlashItem>({
        editor: this.editor,
        char: '/',
        items: ({ query }) => filterSlashItems(query),
        command: ({ editor, range, props }) => {
          props.command({ editor, range })
        },
        render: () => {
          let component: ReactRenderer<SlashCommandListHandle> | null = null
          let unmount: (() => void) | null = null

          return {
            onStart: (props: SuggestionProps<SlashItem>) => {
              component = new ReactRenderer(SlashCommandList, {
                props: { items: props.items, command: props.command },
                editor: props.editor,
              })
              unmount = props.mount(component.element)
            },
            onUpdate: (props: SuggestionProps<SlashItem>) => {
              component?.updateProps({ items: props.items, command: props.command })
            },
            onKeyDown: (props) => {
              if (props.event.key === 'Escape') {
                exitSuggestion(props.view)
                return true
              }
              return component?.ref?.onKeyDown(props) ?? false
            },
            onExit: () => {
              unmount?.()
              component?.destroy()
              component = null
              unmount = null
            },
          }
        },
      }),
    ]
  },
})
