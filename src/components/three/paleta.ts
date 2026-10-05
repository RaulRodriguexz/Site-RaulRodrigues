import type { Tema } from '../../hooks/useTema'

/**
 * D-44, frente 2 — as cores das duas cenas 3D, por tema.
 *
 * **Por que existe este arquivo.** As cores do WebGL não podem vir do CSS: um
 * material recebe valor, não propriedade herdada, e `var(--color-primary)` não
 * significa nada dentro de um `<Canvas>`. Antes desta frente havia doze
 * literais espalhados por cinco arquivos de `three/`, cada um com a paleta
 * clara assada dentro. Duplicar isso por tema daria vinte e quatro. Aqui é um
 * lugar só, e a diferença entre os temas fica legível de uma vez.
 *
 * **A regra que atravessa a tabela inteira:** em fundo escuro a mistura sobe de
 * um piso muito baixo, então cada ponto de opacidade rende mais — e com
 * `AdditiveBlending` rende muito mais, porque ele SOMA luz e o preto é zero.
 * Por isso quase toda opacidade **cai** no escuro em vez de subir. É o mesmo
 * mecanismo já medido no grão (frente 3) e no fio (frente 5).
 *
 * A matiz é 303.724 nos dois temas, como manda o D-44: o que muda é
 * luminosidade e croma, nunca a matiz — mexer nela trocaria a cor da marca em
 * vez de adaptá-la.
 */
export type Paleta = {
  /**
   * Hero — a forma abstrata no centro (D-91, substitui o Memoji): icosaedro
   * com corpo sólido, arestas em wireframe e vértices brilhando. O corpo é
   * opaco e escreve profundidade, então as órbitas somem de verdade atrás dele.
   */
  formaCorpo: string
  formaAresta: string
  formaArestaOpacidade: number
  formaVertice: string
  /** Hero — anel largo e a faísca que corre nele (M-5). */
  anelLargo: string
  anelLargoOpacidade: number
  /** Hero — anel menor, girando ao contrário. */
  anelPequeno: string
  anelPequenoOpacidade: number
  /** Hero — a poeira em volta do Memoji. */
  poeira: string
  poeiraOpacidade: number
  /** Hero — as três paradas do halo atrás do Memoji, já com alfa. */
  halo: [string, string, string]
  /** Hero — as três paradas da sombra de contato sob o Memoji. */
  sombra: [string, string, string]
  /** Globo — o corpo da esfera, que faz o papel de oceano. */
  oceano: string
  /** Globo — multiplicador da textura dos continentes (o material multiplica). */
  continentes: string
  /**
   * Globo — a cor da casca de atmosfera, em `AdditiveBlending`.
   *
   * Tem token próprio porque **não pode seguir o oceano**. Até o D-60 ela lia
   * `oceano` e isso passava despercebido: os dois temas tinham oceano roxo,
   * então o halo saía roxo por acidente. Com o claro invertido o oceano ficou
   * quase branco, e um halo branco somado sobre uma página quase branca
   * satura e **desaparece**. Antes do D-56 ela já era desacoplada assim.
   */
  atmosfera: string
  /** Globo — a casca de atmosfera, em `AdditiveBlending`. */
  atmosferaOpacidade: number
  /**
   * Globo — as peças do pin que ficam **rentes à superfície**: o pé da haste
   * (D-25). Segue o oposto do **continente**, que é o que elas pisam.
   */
  pinNaSuperficie: string
  /**
   * Globo — as peças do pin que **sobem pela normal**: a haste e a cabeça
   * (D-25). Elas nunca são vistas contra a terra, e sim contra o **oceano** e o
   * fundo da página, então seguem o oposto do oceano.
   *
   * **A separação é a parte contraintuitiva do D-60**, e por isso ela existe:
   * uma cor só para o pin inteiro sempre erra uma das duas situações. Pin todo
   * escuro perde a cabeça no oceano roxo do tema escuro — foi o que o Raul viu.
   * Pin todo branco resolve a cabeça e perde o pé sobre a Irlanda branca. A peça
   * escolhe a cor pela **superfície que cruza**, não pelo tema.
   */
  pinAcimaDaSuperficie: string
  /**
   * Globo — a faixa **escura** do anel de radar (D-56).
   *
   * O anel não segue as regras acima, e não pode seguir: o pulso cresce 2,2× e
   * **atravessa a costa**, então cada faixa passa pelas duas superfícies dentro
   * do mesmo ciclo. O que o mantém legível é o par ser sempre **uma escura e
   * uma clara**, nos dois temas — assim uma das duas contrasta onde quer que o
   * pulso esteja. Amarrar a faixa escura à cor do pé deixaria as **duas** claras
   * no tema claro, e o anel sumiria inteiro sobre o oceano.
   */
  anelEscuro: string
  /** Globo — a faixa clara do anel de radar. */
  anelClaro: string
}

export const PALETAS: Record<Tema, Paleta> = {
  claro: {
    /* corpo lavanda que lê como sólido sobre a página quase branca; aresta
       roxo-profundo forte sobre ele; vértices no mesmo roxo dos links */
    formaCorpo: '#9a76bf',
    formaAresta: '#3d0a63',
    formaArestaOpacidade: 0.7,
    formaVertice: '#6e11b0',
    anelLargo: '#6e11b0',
    anelLargoOpacidade: 0.55,
    anelPequeno: '#8c62ac',
    anelPequenoOpacidade: 0.5,
    poeira: '#8c62ac',
    poeiraOpacidade: 0.6,
    halo: ['rgba(140, 98, 172, 0.30)', 'rgba(140, 98, 172, 0.12)', 'rgba(140, 98, 172, 0)'],
    sombra: ['rgba(110, 17, 176, 0.42)', 'rgba(110, 17, 176, 0.16)', 'rgba(110, 17, 176, 0)'],
    /*
     * D-60 — **a inversão por tema, que até aqui nunca tinha sido feita.** O
     * D-56 virou o globo do avesso e a frente 2 do D-44 deu ao escuro um oceano
     * roxo um pouco mais escuro que o do claro: os dois temas ficaram com
     * oceano roxo, e o escuro virou o claro com menos luz em vez do inverso
     * dele. O tema claro volta a ser o oposto: **oceano quase branco,
     * continentes roxos**.
     *
     * O par é exatamente o que existia antes do D-56 — `#fbfafd` e `#8c62ac`
     * —, e isso é de propósito: não é número novo, é o estado que o Raul já
     * tinha visto e aprovado, que é justamente o que esta decisão pede de volta.
     * Medido: continente contra oceano dá **4,53:1**, o mais perto que dá dos
     * 4,94:1 do escuro — os dois temas ficam simétricos, que era o alvo.
     *
     * **Zero KB novos:** a textura é a mesma e o material a multiplica, então
     * `continentes` é só o multiplicador. Partindo de uma textura clara,
     * multiplicar por roxo devolve continentes roxos e multiplicar por branco
     * devolve continentes brancos — com o mesmo PNG.
     */
    oceano: '#fbfafd',
    continentes: '#8c62ac',
    /* o halo roxo do pré-D-56, agora que o oceano não serve mais de cor dele */
    atmosfera: '#8c62ac',
    /*
     * D-65 (d) — 0,11 para 0,06. No tema claro esta camada NÃO clareia, ela
     * ESCURECE, e essa é a parte contraintuitiva: `AdditiveBlending` soma cor,
     * mas o canal alfa também acumula, e o navegador compõe o canvas sobre a
     * página com esse alfa. Sobre uma página quase branca, somar 6% de roxo e
     * cobrir 11% do fundo dá saldo negativo. Medido: a faixa ficava 0,117 de
     * luminância ABAIXO do fundo — um halo que escurece em vez de brilhar.
     */
    atmosferaOpacidade: 0.06,
    /*
     * Aqui o continente é roxo, então quem pisa nele tem de ser **claro** — é a
     * mesma regra do tema escuro chegando ao resultado oposto, porque a
     * superfície inverteu. Um pé roxo-escuro sobre a Irlanda roxa dá 1,88:1 e
     * repete o defeito que o próprio D-25 consertou. Assim dá **4,21:1**.
     */
    pinNaSuperficie: '#f4f1f8',
    /* contra oceano e página quase brancos: 8,52:1 e 8,58:1 */
    pinAcimaDaSuperficie: '#6e11b0',
    anelEscuro: '#6e11b0',
    anelClaro: '#f4f1f8',
  },
  escuro: {
    /* corpo roxo-escuro, mais claro que o canvas para existir sobre a página
       quase preta; aresta no roxo claro decorativo; vértices brancos brilhando */
    formaCorpo: '#2c2240',
    formaAresta: '#cd9cff',
    formaArestaOpacidade: 0.65,
    formaVertice: '#ffffff',
    /*
     * Os papéis dos dois roxos **invertem de luminosidade sem trocar de
     * função**, exatamente como nos tokens do CSS: no claro o `primary-deep` é
     * o escuro e desenha o anel largo por contraste contra a página branca; no
     * escuro ele é o claro — `rgb(205,156,255)` — e desenha o mesmo anel por
     * contraste contra a página preta. Sem esta troca o anel largo some, que
     * foi o primeiro defeito visível quando o Raul olhou a cena escura: medido
     * no pixel, ele dava **1,31:1** contra o fundo, ante 3,20:1 no claro.
     *
     * ⚠ **Aqui a regra do "cai no escuro" NÃO vale, e o D-44 supôs que valeria.**
     * Ele previu que "as órbitas com `AdditiveBlending` estouram" — mas as
     * órbitas nunca foram aditivas: `OrbitRing` usa `meshBasicMaterial` com
     * `transparent`, que é mistura normal. Só a POEIRA é aditiva. Em mistura
     * normal a opacidade é um cursor entre o fundo e a cor, e para chegar ao
     * mesmo contraste do claro ela tem de ficar quase igual. Medido e resolvido
     * contra o fundo local e conferido no pixel: 0,50 devolve 3,22:1 contra os
     * 3,20:1 do tema claro.
     */
    anelLargo: '#cd9cff',
    anelLargoOpacidade: 0.5,
    anelPequeno: '#bf81ff',
    anelPequenoOpacidade: 0.36,

    /*
     * D-58b — a poeira fica BRANCA no escuro, e a intensidade CAI. É decisão
     * por tema e não troca global: partícula branca sobre a página quase branca
     * do tema claro simplesmente sumiria. E como o material é `Additive`, no
     * escuro ele soma sobre quase zero: manter 0,6 estouraria os pontos.
     *
     * O número não busca paridade com o claro, e não deveria: medido no pixel,
     * a poeira do tema CLARO dá 1,08:1 — ela é praticamente invisível, porque
     * somar luz sobre uma página quase branca não tem para onde subir. Igualar
     * isso no escuro seria apagar a poeira. O alvo aqui é o oposto: ficar
     * acima do que o Raul viu e achou perdido (1,53:1) sem saturar. Com branco
     * a 0,34 dá 2,01:1, e o canal máximo da cena continua vindo do Memoji, não
     * da poeira — 13 pixels saturados na cena inteira.
     */
    poeira: '#ffffff',
    poeiraOpacidade: 0.34,

    /*
     * O halo deixa de ser lavado claro e vira brilho, que é o que o D-44
     * previu. A cor sobe para o roxo decorativo do escuro e o alfa cai: sobre
     * fundo preto um halo com o mesmo alfa lê como uma mancha, não como luz.
     */
    halo: ['rgba(191, 129, 255, 0.20)', 'rgba(191, 129, 255, 0.08)', 'rgba(191, 129, 255, 0)'],

    /*
     * A sombra de contato é o único item que NÃO inverte. Ela existe para
     * assentar o Memoji, e assentar é escurecer o que está embaixo; um brilho
     * no lugar dela faria o recorte flutuar de novo, que é o defeito que o D-18
     * consertou. Ela passa a ser quase preta com um toque da matiz — sobre o
     * halo, que é claro, ela continua tendo o que escurecer.
     */
    sombra: ['rgba(9, 5, 14, 0.55)', 'rgba(9, 5, 14, 0.22)', 'rgba(9, 5, 14, 0)'],

    /*
     * O globo é o item que se comporta ao contrário de todo o resto, e o D-56
     * já tinha previsto: "no tema escuro o oceano roxo escurece e os
     * continentes claros ganham contraste". O oceano NÃO recebe o roxo
     * decorativo do escuro — uma bola de `rgb(191,129,255)` ocupando meia tela
     * sobre uma página quase preta seria um farol. Ele escurece, e é a página
     * que se afasta dele.
     */
    oceano: '#754ba3',
    /*
     * Os continentes são a mesma textura, multiplicada. Deixá-la em branco
     * puro dá 16:1 contra a página — massa branca gritando no escuro. O
     * multiplicador baixa para o mesmo lugar em que a massa fica clara sem
     * virar lâmpada, e o par continente/oceano mantém a leitura do D-56.
     */
    continentes: '#e6e0ee',
    /* segue valendo o roxo do oceano: aqui a cor não muda, só deixou de ser
       lida de `oceano` para o claro poder inverter sem levar o halo junto */
    atmosfera: '#754ba3',
    /*
     * `AdditiveBlending` sobre fundo escuro: a atmosfera cai, não sobe.
     * D-65 (d) — 0,07 para 0,05, acompanhando o raio menor. Aqui ela de fato
     * clareia (medido: +0,0031 de luminância sobre o fundo), então o aro era
     * muito menos visível que no claro — mas é o mesmo objeto e o mesmo degrau.
     */
    atmosferaOpacidade: 0.05,
    /*
     * ⚠ **O comentário que estava aqui dizia que "o pin continua ESCURO nos
     * dois temas", e ele estava meio certo — que é pior que errado inteiro.**
     *
     * O raciocínio era: o pin pousa sobre o continente, que é claro, logo tem
     * de ser escuro. Isso vale para o **pé**, que de fato pisa na terra. Não
     * vale para a **haste** e a **cabeça**: elas sobem pela normal e são vistas
     * contra o **oceano** e contra o fundo da página, nunca contra a terra. Com
     * uma cor só, a cabeça roxa caía sobre o oceano roxo — roxo sobre roxo, que
     * foi exatamente o que o Raul viu na tela.
     *
     * O D-60 já tinha escrito a regra certa; ela só nunca chegou ao código,
     * porque a decisão não estava no PRD quando a frente 2 foi executada.
     */
    pinNaSuperficie: '#5a0d91',
    /* branca contra o oceano roxo (6,38:1) e contra a página (18,48:1) */
    pinAcimaDaSuperficie: '#ffffff',
    anelEscuro: '#5a0d91',
    anelClaro: '#f4f1f8',
  },
}
