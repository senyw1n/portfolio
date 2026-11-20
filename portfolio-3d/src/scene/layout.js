// Где стоит камера и какого размера объект, чтобы он не залезал под текст.
export const SPACING = 18
export const FOV = 40
export const ACCENT = '#5ab8ff'
export const REDUCED =
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

const TAN = Math.tan(((FOV / 2) * Math.PI) / 180)
const SIDEBAR = 248
const TOPBAR = 46

// Ширина текстовой панели (должна совпадать со styles.css: .content и .st-top)
export const panelWidth = (w, station) =>
  station.panel ? Math.min(station.panel, w * 0.44) : Math.min(500, w * 0.36)

export function getLayout(w, h, station) {
  const mobile = w < 900
  const dist = mobile ? 12 : 10
  const ppu = h / (2 * dist * TAN) // пикселей на метр сцены у объекта

  // Свободная от интерфейса часть экрана
  let left = 0
  let top = 0
  let bottom = h
  if (mobile) {
    top = TOPBAR
    bottom = h * 0.46
  } else {
    left = SIDEBAR + (station.layout === 'compact' ? 0 : panelWidth(w, station) + 48)
    if (station.layout === 'compact') top = 190
  }
  const freeW = (w - left) / ppu
  const freeH = (bottom - top) / ppu
  const scale = Math.min(1, (freeW * 0.86) / station.w, (freeH * 0.82) / station.h)

  // Смещаем камеру так, чтобы объект оказался в центре свободной области
  const shiftX = -((left + w) / 2 - w / 2) / ppu
  const shiftY = (h / 2 - (top + bottom) / 2) / ppu
  return { mobile, dist, scale, shiftX, shiftY }
}
