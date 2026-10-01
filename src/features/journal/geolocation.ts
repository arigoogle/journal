export interface Coordinates {
  lat: number
  lng: number
}

const TIMEOUT_MS = 8000

/**
 * Best-effort location capture. Resolves to null (never rejects) if the
 * browser doesn't support geolocation, permission is denied, or it times
 * out — a missing location should never block saving an entry.
 */
export function getCurrentLocation(): Promise<Coordinates | null> {
  if (!('geolocation' in navigator)) return Promise.resolve(null)

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({ lat: position.coords.latitude, lng: position.coords.longitude })
      },
      () => resolve(null),
      { timeout: TIMEOUT_MS, maximumAge: 5 * 60 * 1000, enableHighAccuracy: false },
    )
  })
}

export function mapUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`
}
