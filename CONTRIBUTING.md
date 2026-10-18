# Contributing to Calculadora COP ↔ USD

Thank you for your interest in contributing to **Calculadora COP ↔ USD**! This project aims to provide transparent, accurate, and up-to-date salary equivalence comparisons for remote workers, freelancers, and independent contractors in Colombia.

---

## Code of Conduct

Please be respectful, constructive, and collaborative in all issues, discussions, and pull requests.

---

## Reporting Outdated Values

Fiscal parameters change annually (or daily in the case of the TRM). If you notice an outdated constant (such as the UVT, SMMLV, statutory transportation allowance, or social security contribution caps):

1. Check existing open issues to avoid duplicates.
2. Open an issue using the [Outdated Value Issue Template](.github/ISSUE_TEMPLATE/outdated-value.yml).
3. **Mandatory**: Include the official citation, decree number, or resolution link (e.g., official DIAN resolution or Ministry of Labor decree).

---

## Making Changes to `config.js`

Parameters affecting calculations are centralized in `src/lib/config.js`.

Any Pull Request that modifies constants in `src/lib/config.js` **must** adhere to the following rules:
- **Cite Official Sources**: Provide direct URLs to official government portals (DIAN, Superintendencia Financiera, Ministerio del Trabajo, or Diario Oficial).
- **Update Tests**: Update or add unit tests in the test suite to reflect the new parameters and ensure no regressions occur.
- **Maintain Precision**: Retain exact mathematical formulas and rate definitions.

---

## Development Workflow

1. **Fork and clone** the repository:
   ```bash
   git clone https://github.com/<your-username>/calculadora-cop-usd.git
   cd calculadora-cop-usd
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a topic branch**:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-fix-name
   ```

4. **Run the local dev server**:
   ```bash
   npm run dev
   ```

5. **Run tests and linter**:
   Ensure all tests pass and no linting issues exist before submitting:
   ```bash
   npm test
   npm run lint
   ```

---

## Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` Introduces a new feature or calculation option.
- `fix:` Fixes a bug or updates an incorrect rate/formula.
- `docs:` Documentation changes only (e.g., README, comments).
- `test:` Adding or refactoring tests.
- `refactor:` Code changes that neither fix a bug nor add a feature.
- `chore:` Maintenance tasks, dependency updates, or configuration adjustments.

**Examples**:
- `fix(config): update 2026 UVT value per DIAN resolution`
- `feat(ui): add tooltips explaining IBC social security caps`
- `docs: update deployment guidelines in README`

---

## Submitting a Pull Request

1. Push your branch to GitHub.
2. Open a Pull Request against the `main` branch.
3. Describe the problem your PR solves or the enhancement it introduces.
4. If modifying financial/tax constants, include the official source links in the PR description.
5. Ensure CI checks pass.

Thank you for helping keep this tool accurate and useful for the Colombian tech and remote work community!
