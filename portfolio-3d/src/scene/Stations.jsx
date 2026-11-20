import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges, Html, Line, useCursor } from '@react-three/drei'
import * as THREE from 'three'
import { useT } from '../i18n'
import { ACCENT, REDUCED } from './layout'
import VoxelMe, { VOXEL_HEIGHT } from './VoxelMe'
import ContactGlobe from './ContactGlobe'

const DARK = '#1b1e22'
const LINE = '#3a4048'
const TEXT = '#e8e9e4'

/* ── 05 Контакты: глобус и самолётик (см. ContactGlobe.jsx) ── */
export function Contact({ on }) {
  return <ContactGlobe on={on} />
}

/* Плавное вращение: само по себе (если анимации разрешены) + за мышью */
function useSpin(ref, speed = 0.3, follow = 1) {
  const spin = useRef(0)
  useFrame((s, dt) => {
    const o = ref.current
    if (!o) return
    if (!REDUCED) spin.current += dt * speed
    const k = Math.min(1, dt * 4)
    o.rotation.y += (spin.current + s.pointer.x * 1.4 * follow - o.rotation.y) * k
    o.rotation.x += (-s.pointer.y * 0.5 * follow - o.rotation.x) * k
  })
}

/* Уголки выделения, как у выбранного объекта во вьюпорте */
function Brackets({ w, h, d, len = 0.32, color = ACCENT }) {
  const geo = useMemo(() => {
    const pts = []
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
      const c = new THREE.Vector3((sx * w) / 2, (sy * h) / 2, (sz * d) / 2)
      pts.push(c, c.clone().setX(c.x - sx * len))
      pts.push(c, c.clone().setY(c.y - sy * len))
      pts.push(c, c.clone().setZ(c.z - sz * len))
    }
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [w, h, d, len])
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={color} />
    </lineSegments>
  )
}

/* Гизмо осей X/Y/Z */
function Gizmo(props) {
  return (
    <group {...props}>
      <Line points={[[0, 0, 0], [0.9, 0, 0]]} color="#ff5a5a" lineWidth={2} />
      <Line points={[[0, 0, 0], [0, 0.9, 0]]} color="#5ad17a" lineWidth={2} />
      <Line points={[[0, 0, 0], [0, 0, 0.9]]} color="#5a9bff" lineWidth={2} />
    </group>
  )
}

/* Подпись в сцене (HTML поверх 3D) — видна только у активной станции */
function Label({ on, children, className = '', ...props }) {
  return (
    <Html center zIndexRange={[5, 0]} {...props}>
      <div className={`lbl ${on ? 'on' : ''} ${className}`}>{children}</div>
    </Html>
  )
}

/* ── 00 Главная: каркасный икосаэдр ── */
export function Hero({ on }) {
  const g = useRef()
  useSpin(g, 0.3)
  return (
    <group>
      <group ref={g} position={[0, 2.4, 0]}>
        <mesh>
          <icosahedronGeometry args={[1.9, 0]} />
          <meshBasicMaterial color={ACCENT} wireframe />
        </mesh>
        <mesh scale={0.6}>
          <icosahedronGeometry args={[1.9, 0]} />
          <meshStandardMaterial color="#2a2f35" flatShading roughness={0.5} />
        </mesh>
        <points>
          <icosahedronGeometry args={[1.9, 0]} />
          <pointsMaterial color={TEXT} size={0.1} />
        </points>
      </group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
        <ringGeometry args={[1.5, 1.56, 64]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.5} />
      </mesh>
      <Label on={on} position={[1.9, 4.5, 0]} className="tag">Icosahedron001</Label>
    </group>
  )
}

/* ── 01 Обо мне: воксельный портрет — выделенный объект «я» ── */
export function About({ on }) {
  const t = useT()
  const g = useRef()
  const spin = useRef(0)
  // Медленно поворачивается туда-сюда и следит за мышью — лицо всегда к зрителю
  useFrame((s, dt) => {
    if (!REDUCED) spin.current += dt
    const k = Math.min(1, dt * 4)
    const ty = Math.sin(spin.current * 0.5) * 0.45 + s.pointer.x * 0.9
    g.current.rotation.y += (ty - g.current.rotation.y) * k
  })
  const h = VOXEL_HEIGHT
  return (
    <group>
      <group ref={g}>
        <VoxelMe on={on} />
      </group>
      <group position={[0, h / 2 + 0.05, 0]}>
        <Brackets w={1.9} h={h + 0.3} d={1.25} />
      </group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.85, 0.9, 48]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.6} />
      </mesh>
      <Label on={on} position={[0, h + 0.5, 0]} className="tag">{t.about.tag}</Label>
    </group>
  )
}

/* ── 02 Навыки: стек модификаторов из плит ── */
function Slab({ y, label, on, mobile }) {
  const [hov, setHov] = useState(false)
  useCursor(hov)
  return (
    <mesh
      position={[0, y, 0]}
      onPointerOver={(e) => (e.stopPropagation(), setHov(true))}
      onPointerOut={() => setHov(false)}
    >
      <boxGeometry args={[2.4, 0.34, 1.3]} />
      <meshStandardMaterial color={hov ? ACCENT : DARK} roughness={0.7} />
      <Edges color={hov ? '#0b0c0d' : LINE} />
      {!mobile && (
        <Label on={on} position={[0, 0, 0.66]} className={hov ? 'slab hov' : 'slab'}>
          {label}
        </Label>
      )}
    </mesh>
  )
}

export function Skills({ on, mobile }) {
  const SKILLS = useT().skills.groups
  const g = useRef()
  useFrame((s, dt) => {
    const k = Math.min(1, dt * 3)
    g.current.rotation.y += (s.pointer.x * 0.25 - g.current.rotation.y) * k
  })
  return (
    <group ref={g}>
      {SKILLS.map((grp, gi) => (
        <group key={gi} position={[(gi - 1) * 2.85, 0, 0]}>
          {grp.items.map((it, i) => (
            <Slab key={it} y={0.22 + i * 0.44} label={it} on={on} mobile={mobile} />
          ))}
          <Label on={on} position={[0, 0.3 + grp.items.length * 0.44, 0]} className="tag">
            {grp.group} · {String(grp.items.length).padStart(2, '0')}
          </Label>
        </group>
      ))}
    </group>
  )
}

/* ── 03 Проекты: мониторы с работами ── */
function Monitor({ p, i, x, on, mobile }) {
  const t = useT()
  const [hov, setHov] = useState(false)
  useCursor(hov)
  const open = () => window.open(p.url, '_blank', 'noopener')
  return (
    <group position={[x, 1.95, 0]} rotation-y={-x * 0.07}>
      <mesh onClick={open} onPointerOver={(e) => (e.stopPropagation(), setHov(true))} onPointerOut={() => setHov(false)}>
        <boxGeometry args={[3.2, 2.05, 0.14]} />
        <meshStandardMaterial color="#141619" roughness={0.6} />
        <Edges color={hov ? ACCENT : LINE} />
      </mesh>
      <mesh position={[0, -1.42, -0.05]}>
        <boxGeometry args={[0.14, 0.8, 0.1]} />
        <meshStandardMaterial color={DARK} />
      </mesh>
      <mesh position={[0, -1.83, 0]}>
        <boxGeometry args={[1.1, 0.06, 0.6]} />
        <meshStandardMaterial color={DARK} />
        <Edges color={LINE} />
      </mesh>
      {!mobile && (
        <Html transform position={[0, 0, 0.08]} distanceFactor={400 / 120} zIndexRange={[5, 0]}>
          <a
            className={`screen ${hov ? 'hov' : ''} ${on ? 'on' : ''}`}
            tabIndex={on ? 0 : -1}
            href={p.url}
            target="_blank"
            rel="noopener"
            onPointerEnter={() => setHov(true)}
            onPointerLeave={() => setHov(false)}
          >
            <span className="num">{String(i + 1).padStart(2, '0')}</span>
            <small>{p.tag}</small>
            <b>{p.title}</b>
            <p>{p.desc}</p>
            <em>{t.work.open}</em>
          </a>
        </Html>
      )}
      {mobile && (
        <mesh position={[0, 0, 0.08]}>
          <planeGeometry args={[3.0, 1.85]} />
          <meshBasicMaterial color={i === 0 ? ACCENT : '#2a2f35'} />
        </mesh>
      )}
    </group>
  )
}

export function Work({ on, mobile }) {
  const PROJECTS = useT().work.projects
  return (
    <group>
      {PROJECTS.map((p, i) => (
        <Monitor key={p.url} p={p} i={i} x={(i - (PROJECTS.length - 1) / 2) * 3.65} on={on} mobile={mobile} />
      ))}
    </group>
  )
}

/* ── 04 Опыт: ключевые кадры на таймлайне ── */
function Key({ pos, item, on }) {
  const m = useRef()
  useFrame((s, dt) => {
    if (!REDUCED && item.now) m.current.rotation.y += dt * 0.9
  })
  return (
    <group position={pos}>
      <mesh ref={m}>
        <octahedronGeometry args={[0.36, 0]} />
        {item.now ? (
          <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.35} flatShading />
        ) : (
          <meshBasicMaterial color={ACCENT} wireframe />
        )}
      </mesh>
      <Line points={[[0, -pos[1], 0], [0, -0.36, 0]]} color={LINE} lineWidth={1} dashed dashSize={0.1} gapSize={0.1} />
      <Label on={on} position={[0, 0.75, 0]} className={item.now ? 'tag now' : 'tag'}>
        {item.when}
      </Label>
    </group>
  )
}

export function Path({ on }) {
  const EXPERIENCE = useT().path.items
  const keys = EXPERIENCE.map((e, i) => [(i - 1) * 3.2, 0.9 + i * 1.15, 0])
  const g = useRef()
  useFrame((s, dt) => {
    const k = Math.min(1, dt * 3)
    g.current.rotation.y += (s.pointer.x * 0.3 - g.current.rotation.y) * k
  })
  return (
    <group ref={g}>
      <Line
        points={[[-4.4, 0.45, 0], ...keys, [4.4, 4.0, 0]]}
        color={ACCENT}
        lineWidth={1.5}
        dashed
        dashSize={0.18}
        gapSize={0.12}
      />
      {EXPERIENCE.map((e, i) => (
        <Key key={i} pos={keys[i]} item={e} on={on} />
      ))}
    </group>
  )
}

