/* Генерирует картинку-превью для соцсетей (public/og.png, 1200×630)
   и иконку для iPhone (public/apple-touch-icon.png).
   Запуск (один раз после правок дизайна превью):
     npm i --no-save @resvg/resvg-js && node scripts/og.mjs */
import { readFileSync, writeFileSync } from 'node:fs'
import { Resvg } from '@resvg/resvg-js'

const W = 1200
const H = 630
const ACCENT = '#5ab8ff'

// Детерминированный «случайный» генератор, чтобы картинка была стабильной
let seed = 7
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646

// Пиксельные горы и город внизу
let skyline = ''
const V = 12
for (let x = 0; x < W; x += V) {
  const h = Math.round(9 + 5 * Math.sin(x * 0.006 + 1.3) + 3 * Math.sin(x * 0.017) + 1.5 * Math.sin(x * 0.05))
  for (let y = 0; y < h; y++) {
    const snow = h > 12 && y >= h - 2
    const c = snow ? '#5f7390' : y / h > 0.6 ? '#1c2738' : '#151d2a'
    skyline += `<rect x="${x}" y="${H - 150 - (y + 1) * V}" width="${V}" height="${V}" fill="${c}"/>`
  }
}
for (let n = 0; n < 70; n++) {
  const x = rand() * W
  const w = 14 + rand() * 30
  const center = Math.exp(-((x - 760) ** 2) / 60000)
  const h = 20 + rand() * (40 + center * 120)
  const y = H - 150 - h
  skyline += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${(h + 150).toFixed(0)}" fill="#0f141c"/>`
  for (let wy = y + 6; wy < H - 150; wy += 9)
    for (let wx = x + 4; wx < x + w - 3; wx += 7)
      if (rand() < 0.3) skyline += `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="2" height="2" fill="${rand() < 0.75 ? '#ffc46b' : '#9fd0ff'}"/>`
}
let stars = ''
for (let n = 0; n < 90; n++) stars += `<rect x="${(rand() * W).toFixed(0)}" y="${(rand() * 260).toFixed(0)}" width="2" height="2" fill="#c9d6e8" opacity="${(0.3 + rand() * 0.5).toFixed(2)}"/>`

// Каркасный икосаэдр (как на главной), спроецированный в 2D
const t = (1 + Math.sqrt(5)) / 2
const VERTS = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]]
const rot = ([x, y, z], a, b) => {
  ;[x, z] = [x * Math.cos(b) + z * Math.sin(b), -x * Math.sin(b) + z * Math.cos(b)]
  ;[y, z] = [y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)]
  return [x, y, z]
}
const P = VERTS.map((v) => {
  const [x, y, z] = rot(v, 0.45, 0.7)
  const k = 5 / (5 + z)
  return [985 + x * 95 * k, 245 + y * 95 * k, z]
})
let ico = ''
for (let i = 0; i < 12; i++)
  for (let j = i + 1; j < 12; j++) {
    const d = Math.hypot(...VERTS[i].map((c, k) => c - VERTS[j][k]))
    if (Math.abs(d - 2) < 0.01) {
      const o = (0.35 + 0.65 * (1 - ((P[i][2] + P[j][2]) / 2 + 2) / 4)).toFixed(2)
      ico += `<line x1="${P[i][0].toFixed(1)}" y1="${P[i][1].toFixed(1)}" x2="${P[j][0].toFixed(1)}" y2="${P[j][1].toFixed(1)}" stroke="${ACCENT}" stroke-width="2" opacity="${o}"/>`
    }
  }
P.forEach(([x, y, z]) => (ico += `<rect x="${(x - 3).toFixed(1)}" y="${(y - 3).toFixed(1)}" width="6" height="6" fill="${z < 0 ? '#e8e9e4' : '#6c7178'}"/>`))

const chip = (x, label, on) =>
  `<rect x="${x}" y="408" width="${label.length * 11 + 28}" height="38" fill="${on ? 'none' : '#17191c'}" stroke="${on ? ACCENT : '#2b2f35'}"/>` +
  `<text x="${x + 14}" y="433" font-family="Consolas" font-size="18" fill="${on ? ACCENT : '#e8e9e4'}">${label}</text>`

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <pattern id="g" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#ffffff" stroke-opacity=".035"/></pattern>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d0f13"/><stop offset="1" stop-color="#1b2537"/></linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#101113" stop-opacity=".95"/><stop offset=".55" stop-color="#101113" stop-opacity=".6"/><stop offset="1" stop-color="#101113" stop-opacity="0"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  ${stars}
  ${skyline}
  <rect y="${H - 150}" width="${W}" height="150" fill="#101113"/>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect width="760" height="${H}" fill="url(#fade)"/>
  ${ico}
  <text x="64" y="68" font-family="Consolas" font-size="18" fill="#8b9098">[ Perspective ] [ <tspan fill="${ACCENT}">Wireframe</tspan> ] — portfolio</text>
  <text x="58" y="232" font-family="Segoe UI" font-weight="700" font-size="128" letter-spacing="-6" fill="none" stroke="#e8e9e4" stroke-width="2">SAYAT</text>
  <text x="58" y="350" font-family="Segoe UI" font-weight="700" font-size="128" letter-spacing="-6" fill="${ACCENT}">ZHAKSYBAY</text>
  ${chip(64, 'UX / UI', true)}${chip(186, 'Web Design', false)}${chip(342, 'Figma', false)}
  <text x="64" y="500" font-family="Segoe UI" font-size="28" fill="#e8e9e4">UX/UI-дизайнер · Алматы</text>
  <text x="64" y="540" font-family="Consolas" font-size="20" fill="#8b9098">UX/UI designer · Almaty · open to work</text>
  <rect x="64" y="572" width="10" height="10" fill="${ACCENT}"/>
  <text x="84" y="582" font-family="Consolas" font-size="16" fill="#8b9098">3D portfolio — click to explore</text>
</svg>`

const render = (src, width) =>
  new Resvg(src, { fitTo: { mode: 'width', value: width }, font: { loadSystemFonts: true, defaultFontFamily: 'Segoe UI' } })
    .render()
    .asPng()

writeFileSync(new URL('../public/og.png', import.meta.url), render(svg, W))
writeFileSync(
  new URL('../public/apple-touch-icon.png', import.meta.url),
  render(readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8'), 180)
)
console.log('public/og.png и public/apple-touch-icon.png готовы')
