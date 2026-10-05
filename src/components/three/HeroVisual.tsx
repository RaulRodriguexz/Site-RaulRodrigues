import { Suspense, lazy } from 'react'
import { useCanRender3D } from '../../hooks/useCanRender3D'

// RNF-02 / RNF-03: o Three.js vive num chunk próprio, buscado só depois de o
// HTML e o texto do hero já estarem na tela.
const HeroScene = lazy(() => import('./HeroScene'))

/**
 * O halo de cor do hero. Continua sangrando a dobra inteira: é um lavado de
 * fundo, e passar por trás do texto é o que ele deve fazer.
 *
 * Separado do palco (D-41): antes os dois viviam na mesma camada `inset-0`, e
 * era isso que deixava o Memoji ancorado ao centro da viewport enquanto o nome
 * ficava ancorado ao padding do container — dois eixos sem relação.
 */
export function HeroHalo() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_38%,rgba(140,98,172,0.20),transparent_58%),radial-gradient(ellipse_at_12%_88%,rgba(110,17,176,0.08),transparent_52%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-canvas" />
    </div>
  )
}

/**
 * O palco do Memoji — a cena 3D, ou a imagem quando não há WebGL.
 *
 * **D-41, eixo vertical.** É um filho flex com `flex-1`, não uma camada
 * absoluta: ocupa a altura que sobra depois do bloco de texto, seja ela qual
 * for. Colisão com o nome deixa de ser possível por construção, em vez de
 * depender de um deslocamento fixo que colapsa em janela baixa — era o que
 * fazia as últimas letras caírem sobre o ombro em 1440×700.
 *
 * **D-41, eixo horizontal — revisto.** A primeira versão dava ao palco uma
 * coluna própria à direita (`ml-auto` com largura fracionária), para abrir um
 * vão até o nome. Esse vão era cinto e suspensório: com a separação vertical
 * virando estrutural, a colisão que ele evitava já não podia acontecer. O
 * resíduo era um Memoji 357 px à direita do eixo do conteúdo.
 *
 * Agora o palco ocupa a largura cheia, então seu centro é o centro do
 * container — que é o mesmo eixo do conteúdo, porque o container é centrado.
 * Centralizar não é alinhar à grade: é simetria, e simetria precisa de eixo,
 * não de aresta. O eixo é o vão entre as duas colunas de texto do D-22.
 *
 * Nada de deslocamento em unidades de mundo na cena: unidade de mundo não
 * acompanha breakpoint, que foi o que reprovou o experimento de empurrar o
 * Memoji para a borda direita.
 *
 * Abaixo de 640 px nada muda em relação ao comportamento anterior.
 *
 * RNF-04 — a imagem é o caminho padrão, não o plano B envergonhado: ela é o que
 * aparece no celular, sem WebGL, e com `prefers-reduced-motion`.
 */
export function HeroStage() {
  const canRender3D = useCanRender3D()

  return (
    <div
      className="pointer-events-none relative mt-6 min-h-[38vh] w-full flex-1 sm:mt-8"
      aria-hidden="true"
    >
      {canRender3D ? (
        <Suspense fallback={null}>
          {/* o fade evita o "pop" quando o chunk 3D termina de carregar */}
          <div className="absolute inset-0 animate-[sceneIn_900ms_ease-out_forwards] opacity-0">
            <HeroScene />
          </div>
        </Suspense>
      ) : (
        /*
         * A partir de 640 px é dimensionada pela ALTURA disponível, não pela
         * largura da tela: assim nunca estoura a faixa que sobrou, que é a raiz
         * da colisão do D-41. O teto de 28rem existe para ela não inchar em tela
         * alta — sem ele passava de 400 para 655 px em 1440×1080. Abaixo de
         * 640 px o dimensionamento antigo fica como estava.
         */
        /*
         * D-91 — fallback sem o Memoji: a mesma forma geométrica, agora como um
         * SVG (icosaedro projetado) com um brilho suave atrás. Sem rede, sem
         * WebGL — é o que aparece no celular, sem GPU e com reduced-motion.
         */
        <div className="absolute inset-0 flex items-center justify-center text-primary-deep">
          <div className="absolute h-[52%] max-h-[22rem] w-[52%] max-w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(140,98,172,0.22),transparent_68%)]" />
          <svg
            viewBox="0 0 200 200"
            className="relative h-[46%] max-h-[20rem] w-auto opacity-90"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinejoin="round"
          >
            <polyline points="100,30 167,78 141,157 59,157 33,78 100,30" opacity="0.85" />
            <polyline points="120,73 132,111 100,134 68,111 80,73 120,73" opacity="0.85" />
            <polyline points="100,30 120,73 167,78 132,111 141,157 100,134 59,157 68,111 33,78 80,73 100,30" opacity="0.55" />
            {[
              [100, 30], [167, 78], [141, 157], [59, 157], [33, 78],
              [120, 73], [132, 111], [100, 134], [68, 111], [80, 73],
            ].map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.6" fill="currentColor" stroke="none" />
            ))}
          </svg>
        </div>
      )}

      <style>{`@keyframes sceneIn { to { opacity: 1 } }`}</style>
    </div>
  )
}
