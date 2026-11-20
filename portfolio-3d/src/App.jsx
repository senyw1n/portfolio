import { Suspense, useCallback, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { STATIONS } from './data'
import { FOV } from './scene/layout'
import Scene from './scene/Scene'
import Overlay from './ui/Overlay'

const LAST = STATIONS.length - 1
const clamp = (i) => Math.max(0, Math.min(LAST, i))
const fromHash = () => Math.max(0, STATIONS.findIndex((s) => '#' + s.id === location.hash))

/* Можно ли этим событием прокрутить сам текстовый блок (тогда не листаем сцену) */
function scrollsInside(target, dir) {
  const el = target instanceof Element && target.closest('[data-scroll]')
  if (!el || el.scrollHeight <= el.clientHeight + 2) return false
  return dir > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 2 : el.scrollTop > 2
}

export default function App() {
  const [active, setActive] = useState(fromHash)
  const go = useCallback((i) => setActive(clamp(i)), [])

  // Колесо, клавиши и свайпы переключают объекты сцены
  useEffect(() => {
    let lock = 0
    const step = (d) => {
      const now = performance.now()
      if (now < lock) return
      lock = now + 850
      setActive((a) => clamp(a + d))
    }
    const onWheel = (e) => {
      const d = Math.sign(e.deltaY || e.deltaX)
      if (!d || Math.abs(e.deltaY || e.deltaX) < 6 || scrollsInside(e.target, d)) return
      step(d)
    }
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea')) return
      if (['ArrowDown', 'ArrowRight', 'PageDown'].includes(e.key)) (e.preventDefault(), step(1))
      else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) (e.preventDefault(), step(-1))
      else if (e.key === 'Home') setActive(0)
      else if (e.key === 'End') setActive(LAST)
    }
    let t0 = null
    const onStart = (e) => (t0 = { x: e.touches[0].clientX, y: e.touches[0].clientY, target: e.target })
    const onEnd = (e) => {
      if (!t0) return
      const dx = e.changedTouches[0].clientX - t0.x
      const dy = e.changedTouches[0].clientY - t0.y
      const horizontal = Math.abs(dx) > Math.abs(dy)
      const d = horizontal ? -Math.sign(dx) : -Math.sign(dy)
      if (Math.max(Math.abs(dx), Math.abs(dy)) > 50 && (horizontal || !t0.target.closest?.('[data-scroll]'))) step(d)
      t0 = null
    }
    const onHash = () => setActive(fromHash())
    addEventListener('wheel', onWheel, { passive: true })
    addEventListener('keydown', onKey)
    addEventListener('touchstart', onStart, { passive: true })
    addEventListener('touchend', onEnd)
    addEventListener('hashchange', onHash)
    return () => {
      removeEventListener('wheel', onWheel)
      removeEventListener('keydown', onKey)
      removeEventListener('touchstart', onStart)
      removeEventListener('touchend', onEnd)
      removeEventListener('hashchange', onHash)
    }
  }, [])

  useEffect(() => {
    history.replaceState(null, '', '#' + STATIONS[active].id)
  }, [active])

  return (
    <>
      <div className="stage">
        <Canvas dpr={[1, 2]} camera={{ fov: FOV, position: [0, 7, 22], near: 0.1, far: 220 }}>
          <Suspense fallback={null}>
            <Scene active={active} onSelect={go} />
          </Suspense>
        </Canvas>
      </div>
      <Overlay active={active} go={go} />
    </>
  )
}
