import type { Editor, Range } from '@tiptap/core'

export class ImageUploadError extends Error {}

const MAX_SIZE_BYTES = 8 * 1024 * 1024
const CLEANUP_TIMEOUT_MS = 60_000
const PLACEHOLDER_TEXT = 'Uploading image…'

async function uploadToCloudinary(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new ImageUploadError('Please choose an image file.')
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new ImageUploadError('Image is too large (max 8MB).')
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  let response: Response
  try {
    response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })
  } catch {
    throw new ImageUploadError('Could not upload image. Check your connection and try again.')
  }

  if (!response.ok) {
    throw new ImageUploadError('Could not upload image. Please try again.')
  }

  const data = (await response.json()) as { secure_url?: string }
  if (!data.secure_url) throw new ImageUploadError('Could not upload image. Please try again.')
  return data.secure_url
}

/**
 * Removes the "/image" slash-command text, opens a native file picker, and
 * replaces a temporary placeholder with the uploaded image once ready.
 */
export function insertImageViaFilePicker(editor: Editor, range: Range) {
  editor.chain().focus().deleteRange(range).run()
  const insertPos = range.from

  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.style.display = 'none'
  document.body.appendChild(input)

  const cleanupTimer = setTimeout(() => input.remove(), CLEANUP_TIMEOUT_MS)

  input.addEventListener('change', () => {
    clearTimeout(cleanupTimer)
    const file = input.files?.[0]
    input.remove()
    if (!file) return

    editor.chain().focus().insertContentAt(insertPos, PLACEHOLDER_TEXT).run()
    const placeholderRange = { from: insertPos, to: insertPos + PLACEHOLDER_TEXT.length }

    uploadToCloudinary(file)
      .then((url) => {
        editor.chain().focus().deleteRange(placeholderRange).setImage({ src: url }).run()
      })
      .catch((err) => {
        const message = err instanceof ImageUploadError ? err.message : 'Could not upload image.'
        editor
          .chain()
          .focus()
          .deleteRange(placeholderRange)
          .insertContentAt(placeholderRange.from, message)
          .run()
      })
  })

  input.click()
}

export function hasImage(editor: Editor): boolean {
  let found = false
  editor.state.doc.descendants((node) => {
    if (node.type.name === 'image') {
      found = true
      return false
    }
    return true
  })
  return found
}
