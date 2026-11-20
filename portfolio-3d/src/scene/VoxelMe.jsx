import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useCursor } from '@react-three/drei'
import * as THREE from 'three'
import { REDUCED } from './layout'
import { useT } from '../i18n'

/* Воксельный портрет в стиле блочного персонажа (по присланной картинке):
   большая голова 8×8×8 с объёмной кудрявой причёской, тёмно-синяя куртка
   с молнией, карманами и манжетами, тёмная футболка-хенли на пуговицах,
   белый ворот, широкие бежевые брюки, белые кеды.
   Координаты в вокселях: x — влево/вправо, y — вверх (0 = пол), z — вперёд (+z — лицо).
   Цвета-массивы дают «пиксельную» текстуру ткани: оттенок выбирается по координате. */
const C = {
  skin: '#e2a57c', skinShade: '#d39168', mouth: '#c07e5c', eyeWhite: '#f4f1ea', pupil: '#2a1d16',
  brow: '#3a2418',
  hair: ['#3b2417', '#4a2d1d', '#563628', '#2f1d13', '#442a1b'],
  jacket: ['#2f3d5c', '#2a3754', '#35456a', '#2c3a58', '#31405f'],
  jacketDark: '#232e46', zipTape: '#7d8088', zipPull: '#b0b4bb',
  henley: ['#262628', '#2d2d30'], button: '#55565c', tee: '#efefef',
  pants: ['#c9b38a', '#bea880', '#d4c09a', '#c3ad84', '#cdb891'], pantsDark: '#a99472',
  shoe: ['#ece8dc', '#e4dfd1'], shoeShade: '#d6d0c0', sole: '#c9c2b0', stripe: '#3a3a3a',
}

// Детерминированный «шум» по координате — текстура всегда одна и та же
function hash(x, y, z) {
  let h = (x * 374761393 + y * 668265263 + z * 1442695041) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}
const tone = (c, x, y, z) => (Array.isArray(c) ? c[Math.floor(hash(x, y, z) * c.length)] : c)

function build() {
  const m = new Map()
  // Закрашивает параллелепипед (границы включительно); последний вызов перекрывает цвет
  const box = (x0, x1, y0, y1, z0, z1, c, part = 'body') => {
    for (let x = x0; x <= x1; x++)
      for (let y = y0; y <= y1; y++)
        for (let z = z0; z <= z1; z++) m.set(`${x},${y},${z}`, [x, y, z, tone(c, x, y, z), part])
  }

  // Кеды
  box(-5, -1, 0, 1, -2, 3, C.shoe); box(0, 4, 0, 1, -2, 3, C.shoe)
  box(-5, -1, 0, 0, -2, 3, C.sole); box(0, 4, 0, 0, -2, 3, C.sole)
  box(-5, -1, 1, 1, 3, 3, C.shoeShade); box(0, 4, 1, 1, 3, 3, C.shoeShade)
  box(-5, -5, 1, 1, -1, 1, C.stripe); box(4, 4, 1, 1, -1, 1, C.stripe)

  // Широкие брюки
  box(-5, -1, 2, 11, -2, 1, C.pants); box(0, 4, 2, 11, -2, 1, C.pants)
  box(-1, -1, 2, 9, 1, 1, C.pantsDark) // складка между штанинами
  box(-4, 3, 12, 13, -2, 1, C.pants)

  // Куртка
  box(-4, 3, 14, 25, -2, 1, C.jacket)
  box(-4, 3, 14, 14, -2, 1, C.jacketDark) // нижний край
  box(-1, 0, 14, 23, 1, 1, C.henley) // тёмная хенли в распахе
  box(0, 0, 22, 22, 1, 1, C.button); box(0, 0, 20, 20, 1, 1, C.button); box(0, 0, 18, 18, 1, 1, C.button)
  box(-1, 0, 24, 25, 1, 1, C.tee) // белый ворот футболки
  box(-2, -2, 14, 24, 1, 1, C.zipTape); box(1, 1, 14, 24, 1, 1, C.zipTape) // молния по краям
  box(2, 3, 22, 22, 1, 1, C.zipTape); box(2, 2, 21, 21, 1, 1, C.zipPull) // нагрудный карман на молнии
  box(-4, -3, 18, 18, 1, 1, C.jacketDark); box(2, 3, 18, 18, 1, 1, C.jacketDark) // карманы
  box(-4, -3, 19, 19, 2, 2, C.jacket); box(2, 3, 19, 19, 2, 2, C.jacket) // клапаны карманов
  box(-3, -2, 24, 25, 2, 2, C.jacket); box(1, 2, 24, 25, 2, 2, C.jacket) // воротник

  // Левая рука (для зрителя) — опущена в карман
  box(-8, -5, 14, 25, -2, 1, C.jacket)
  box(-8, -5, 14, 15, -2, 1, C.jacketDark) // манжета
  // Правая рука — отдельная часть, ей фигурка машет
  box(4, 7, 14, 25, -2, 1, C.jacket, 'arm')
  box(4, 7, 14, 15, -2, 1, C.jacketDark, 'arm')
  box(4, 7, 12, 13, -2, 1, C.skin, 'hand') // ладонь: видна, только когда рука поднята

  // Голова 8×8×8 и лицо
  box(-4, 3, 26, 33, -4, 3, C.skin)
  box(-3, -3, 29, 30, 3, 3, C.eyeWhite); box(-2, -2, 29, 30, 3, 3, C.pupil)
  box(1, 1, 29, 30, 3, 3, C.pupil); box(2, 2, 29, 30, 3, 3, C.eyeWhite)
  box(-3, -2, 31, 31, 3, 3, C.brow); box(1, 2, 31, 31, 3, 3, C.brow)
  box(-1, 0, 28, 28, 3, 3, C.skinShade) // нос
  box(-1, 0, 27, 27, 3, 3, C.mouth)
  box(-4, 3, 26, 26, 3, 3, C.skinShade) // тень под подбородком

  // Причёска: объёмный слой поверх головы с неровной кудрявой макушкой
  for (let x = -5; x <= 4; x++)
    for (let z = -5; z <= 4; z++) {
      const r = hash(x, 99, z)
      const inner = Math.abs(x + 0.5) < 4 && Math.abs(z + 0.5) < 4
      const top = 34 + (r < 0.6 ? 1 : 0) + (inner && r < 0.22 ? 1 : 0)
      box(x, x, 34, top, z, z, C.hair)
    }
  box(-5, 4, 27, 33, -5, -5, C.hair) // затылок
  box(-5, -5, 30, 33, -5, 4, C.hair); box(4, 4, 30, 33, -5, 4, C.hair) // виски
  box(-5, -5, 28, 29, -5, -1, C.hair); box(4, 4, 28, 29, -5, -1, C.hair)
  box(-5, 4, 33, 33, 4, 4, C.hair) // чёлка над лбом
  for (const x of [-5, -4, -3, -1, 0, 3, 4]) box(x, x, 32, 32, 4, 4, C.hair) // пряди
  box(-5, -4, 31, 31, 4, 4, C.hair); box(4, 4, 31, 31, 4, 4, C.hair)

  // Оставляем только видимые снаружи кубики (соседей считаем внутри своей части,
  // чтобы при поднятой руке в корпусе не было дыры)
  const out = { body: [], arm: [], hand: [] }
  for (const v of m.values()) {
    const [x, y, z, , part] = v
    const exposed = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].some(([a, b, c]) => {
      const n = m.get(`${x + a},${y + b},${z + c}`)
      return !n || n[4] !== part
    })
    if (exposed) out[part].push(v)
  }
  return out
}

export const VOXEL = 0.1
export const VOXEL_HEIGHT = 37 * VOXEL
const PIVOT = [6, 26] // плечо правой руки, в вокселях


/* Набор вокселей одним InstancedMesh; offset — сдвиг в вокселях (для руки от плеча) */
const ZERO = [0, 0]
function Voxels({ list, size, offset = ZERO, ...props }) {
  const ref = useRef()
  useLayoutEffect(() => {
    const o = new THREE.Object3D()
    const col = new THREE.Color()
    list.forEach(([x, y, z, c], i) => {
      o.position.set((x + 0.5 - offset[0]) * size, (y + 0.5 - offset[1]) * size, (z + 0.5) * size)
      o.updateMatrix()
      ref.current.setMatrixAt(i, o.matrix)
      ref.current.setColorAt(i, col.set(c))
    })
    ref.current.instanceMatrix.needsUpdate = true
    ref.current.instanceColor.needsUpdate = true
  }, [list, size, offset])
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, list.length]} {...props}>
      <boxGeometry args={[size * 0.94, size * 0.94, size * 0.94]} />
      <meshStandardMaterial roughness={0.75} />
    </instancedMesh>
  )
}

/* Живая фигурка: по клику машет рукой и говорит фразу.
   При входе в раздел здоровается сама (если анимации в системе не выключены). */
export default function VoxelMe({ size = VOXEL, on = true }) {
  const parts = useMemo(build, [])
  const PHRASES = useT().about.phrases
  const arm = useRef()
  const hand = useRef()
  const wave = useRef(0) // сколько секунд ещё махать
  const next = useRef(0)
  const [msg, setMsg] = useState(null)
  const [hov, setHov] = useState(false)
  useCursor(hov)

  const greet = () => {
    wave.current = 2.4
    setMsg(PHRASES[next.current++ % PHRASES.length])
  }

  useEffect(() => {
    if (!on) {
      wave.current = 0
      setMsg(null)
      return
    }
    if (REDUCED) return
    const t = setTimeout(greet, 1100)
    return () => clearTimeout(t)
  }, [on])

  useEffect(() => {
    if (!msg) return
    const t = setTimeout(() => setMsg(null), 3200)
    return () => clearTimeout(t)
  }, [msg])

  useFrame((s, dt) => {
    wave.current = Math.max(0, wave.current - dt)
    const target = wave.current > 0 ? 2.55 + Math.sin(s.clock.elapsedTime * 11) * 0.32 : 0
    arm.current.rotation.z += (target - arm.current.rotation.z) * Math.min(1, dt * 9)
    hand.current.visible = arm.current.rotation.z > 0.6
  })

  const events = {
    onClick: (e) => (e.stopPropagation(), greet()),
    onPointerOver: (e) => (e.stopPropagation(), setHov(true)),
    onPointerOut: () => setHov(false),
  }

  return (
    <group>
      <Voxels list={parts.body} size={size} {...events} />
      <group ref={arm} position={[PIVOT[0] * size, PIVOT[1] * size, 0]}>
        <Voxels list={parts.arm} size={size} offset={PIVOT} {...events} />
        <group ref={hand}>
          <Voxels list={parts.hand} size={size} offset={PIVOT} />
        </group>
      </group>
      <Html position={[0.5, 3.25, 0]} zIndexRange={[6, 0]} style={{ pointerEvents: 'none' }}>
        <div className={`bubble ${msg && on ? 'on' : ''}`}>{msg || ' '}</div>
      </Html>
    </group>
  )
}
