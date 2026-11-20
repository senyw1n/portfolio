import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges, Html } from '@react-three/drei'
import * as THREE from 'three'
import { ACCENT, REDUCED } from './layout'
import { useT } from '../i18n'

/* ── 05 Контакты: конверт открывается, из него выезжает письмо ── */
const W = 3.2 // ширина конверта
const H = 2.0 // высота конверта
const ENV = '#2a3441' // цвет конверта
const EDGE = '#6a8cae'
const PAPER = '#f1efe9'
const FLAP_OPEN = -Math.PI * 1.08 // клапан откидывается назад
const LETTER_UP = 2.0 // насколько выезжает письмо
const tmp = new THREE.Vector3()
const clamp01 = (v) => Math.max(0, Math.min(1, v))
const ease = (t) => t * t * (3 - 2 * t)

function shapeGeo(points) {
  const s = new THREE.Shape()
  points.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)))
  s.closePath()
  return new THREE.ShapeGeometry(s)
}

export default function Envelope({ on }) {
  const L = useT().contact.letter
  const root = useRef()
  const flap = useRef()
  const letter = useRef()
  const card = useRef()
  const p = useRef(0) // 0 — закрыт, 1 — письмо выехало

  // Передняя «кармашек» с V-вырезом и треугольный клапан
  const pocket = useMemo(
    () => shapeGeo([[-W / 2, -H / 2], [W / 2, -H / 2], [W / 2, H * 0.18], [0, -H * 0.12], [-W / 2, H * 0.18]]),
    []
  )
  const flapGeo = useMemo(() => shapeGeo([[-W / 2, 0], [W / 2, 0], [0, -H * 0.58]]), [])

  useFrame((s, dt) => {
    // Конверт развёрнут к камере и слегка следует за мышью
    const o = root.current
    const wp = o.getWorldPosition(tmp)
    const face = Math.atan2(s.camera.position.x - wp.x, s.camera.position.z - wp.z)
    const k = Math.min(1, dt * 4)
    o.rotation.y += (face + s.pointer.x * 0.35 - o.rotation.y) * k
    o.rotation.x += (-s.pointer.y * 0.15 - o.rotation.x) * k

    // Открытие: сначала клапан, потом письмо. При «меньше движения» — сразу итог
    const target = on ? 1 : 0
    if (REDUCED) p.current = target
    else p.current += Math.sign(target - p.current) * Math.min(Math.abs(target - p.current), dt * (on ? 0.7 : 2))
    const tf = ease(clamp01(p.current * 2))
    const tl = ease(clamp01(p.current * 2 - 1))
    flap.current.rotation.x = FLAP_OPEN * tf
    letter.current.position.y = LETTER_UP * tl
    if (card.current) card.current.style.opacity = String(clamp01(tl * 1.6 - 0.6))
  })

  return (
    <group ref={root} position={[0, 1.1, 0]}>
      {/* задняя стенка */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[W, H, 0.04]} />
        <meshStandardMaterial color={ENV} roughness={0.8} />
        <Edges color={EDGE} />
      </mesh>

      {/* письмо */}
      <group ref={letter}>
        <mesh>
          <boxGeometry args={[W - 0.3, H - 0.2, 0.02]} />
          <meshStandardMaterial color={PAPER} roughness={0.9} />
        </mesh>
        <Html transform position={[0, 0, 0.012]} distanceFactor={400 / 120} zIndexRange={[5, 0]}>
          <div className="letter" ref={card}>
            <small>{L.kicker}</small>
            <b>{L.title}</b>
            <p>{L.text}</p>
            <a href="https://t.me/senyw1n" target="_blank" rel="noopener">{L.cta}</a>
            <i>— Sayat Zhaksybay</i>
          </div>
        </Html>
      </group>

      {/* передний кармашек */}
      <mesh geometry={pocket} position={[0, 0, 0.04]}>
        <meshStandardMaterial color={ENV} roughness={0.8} side={THREE.DoubleSide} />
        <Edges color={EDGE} />
      </mesh>
      <lineSegments position={[0, 0, 0.045]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([-W / 2, -H / 2, 0, 0, -H * 0.12, 0, W / 2, -H / 2, 0, 0, -H * 0.12, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={EDGE} />
      </lineSegments>

      {/* клапан на петле по верхнему краю */}
      <group ref={flap} position={[0, H / 2, 0.06]}>
        <mesh geometry={flapGeo}>
          <meshStandardMaterial color="#323e4d" roughness={0.8} side={THREE.DoubleSide} />
          <Edges color={EDGE} />
        </mesh>
        {/* печать */}
        <mesh position={[0, -H * 0.42, 0.02]}>
          <circleGeometry args={[0.2, 32]} />
          <meshBasicMaterial color={ACCENT} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  )
}
