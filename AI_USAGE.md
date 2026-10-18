# AI Usage

This project was built with AI assistance. This file explains where and how, so users and contributors know what to trust and what to verify.

## What AI was used for

- Writing and refactoring code (React components, calculation logic, tests, build/CI scripts).
- Drafting documentation and user-facing Spanish copy.
- UI/UX design iterations (layout, color palette, accessibility checks).

Tools: Claude (Anthropic) via Claude Code, and Gemini (Google) for some infra and content tasks. The agent roles are described in [AGENTS.md](AGENTS.md).

## What AI did NOT decide

- **Tax and labor parameters** (UVT, SMMLV, withholding table, thresholds) are never invented by AI. They live in [`src/config.js`](src/config.js) with their source, and must be checked against official portals (DIAN, Superfinanciera).
- **The TRM** is fetched by a script from the Superintendencia Financiera (`scripts/fetch-trm.mjs`), not generated.
- **Direction and product decisions** (scope, license, what ships) are made by the maintainer, Diego Cantero.

## Human review and verification

- All changes are reviewed by the maintainer before release.
- Calculation logic is covered by automated tests (`npm test`).
- AI output can be wrong. Tax rules change and AI can misstate them, so any figure should be confirmed with official sources.

## Limits for users

The calculator gives **estimated, approximate values** for reference. It is not tax, accounting, financial, or legal advice, and it does not replace your payroll slip or tax return. Consult a certified public accountant (contador público) before making decisions.

## Contributing with AI

AI-assisted contributions are welcome under the same rules as any other contribution (see [CONTRIBUTING.md](CONTRIBUTING.md)):

1. You are responsible for what you submit: read, run, and understand it.
2. Cite the official source for any tax or legal value you add or change.
3. Do not paste personal or confidential data into AI tools.
4. Mention significant AI assistance in the PR description.

## Reporting problems

Found a wrong value or a misleading statement? Open an issue using the *outdated value* template and include the official source.
