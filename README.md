# Calculadora COP ↔ USD

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Deploy](https://github.com/diegocantero/calculadora-cop-usd/actions/workflows/deploy.yml/badge.svg)](https://github.com/diegocantero/calculadora-cop-usd/actions/workflows/deploy.yml)

A transparent Colombian salary converter between local employee compensation (COP) and international contractor fees (USD), accounting for statutory benefits, mandatory social security, currency exchange costs, and income tax withholdings.

---

## Screenshot

![Calculadora COP ↔ USD Screenshot](docs/screenshot.png)

*(UI preview — screenshot placeholder)*

---

## What It Does

When considering remote work contracts paid in foreign currencies (USD) versus traditional local employment in Colombia (COP), calculating equivalent pay is not a simple currency conversion. Traditional employment includes mandatory benefits (prima, cesantías, intereses de cesantías, vacaciones) and partial employer social security contributions, while foreign contractor compensation requires independent social security contributions (IBC 40% on health and pension), exchange rate fees, and proactive tax provisioning.

This application provides:
- **Bi-directional calculation**: Convert Colombian salary (COP) into equivalent foreign contractor billings (USD) or vice versa.
- **Benefits parity**: Automatically factor in mandatory 13th month salary (prima), severance (cesantías), severance interest (12%), paid leave, and transportation allowance (auxilio de transporte for up to 2 SMMLV).
- **Social security computation**: Model independent contractor contributions on a 40% IBC baseline (12.5% health + 16% pension) bounded by SMMLV and 25 SMMLV caps.
- **Currency exchange margins**: Configurable foreign exchange spread (defaults to 1.5% to reflect broker/platform fees like Wise, Payoneer, or local banks).
- **Withholding tax comparison**: Side-by-side comparison using Article 383 of the Colombian Tax Statute (Estatuto Tributario) with UVT bracket calculations, demonstrating what a local employer withholds versus what an independent contractor must set aside for their annual income tax filing.
- **Tax relief overview**: Summary table of allowable personal income tax deductions (dependents, mortgage interest, prepaid medicine, 25% exempt labor income) and the global statutory cap (40% net income / 1,340 UVT).

---

## Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/diegocantero/calculadora-cop-usd.git
cd calculadora-cop-usd
npm install
```

### Development

Run the Vite development server with HMR:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run Tests

Execute unit tests with Vitest:

```bash
npm test
```

### Build for Production

Compile optimized production assets:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Deployment to GitHub Pages

This project is structured for zero-configuration static site deployment on **GitHub Pages**.

1. Verify or set `base` path in `vite.config.js` to repository name if applicable (`/calculadora-cop-usd/` for project pages, or `/` for custom domain / root page).
2. Push your changes to the `main` branch.
3. The automated GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the app and publishes static assets to GitHub Pages.

---

## How to Update Values Each Year

Colombian fiscal parameters (SMMLV, UVT, auxilio de transporte) and exchange rate parameters are centralized in [`src/lib/config.js`](file:///c:/Users/dacan/Documents/Zerogrant/calculadora-cop-usd/src/lib/config.js).

When new values are decreed for the fiscal year:

1. Open `src/lib/config.js`.
2. Update the fiscal constants:
   - `UVT`: Official DIAN resolution value.
   - `SMMLV`: Minimum legal wage decreed by the Colombian government.
   - `AUX_TRANSPORTE`: Statutory transportation allowance.
   - `FALLBACK_TRM`: Current baseline reference TRM.
3. Add or update the official decree or resolution link in the configuration comments or metadata.
4. Run tests (`npm test`) to ensure all tax bracket and calculation tests pass or update expected values accordingly.
5. Commit and submit a PR citing the official government sources.

---

## Official Data Sources

All calculations and constants correspond strictly to Colombian legal frameworks and official government references:

- **Superintendencia Financiera de Colombia (SFC)**:
  Official daily exchange rate (Tasa Representativa del Mercado - TRM).
  [https://www.superfinanciera.gov.co/publicacion/60819](https://www.superfinanciera.gov.co/publicacion/60819)
- **Portal de Datos Abiertos de Colombia**:
  Historical TRM series and public financial datasets.
  [https://www.datos.gov.co/](https://www.datos.gov.co/)
- **Dirección de Impuestos y Aduanas Nacionales (DIAN)**:
  Tax value units (UVT), income tax declaration thresholds (1,400 UVT), and annual tax calendars.
  [https://www.dian.gov.co/](https://www.dian.gov.co/)
- **Estatuto Tributario Nacional**:
  - [Art. 206](https://estatuto.co/206): Exempt labor income.
  - [Art. 336](https://estatuto.co/336): General cedula income calculation and deduction limits (40% / 1,340 UVT).
  - [Art. 383](https://estatuto.co/383): Withholding tax rates and progressive brackets.
  - [Art. 387](https://estatuto.co/387): Deductions for dependents, mortgage interest, and health prepagada.
  - [Art. 592](https://estatuto.co/592): Thresholds exempting individuals from filing income tax declarations.

---

## Disclaimer

> **Important**: This is a reference calculation tool, not tax, financial, or legal advice. Colombian tax and labor situations depend on individual conditions, deductions, and regulatory changes. Always consult with a certified public accountant (contador público certificado) or legal advisor before making financial or contractual decisions.

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on reporting outdated rates, writing tests, and opening pull requests.

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Author

Created by [Diego Cantero](https://www.linkedin.com/in/diegocantero/) — [GitHub](https://github.com/diegocantero).
