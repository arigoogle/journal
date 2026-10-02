import type { Editor, Range } from '@tiptap/core'

export class ImageUploadError extends Error {}

const MAX_SIZE_BYTES = 8 * 1024 * 1024
const CLEANUP_TIMEOUT_MS = 60_000
const PLACEHOLDER_TEXT = 'Uploading image…'

const COMPRESS_THRESHOLD_BYTES = 1 * 1024 * 1024
const MAX_DIMENSION = 1920
const JPEG_QUALITY = 0.82

/**
 * Downscales and re-encodes large images (phone photos are routinely
 * 3000px+ and several MB) to a JPEG capped at MAX_DIMENSION on the long
 * edge, so uploads are fast and Cloudinary storage stays small. Small
 * files are left untouched. Falls back to the original file on any
 * decoding failure — compression is a nice-to-have, never a blocker.
 */
async function compressImage(file: File): Promise<File> {
  if (file.size <= COMPRESS_THRESHOLD_BYTES) return file

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      bitmap.close()
      return file
    }

    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY),
    )
    if (!blob || blob.size >= file.size) return file

    const newName = file.name.replace(/\.\w+$/, '') + '.jpg'
    return new File([blob], newName, { type: 'image/jpeg' })
  } catch {
    return file
  }
}

async function uploadToCloudinary(original: File): Promise<string> {
  if (!original.type.startsWith('image/')) {
    throw new ImageUploadError('Please choose an image file.')
  }
  if (original.size > MAX_SIZE_BYTES) {
    throw new ImageUploadError('Image is too large (max 8MB).')
  }

  const file = await compressImage(original)

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

  // Phone photos are frequently HEIC, which most browsers can't render in an
  // <img> tag. Requesting Cloudinary's automatic format/quality delivery
  // transformation guarantees a web-compatible image (JPEG/WebP/etc,
  // whichever best suits the viewer's browser) regardless of what was
  // actually uploaded, instead of relying on client-side conversion alone.
  return data.secure_url.replace('/upload/', '/upload/f_auto,q_auto/')
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
