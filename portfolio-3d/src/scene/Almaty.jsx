import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { REDUCED } from './layout'

/* Ночной Алматы на заднем плане: горы Заилийского Алатау со снежными вершинами,
   море городских огней, Кок-Тобе с телебашней, звёзды и луна.
   Всё воксельное, без освещения и тумана. Слои движутся за камерой с разной
   скоростью (параллакс), поэтому фон есть на любом разделе. */

// Детерминированный случайный генератор — фон всегда одинаковый
function rng(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const mix = (a, b, t) => new THREE.Color(a).lerp(new THREE.Color(b), t)

/* Набор кубиков одним InstancedMesh: { p:[x,y,z], s:[sx,sy,sz], c:Color } */
function Cubes({ items }) {
  const ref = useRef()
  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    items.forEach((it, i) => {
      m.compose(new THREE.Vector3(...it.p), q, new THREE.Vector3(...it.s))
      ref.current.setMatrixAt(i, m)
      ref.current.setColorAt(i, it.c)
    })
    ref.current.instanceMatrix.needsUpdate = true
    ref.current.instanceColor.needsUpdate = true
  }, [items])
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, items.length]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial fog={false} toneMapped={false} />
    </instancedMesh>
  )
}

/* Облако светящихся точек: окна, огни улиц, звёзды */
function Lights({ pos, col, size }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
    return g
  }, [pos, col])
  return (
    <points geometry={geo} frustumCulled={false}>
      <pointsMaterial size={size} sizeAttenuation={false} vertexColors fog={false} toneMapped={false} />
    </points>
  )
}

function mountains(rand) {
  const out = []
  const V = 0.8
  const ridge = (z, base, amp, phase, cLow, cHigh, snow, snowLine) => {
    for (let i = -90; i <= 90; i++) {
      const h = Math.max(
        3,
        Math.round(base + amp * Math.sin(i * 0.06 + phase) + amp * 0.5 * Math.sin(i * 0.17 + phase * 2) + 1.6 * Math.sin(i * 0.47))
      )
      for (let y = 0; y < h; y++) {
        const isSnow = h > snowLine && y >= h - 2 - (h > snowLine + 3 ? 1 : 0)
        const c = isSnow ? new THREE.Color(snow) : mix(cLow, cHigh, y / h)
        out.push({ p: [i * V, y * V + V / 2, z], s: [V, V, V], c })
      }
    }
  }
  ridge(-78, 15, 6, 2.2, '#0e1219', '#161e2a', '#46566a', 17) // дальний хребет
  ridge(-62, 9, 5, 0.4, '#10161f', '#1c2738', '#6f84a0', 12) // ближний хребет
  return out
}

function city(rand) {
  const blocks = []
  const winPos = []
  const winCol = []
  const warm = new THREE.Color('#ffc46b')
  const cool = new THREE.Color('#9fd0ff')
  const white = new THREE.Color('#f4efe4')
  const pick = () => {
    const r = rand()
    return r < 0.68 ? warm : r < 0.88 ? cool : white
  }

  // Здания: в центре выше, по краям ниже
  for (let n = 0; n < 340; n++) {
    const x = (rand() - 0.5) * 130
    const z = -24 - rand() * 26
    const center = Math.exp(-((x + 4) ** 2) / 220)
    const tall = rand() < 0.12 + center * 0.4
    const h = tall ? 2 + rand() * (3 + center * 6) : 0.4 + rand() * 1.4
    const w = 0.6 + rand() * 1.4
    const d = 0.6 + rand() * 1.2
    blocks.push({ p: [x, h / 2, z], s: [w, h, d], c: mix('#0d1117', '#141a23', rand()) })
    // Окна на фасаде, обращённом к зрителю
    for (let wy = 0.3; wy < h - 0.15; wy += 0.32)
      for (let wx = -w / 2 + 0.2; wx < w / 2 - 0.1; wx += 0.28)
        if (rand() < 0.38) {
          winPos.push(x + wx, wy, z + d / 2 + 0.02)
          const c = pick()
          winCol.push(c.r, c.g, c.b)
        }
  }

  // Море огней на улицах: сетка улиц с разбросом
  const street = []
  const streetCol = []
  for (let n = 0; n < 3200; n++) {
    const onAvenue = rand() < 0.6
    let x = (rand() - 0.5) * 140
    let z = -20 - rand() * 34
    if (onAvenue) {
      if (rand() < 0.5) x = Math.round(x / 2.4) * 2.4 + (rand() - 0.5) * 0.15
      else z = Math.round(z / 2.4) * 2.4 + (rand() - 0.5) * 0.15
    }
    street.push(x, 0.05 + rand() * 0.08, z)
    const c = rand() < 0.75 ? new THREE.Color('#ffb04f') : white
    streetCol.push(c.r, c.g, c.b)
  }
  return { blocks, winPos, winCol, street, streetCol }
}

/* Кок-Тобе: холм и телебашня */
function kokTobe() {
  const out = []
  const V = 0.6
  const hill = '#151c27'
  for (let i = -8; i <= 8; i++) {
    const h = Math.round(5 - (i * i) / 14)
    for (let y = 0; y < h; y++) out.push({ p: [i * V, y * V + V / 2, 0], s: [V, V, V * 2], c: mix('#0f141c', hill, y / 5) })
  }
  const base = 5 * V
  const steel = new THREE.Color('#3a4555')
  out.push({ p: [0, base + 4.5, 0], s: [0.22, 9, 0.22], c: steel })
  out.push({ p: [-0.55, base + 1.6, 0], s: [0.12, 3.2, 0.12], c: steel })
  out.push({ p: [0.55, base + 1.6, 0], s: [0.12, 3.2, 0.12], c: steel })
  out.push({ p: [0, base + 6.2, 0], s: [0.7, 0.35, 0.7], c: new THREE.Color('#4a5668') })
  out.push({ p: [0, base + 6.2, 0.36], s: [0.6, 0.12, 0.02], c: new THREE.Color('#7fb8ff') })
  return { cubes: out, top: base + 9.1 }
}

function sky(rand) {
  const pos = []
  const col = []
  for (let n = 0; n < 520; n++) {
    pos.push((rand() - 0.5) * 260, 10 + rand() * 60, -100 - rand() * 10)
    const b = 0.45 + rand() * 0.5
    col.push(0.8 * b, 0.86 * b, 1 * b)
  }
  return { pos, col }
}

function moon() {
  const out = []
  const V = 0.9
  for (let x = -4; x <= 4; x++)
    for (let y = -4; y <= 4; y++)
      if (x * x + y * y <= 17) {
        const crater = (x === 1 && y === 1) || (x === -2 && y === -1) || (x === -1 && y === 2) || (x === 2 && y === -2)
        out.push({ p: [x * V, y * V, 0], s: [V, V, V], c: new THREE.Color(crater ? '#aeb6c2' : '#dfe3ea') })
      }
  return out
}

function skyTexture() {
  const c = document.createElement('canvas')
  c.width = 4
  c.height = 256
  const g = c.getContext('2d')
  const grad = g.createLinearGradient(0, 0, 0, 256)
  grad.addColorStop(0, '#0d0f13')
  grad.addColorStop(0.6, '#10141c')
  grad.addColorStop(0.88, '#151d2b')
  grad.addColorStop(1, '#1b2537')
  g.fillStyle = grad
  g.fillRect(0, 0, 4, 256)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

export default function Almaty() {
  const data = useMemo(() => {
    const rand = rng(2026)
    return { mountains: mountains(rand), city: city(rand), tower: kokTobe(), stars: sky(rand), moon: moon(), tex: skyTexture() }
  }, [])
  const far = useRef()
  const mid = useRef()
  const near = useRef()
  const beacon = useRef()

  useFrame(({ camera, clock }) => {
    // Параллакс: дальние слои почти «прилипли» к камере, ближние отстают
    far.current.position.x = camera.position.x * 0.97
    mid.current.position.x = camera.position.x * 0.9
    near.current.position.x = camera.position.x * 0.72
    const on = REDUCED || Math.sin(clock.elapsedTime * 3) > 0
    beacon.current.material.color.set(on ? '#ff3b3b' : '#4a1414')
  })

  return (
    <group>
      {/* Небо, звёзды, луна */}
      <group ref={far}>
        {/* Градиент неба только выше горизонта (y > 0), ниже — тёмная земля */}
        <mesh position={[0, 60, -110]}>
          <planeGeometry args={[420, 120]} />
          <meshBasicMaterial map={data.tex} fog={false} toneMapped={false} depthWrite={false} />
        </mesh>
        <Lights pos={data.stars.pos} col={data.stars.col} size={1.6} />
        <group position={[30, 30, -98]}>
          <Cubes items={data.moon} />
        </group>
      </group>

      {/* Горы */}
      <group ref={mid}>
        <Cubes items={data.mountains} />
      </group>

      {/* Город и Кок-Тобе */}
      <group ref={near}>
        <Cubes items={data.city.blocks} />
        <Lights pos={data.city.winPos} col={data.city.winCol} size={2} />
        <Lights pos={data.city.street} col={data.city.streetCol} size={1.8} />
        <group position={[-26, 0, -46]}>
          <Cubes items={data.tower.cubes} />
          <mesh ref={beacon} position={[0, data.tower.top, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshBasicMaterial color="#ff3b3b" fog={false} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
