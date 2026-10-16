import type { ReactNode } from 'react'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 sm:items-center">
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-lg border border-stone-200 bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_8px_24px_rgba(0,0,0,0.12)] sm:max-h-[90vh] sm:rounded-lg sm:pb-5"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg text-stone-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-stone-400 hover:text-stone-700"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
