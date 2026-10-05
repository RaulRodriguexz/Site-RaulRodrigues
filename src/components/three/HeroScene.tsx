import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { HeroForm } from './HeroForm'
import { Backdrop } from './Backdrop'
import { useScrollProgress } from '../../hooks/useScrollProgress'

/**
 * M-3 e M-4 do PRD 5.2.1.
 *
 * M-3 — parallax: a cena inteira segue o mouse com atraso. A interpolação usa
 * `1 - 0.001^delta` em vez de um fator fixo: assim a suavidade é a mesma em
 * 60 Hz e em 144 Hz, em vez de ficar acelerada em telas rápidas.
 *
 * M-4 — scroll: ao rolar os primeiros 600 px, a cena recua no eixo Z, sobe um
 * pouco e perde opacidade. Ela sai de cena sem sumir de repente, e não continua
 * competindo com o conteúdo das seções de baixo.
 */
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<Group>(null)
  const scroll = useScrollProgress(600)

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return

    const k = 1 - Math.pow(0.001, delta)

    // M-3 — parallax do mouse
    const targetX = -state.pointer.y * 0.12
    const targetY = state.pointer.x * 0.18
    g.rotation.x += (targetX - g.rotation.x) * k
    g.rotation.y += (targetY - g.rotation.y) * k

    // M-4 — recuo no scroll
    const p = scroll.current
    g.position.z = -p * 2.4
    g.position.y = p * 0.7
    g.scale.setScalar(1 - p * 0.12)
  })

  return <group ref={group}>{children}</group>
}

/**
 * Cena 3D do hero. Carregada por `React.lazy` a partir do HeroBackdrop, então
 * o Three.js só chega depois de o conteúdo estar na tela (RNF-02, RNF-03).
 */
export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      // RNF-06: a cena é decorativa — leitores de tela devem ignorá-la
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      <Suspense fallback={null}>
        <Rig>
          {/*
            D-41 — o deslocamento horizontal saiu daqui: o palco já é uma coluna
            ancorada à direita, então empurrar a cena de novo em x seria mover
            duas vezes. A escala subiu de 0,9 para 1,3 porque o palco ficou mais
            baixo que a dobra inteira, e a cena é dimensionada pela altura do
            canvas — sem isso o Memoji encolhia de 366 para 266 px de pele.
          */}
          <group position={[0, -0.28, 0]} scale={1.3}>
            <HeroForm />
            <Backdrop />
          </group>
        </Rig>
      </Suspense>
    </Canvas>
  )
}
