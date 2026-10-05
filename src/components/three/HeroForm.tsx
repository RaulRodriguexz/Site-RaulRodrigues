import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { IcosahedronGeometry, type Group } from 'three'
import { useTema } from '../../hooks/useTema'
import { PALETAS } from './paleta'

/**
 * D-91 — a forma abstrata do hero, no lugar do Memoji (PRD 5.2 revisto).
 *
 * Um icosaedro em três camadas sobre a mesma geometria:
 *  - corpo sólido e opaco, que ESCREVE profundidade — é o que faz as órbitas
 *    do Backdrop sumirem de verdade por trás dele (mesma oclusão que o plano
 *    do Memoji dava, agora contra um volume real);
 *  - arestas em wireframe, levemente maiores para não brigar em z com o corpo;
 *  - vértices como pontos brilhando, que dão a leitura de "grafo/rede".
 *
 * Sem `.glb`, sem shader custom, sem luz: só geometria e `meshBasicMaterial`,
 * como o resto da cena (as cores já vêm prontas, não reagem a luz).
 *
 * Movimento igual ao que o Memoji tinha (M-3): respiração lenta + inclinação
 * própria um pouco mais forte que a do rig, para parecer à frente.
 */
export function HeroForm() {
  const group = useRef<Group>(null)
  const paleta = PALETAS[useTema()]

  // uma geometria só, compartilhada pelas três camadas
  const geometria = useMemo(() => new IcosahedronGeometry(1.15, 1), [])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return

    const t = state.clock.elapsedTime

    // respiração lenta — a cena nunca parece congelada
    g.position.y = Math.sin(t * 0.55) * 0.05

    // giro próprio, contínuo e devagar
    g.rotation.z = t * 0.04

    // inclinação pelo mouse, mais forte que a do rig (sensação de profundidade)
    const targetX = -state.pointer.y * 0.13 + t * 0.05
    const targetY = state.pointer.x * 0.17
    const k = 1 - Math.pow(0.0015, delta)
    g.rotation.x += (targetX - g.rotation.x) * k
    g.rotation.y += (targetY - g.rotation.y) * k
  })

  return (
    <group ref={group}>
      {/* corpo sólido: opaco, escreve profundidade (oclui as órbitas) */}
      <mesh geometry={geometria}>
        <meshBasicMaterial color={paleta.formaCorpo} />
      </mesh>

      {/* arestas em wireframe, um pouco maiores para não brigar em z */}
      <mesh geometry={geometria} scale={1.012}>
        <meshBasicMaterial
          color={paleta.formaAresta}
          wireframe
          transparent
          opacity={paleta.formaArestaOpacidade}
          toneMapped={false}
        />
      </mesh>

      {/* vértices brilhando */}
      <points geometry={geometria}>
        <pointsMaterial
          color={paleta.formaVertice}
          size={0.06}
          sizeAttenuation
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </points>
    </group>
  )
}
