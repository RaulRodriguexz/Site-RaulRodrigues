/**
 * Conteúdo aprovado em docs/CONTENT.md (03/09/2026), decisão D-14 do PRD:
 * três projetos na v1 — um em destaque, dois compactos.
 *
 * **D-21 (12/09): são QUATRO.** O quarto é o único trabalho pago do site;
 * os três primeiros são projetos pessoais.
 *
 * **D-81 (12/09) revisa o D-14: são DOIS em destaque e dois compactos.**
 * Com um destaque só, sobravam três compactos numa grade de duas colunas
 * e **um ficava sozinho na última linha** — e era o card pago. Com dois,
 * as linhas fecham: destaque, destaque, compacto + compacto. O órfão some
 * **por construção, não por ordem** — reordenar só trocava quem sobrava.
 *
 * O motivo do segundo destaque **não é geometria**: depois da D-78 o site
 * se apresenta como AI Solutions Engineer, então em destaque ficam os dois
 * trabalhos que provam que ele resolve problema de alguém — um público e
 * clicável, um pago. Ticket Triage e este site são credibilidade técnica.
 *
 * **D-90 (05/10): Titanic sai, Ticket Triage entra no mesmo slot compacto.**
 * O Titanic é o projeto-tutorial de Kaggle que todo iniciante tem; com um
 * projeto de AI engineering real (API + evals + guardrails) ele só puxava o
 * nível pra baixo. A troca mantém os 4 cards e o layout da D-81 intactos.
 *
 * **A ORDEM do array importa e faz parte da decisão.** Só ligar as duas
 * flags já mata o órfão, mas deixa as linhas em destaque / compacto +
 * compacto / destaque — e o trabalho pago continuaria sendo a última coisa
 * da seção. Com os dois destaques na frente sai o que a D-81 escreveu:
 * **destaque, destaque, compacto + compacto**.
 *
 * Regra: se você não consegue escrever `impact`, o projeto não entra no site.
 */

export type Project = {
  id: string
  title: string
  /** O problema na língua do cliente, não na do dev. */
  problem: string
  /** O que você construiu. Uma ou duas frases. */
  solution: string
  /** O resultado. Número sempre que possível. */
  impact: string
  stack: string[]
  repo?: string
  demo?: string
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: 'cover-letter-assistant',
    title: 'Cover Letter Assistant',
    problem:
      'Job seekers rewrite the same cover letter dozens of times and stop tailoring it to each company — which is exactly what makes an application land.',
    solution:
      'A live tool: a static front end talking to a Cloudflare Worker that prompts the OpenAI API. No server to maintain, no API key exposed in the browser.',
    impact:
      'Cuts a 30-minute writing task to under a minute, at effectively zero hosting cost.',
    stack: ['JavaScript', 'OpenAI API', 'Cloudflare Workers'],
    demo: 'https://raulrodriguexz.github.io/cover-letter-api',
    featured: true,
  },
  {
    /**
     * D-21 — o único card de trabalho PAGO do site, e por isso o mais
     * importante dos quatro: os outros três são projetos pessoais, e um
     * portfólio de AI Solutions Engineer sem prova de cliente mostra estudo,
     * não entrega.
     *
     * **Sem `repo` e sem `demo`, de propósito:** é código de cliente e não é
     * público. É o único card sem link, e o `ProjectCard` já omite o bloco
     * inteiro quando não há nenhum dos dois — não sobra rótulo vazio.
     */
    id: 'ai-automation-smbs',
    title: 'AI automation for four companies',
    problem:
      'Leads were sitting unanswered for up to two weeks. By the time anyone replied the enquiry had gone cold — the delay was costing the sale, not just the hours.',
    solution:
      'AI automation across the channels the leads actually arrive on — email, WhatsApp Business, a chatbot and the spreadsheets the team already lived in — so an enquiry gets picked up, sorted and routed without anyone watching an inbox.',
    impact:
      'Leads that used to wait up to two weeks are now picked up and routed automatically.',
    stack: ['Python', 'n8n', 'OpenAI API', 'WhatsApp Business'],
    featured: true,
  },
  {
    /**
     * D-90 — substitui o Titanic. Projeto pessoal de AI engineering, público e
     * clicável. Sem `demo` até o deploy da Vercel sair; o `ProjectCard` omite o
     * link que faltar.
     *
     * ⚠️ `impact` é PROVISÓRIO até a avaliação real (depende da ANTHROPIC_API_KEY,
     * prevista para 06/10). NÃO MERGEAR com este texto — preencher com o número
     * de `triagem avaliar --comparar` (acerto, custo/chamado, economia do router).
     */
    id: 'ticket-triage',
    title: 'Ticket Triage',
    problem:
      'Support teams repeat the same first pass on every ticket — read it, pick a category, judge how urgent it really is, draft a reply — thousands of times over.',
    solution:
      'A Python service (CLI + FastAPI) that does that first pass with one Claude call per ticket, returning validated JSON. A router sends easy tickets to a cheaper model; guardrails block invented refunds and ignore instructions hidden in a ticket.',
    impact:
      'PENDING real eval (06/10): priority accuracy, cost per ticket, and the router’s savings vs always-Sonnet.',
    stack: ['Python', 'FastAPI', 'Claude API', 'Pydantic'],
    repo: 'https://github.com/RaulRodriguexz/ticket-triage',
  },
  {
    id: 'this-site',
    title: 'This site',
    problem:
      'A PDF CV doesn’t prove someone can ship. A portfolio that is itself a working product does.',
    solution:
      'Built from a written product spec: React, React Three Fiber and Tailwind, with the 3D scene code-split so the content renders before the WebGL bundle loads.',
    impact:
      '138 KB over the wire on a phone: the 3D bundle never downloads there. Fully usable with WebGL switched off.',
    stack: ['React', 'TypeScript', 'React Three Fiber', 'Tailwind'],
    repo: 'https://github.com/RaulRodriguexz/portfolio-3d-v2',
  },
]
