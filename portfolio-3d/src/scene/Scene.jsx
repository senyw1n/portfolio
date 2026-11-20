import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Grid } from '@react-three/drei'
import * as THREE from 'three'
import { STATIONS } from '../data'
import { getLayout, SPACING, REDUCED } from './layout'
import { Hero, About, Skills, Work, Path, Contact } from './Stations'
import Almaty from './Almaty'

const OBJECTS = [Hero, About, Skills, Work, Path, Contact]

/* Камера плавно перелетает к активной станции и слегка следует за мышью */
function CameraRig({ active }) {
  const size = useThree((s) => s.size)
  const look = useRef(new THREE.Vector3(0, 6, 0))
  const goalPos = useRef(new THREE.Vector3())
  const goalLook = useRef(new THREE.Vector3())
  const frame = useRef(0)

  useFrame((state, dt) => {
    const st = STATIONS[active]
    const L = getLayout(size.width, size.height, st)
    const x = active * SPACING + L.shiftX
    const y = st.cy * L.scale - L.shiftY
    goalLook.current.set(x, y, 0)
    goalPos.current.set(x + state.pointer.x * 0.7, y + 1.3 + state.pointer.y * 0.4, L.dist)

    const k = 1 - Math.exp(-Math.min(dt, 0.05) * (REDUCED ? 7 : 2.6))
    state.camera.position.lerp(goalPos.current, k)
    look.current.lerp(goalLook.current, k)
    state.camera.lookAt(look.current)

    if (++frame.current % 6 === 0) {
      const el = document.getElementById('cam')
      const p = state.camera.position
      if (el) el.textContent = `X ${p.x.toFixed(1)}  Y ${p.y.toFixed(1)}  Z ${p.z.toFixed(1)}`
    }
  })
  return null
}

/* Обёртка станции: ставит объект на свою точку и подгоняет масштаб под экран */
function Station({ index, active, onSelect, children }) {
  const size = useThree((s) => s.size)
  const L = getLayout(size.width, size.height, STATIONS[index])
  const Obj = OBJECTS[index]
  return (
    <group position={[index * SPACING, 0, 0]} scale={L.scale}>
      <Obj on={index === active} mobile={L.mobile} onSelect={onSelect} />
      {children}
    </group>
  )
}

export default function Scene({ active, onSelect }) {
  return (
    <>
      <color attach="background" args={['#101113']} />
      <fog attach="fog" args={['#101113', 13, 30]} />
      <ambientLight intensity={0.7} />
      <hemisphereLight args={['#e8e9e4', '#101113', 0.6]} />
      <directionalLight position={[6, 10, 8]} intensity={1.6} />

      <Grid
        infiniteGrid
        position={[0, 0, 0]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#24282d"
        sectionSize={3}
        sectionThickness={1}
        sectionColor="#363c44"
        fadeDistance={34}
        fadeStrength={2}
        followCamera
      />

      <Almaty />
      <CameraRig active={active} />
      {STATIONS.map((s, i) => (
        <Station key={s.id} index={i} active={active} onSelect={onSelect} />
      ))}
    </>
  )
}
