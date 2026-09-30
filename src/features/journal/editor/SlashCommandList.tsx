import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import type { SlashItem } from './slashItems'

export interface SlashCommandListHandle {
  onKeyDown: (event: { event: KeyboardEvent | ReactKeyboardEvent }) => boolean
}

interface SlashCommandListProps {
  items: SlashItem[]
  command: (item: SlashItem) => void
}

export const SlashCommandList = forwardRef<SlashCommandListHandle, SlashCommandListProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
      setSelectedIndex(0)
    }, [items])

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === 'ArrowDown') {
          setSelectedIndex((prev) => (prev + 1) % items.length)
          return true
        }
        if (event.key === 'ArrowUp') {
          setSelectedIndex((prev) => (prev - 1 + items.length) % items.length)
          return true
        }
        if (event.key === 'Enter') {
          const item = items[selectedIndex]
          if (item) command(item)
          return true
        }
        return false
      },
    }))

    if (items.length === 0) {
      return (
        <div className="rounded-md bg-stone-900 px-3 py-2 text-sm text-stone-400 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          No matches
        </div>
      )
    }

    return (
      <div className="w-56 overflow-hidden rounded-md bg-stone-900 py-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        {items.map((item, index) => (
          <button
            key={item.title}
            type="button"
            onClick={() => command(item)}
            onMouseEnter={() => setSelectedIndex(index)}
            className={`flex w-full items-center gap-3 px-3 py-1.5 text-left text-sm transition-colors ${
              index === selectedIndex ? 'bg-white/10 text-white' : 'text-stone-300'
            }`}
          >
            <span className="w-7 shrink-0 text-center text-xs font-medium text-stone-500">
              {item.glyph}
            </span>
            {item.title}
          </button>
        ))}
      </div>
    )
  },
)

SlashCommandList.displayName = 'SlashCommandList'
