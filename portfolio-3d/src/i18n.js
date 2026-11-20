import { useSyncExternalStore } from 'react'
import { CONTENT } from './data'

/* Язык сайта: RU / EN. Хранится в общем «сторе», поэтому работает и в обычном
   интерфейсе, и внутри 3D-сцены (у неё свой React-рендерер). */
const KEY = 'lang'
const listeners = new Set()

function detect() {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'ru' || saved === 'en') return saved
  } catch {}
  const nav = (navigator.languages || [navigator.language || 'ru']).join(',').toLowerCase()
  return /(^|,)(ru|kk|be|uk)/.test(nav) ? 'ru' : 'en'
}

let lang = typeof window === 'undefined' ? 'ru' : detect()

function apply() {
  document.documentElement.lang = lang
  document.title = CONTENT[lang].meta.title
}
if (typeof document !== 'undefined') apply()

export function setLang(next) {
  if (next === lang) return
  lang = next
  try {
    localStorage.setItem(KEY, next)
  } catch {}
  apply()
  listeners.forEach((l) => l())
}

const subscribe = (l) => (listeners.add(l), () => listeners.delete(l))
const get = () => lang

export const useLang = () => useSyncExternalStore(subscribe, get, get)
/** Тексты на текущем языке */
export const useT = () => CONTENT[useLang()]
