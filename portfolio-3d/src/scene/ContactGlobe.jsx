import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { ACCENT, REDUCED } from './layout'

/* ── 05 Контакты: каркасный глобус со светящейся точкой и бумажным самолётиком на орбите ── */
const R = 1.45 // радиус глобуса
const CENTER = [0, 2.3, 0]
const ORBIT = 2.25 // радиус орбиты самолётика
const TILT = 0.38 // наклон орбиты
const ALMATY = { lat: 43.24, lon: 76.89 }

// Широта/долгота → точка на сфере
function toXYZ(lat, lon, r = R) {
  const phi = THREE.MathUtils.degToRad(90 - lat)
  const theta = THREE.MathUtils.degToRad(lon + 180)
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta))
}

// Сетка меридианов и параллелей
function useGraticule() {
  return useMemo(() => {
    const lines = []
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts = []
      for (let lon = -180; lon <= 180; lon += 6) pts.push(toXYZ(lat, lon))
      lines.push({ pts, main: lat === 0 })
    }
    for (let lon = -180; lon < 180; lon += 30) {
      const pts = []
      for (let lat = -90; lat <= 90; lat += 6) pts.push(toXYZ(lat, lon))
      lines.push({ pts, main: false })
    }
    return lines
  }, [])
}

// Бумажный самолётик: нос смотрит вдоль +Z
function usePlaneGeometry() {
  return useMemo(() => {
    const N = [0, 0, 0.42]
    const L = [-0.3, 0.02, -0.28]
    const Rr = [0.3, 0.02, -0.28]
    const C = [0, 0, -0.22]
    const K = [0, -0.11, -0.26]
    const tri = [N, L, C, N, C, Rr, N, K, C, N, C, K]
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(tri.flat(), 3))
    g.computeVertexNormals()
    return g
  }, [])
}

const UP = new THREE.Vector3(0, 1, 0)
const look = new THREE.Matrix4()
const orbitPoint = (a, out = new THREE.Vector3()) =>
  out.set(Math.cos(a) * ORBIT, 0, Math.sin(a) * ORBIT).applyAxisAngle(new THREE.Vector3(1, 0, 0), TILT)

export default function ContactGlobe() {
  const globe = useRef()
  const plane = useRef()
  const pulse = useRef()
  const graticule = useGraticule()
  const planeGeo = usePlaneGeometry()
  const marker = useMemo(() => toXYZ(ALMATY.lat, ALMATY.lon), [])
  // Поворот, при котором Алматы смотрит на зрителя
  const face = useMemo(() => -Math.atan2(marker.x, marker.z), [marker])
  const markerRot = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), marker.clone().normalize()),
    [marker]
  )
  const orbitLine = useMemo(() => Array.from({ length: 97 }, (_, i) => orbitPoint((i / 96) * Math.PI * 2)), [])
  const angle = useRef(2.2) // старт слева-спереди, чтобы самолётик сразу было видно
  const tmpA = useMemo(() => new THREE.Vector3(), [])
  const tmpB = useMemo(() => new THREE.Vector3(), [])

  useFrame((s, dt) => {
    const k = Math.min(1, dt * 3)
    // Глобус слегка покачивается и следит за мышью, Алматы остаётся на виду
    const sway = REDUCED ? 0 : Math.sin(s.clock.elapsedTime * 0.35) * 0.35
    globe.current.rotation.y += (face + sway + s.pointer.x * 0.5 - globe.current.rotation.y) * k
    globe.current.rotation.x += (0.32 - s.pointer.y * 0.2 - globe.current.rotation.x) * k

    // Самолётик летит по орбите и смотрит по направлению полёта
    // Самолётик летает всегда (медленно и плавно), даже при «уменьшении движения» в системе
    angle.current += dt * (REDUCED ? 0.35 : 0.55)
    orbitPoint(angle.current, tmpA)
    orbitPoint(angle.current + 0.05, tmpB)
    plane.current.position.copy(tmpA)
    look.lookAt(tmpB, tmpA, UP) // +Z самолётика — по направлению полёта (в локальных координатах)
    plane.current.quaternion.setFromRotationMatrix(look)
    plane.current.rotateZ(-0.35) // крен в повороте

    // Расходящееся кольцо вокруг точки Алматы
    const p = REDUCED ? 0.5 : (s.clock.elapsedTime * 0.7) % 1
    pulse.current.scale.setScalar(0.6 + p * 1.6)
    pulse.current.material.opacity = 0.7 * (1 - p)
  })

  return (
    <group position={CENTER}>
      <group ref={globe}>
        {/* Тёмное ядро скрывает обратную сторону сетки */}
        <mesh>
          <sphereGeometry args={[R * 0.985, 48, 32]} />
          <meshStandardMaterial color="#111823" roughness={0.9} />
        </mesh>
        {graticule.map((l, i) => (
          <Line key={i} points={l.pts} color={ACCENT} lineWidth={l.main ? 1.6 : 1} transparent opacity={l.main ? 0.7 : 0.35} />
        ))}
        {/* Алматы */}
        <group position={marker} quaternion={markerRot}>
          <mesh>
            <boxGeometry args={[0.09, 0.09, 0.09]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
          <mesh ref={pulse} position={[0, 0, 0.01]}>
            <ringGeometry args={[0.1, 0.13, 32]} />
            <meshBasicMaterial color={ACCENT} transparent toneMapped={false} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        </group>
      </group>

      {/* Орбита и самолётик */}
      <Line points={orbitLine} color={ACCENT} lineWidth={1} dashed dashSize={0.12} gapSize={0.1} transparent opacity={0.45} />
      <mesh ref={plane} geometry={planeGeo}>
        <meshStandardMaterial color="#eef0ea" flatShading side={THREE.DoubleSide} roughness={0.6} />
      </mesh>

      {/* Тень на полу */}
      <mesh position={[0, -CENTER[1] + 0.02, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[1.5, 48]} />
        <meshBasicMaterial color="#000" transparent opacity={0.35} />
      </mesh>
    </group>
  )
}
