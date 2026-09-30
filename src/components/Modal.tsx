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
        className="w-full max-w-md rounded-t-xl bg-white p-5 shadow-lg sm:rounded-xl"
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
