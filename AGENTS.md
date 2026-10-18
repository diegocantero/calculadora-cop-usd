# AGENTS.md — Agent Coordination Contract

## Team

| Agent | Model | Responsibility | Files | Branch |
|-------|-------|---------------|-------|--------|
| A0 Orchestrator | Claude Opus | Repo setup, contracts, integration, final review | Root, AGENTS.md, src/main.jsx, src/App.jsx | main |
| A1 Logic | Claude Opus | config.js, calc.js, retencion.js and tests | src/lib/, src/config.js, tests/ | feat/logica |
| A2 UI | Claude Sonnet | Landing page, React components, accessibility | src/components/, src/styles/, index.html | feat/ui |
| A3 Infra | Gemini Pro | TRM fetch, workflows, vite config, GitHub Pages | scripts/, .github/, public/trm.json, vite.config.js, src/lib/trm.js | feat/infra |
| A4 Content | Gemini Flash | README, CONTRIBUTING, LICENSE, textos.js, FAQ, QA | src/content/, docs/, README.md, CONTRIBUTING.md, .github/ISSUE_TEMPLATE/ | feat/docs |

## Module Contracts

### `src/lib/calc.js`

```js
/**
 * Main calculation function.
 * @param {Object} params
 * @param {'cop-to-usd'|'usd-to-cop'} params.modo - Conversion direction
 * @param {number} params.monto - Salary in COP or rate in USD
 * @param {boolean} params.vacacionesPagas - Whether remote contract includes paid vacation
 * @param {number} [params.diasVacaciones=15] - Vacation days (when not paid)
 * @param {boolean} params.despuesDeRetencion - Compare after withholding
 * @param {number} params.trm - Exchange rate COP/USD
 * @param {number} params.costoCambio - Exchange cost fraction (e.g. 0.03)
 * @param {boolean} params.integral - Whether salary is "integral" (>= 13 SMMLV)
 * @returns {Object} Calculation result
 */
export function calcular({
  modo, monto, vacacionesPagas, diasVacaciones = 15,
  despuesDeRetencion, trm, costoCambio, integral
}) {
  return {
    equivalenteCOP: Number,   // Equivalent monthly charge in COP
    equivalenteUSD: Number,   // Equivalent monthly charge in USD
    factor: Number,           // Multiplier (e.g. 1.28)
    empleado: {
      salarioMensual: Number,
      ingresoAnual: Number,
      aportesMensuales: Number,
    },
    independiente: {
      cobroMensualCOP: Number,
      cobroMensualUSD: Number,
      ingresoAnual: Number,
      seguridadSocialMensual: Number,
      costosCambioMensual: Number,
    },
    retencionEmpleado: Number,        // Monthly withholding
    provisionIndependiente: Number,   // Monthly provision
    obligadoADeclarar: Boolean,       // Whether must file tax return
  };
}
```

### `src/lib/trm.js`

```js
/**
 * Fetches TRM data from public/trm.json.
 * @returns {Promise<{valor: number, vigenteDesde: string, fuente: string, desactualizada: boolean}>}
 */
export async function getTRM() { }
```

### `src/content/textos.js`

```js
/**
 * All user-facing text content in Spanish.
 * UI components import from here — never hardcode Spanish text in components.
 */
export const textos = { /* structured object with all sections */ };
```

## Rules

1. Read SPEC.md before writing code; if something is undefined, ask the orchestrator.
2. Do NOT touch files owned by another agent.
3. Small commits with conventional messages (feat:, fix:, test:, docs:, ci:).
4. Every tax value lives in `src/config.js` — never hardcode in other files.
5. Save progress to Engram after each task and before any pause.
