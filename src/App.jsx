import TopBar from './components/TopBar';
import Calculator from './components/Calculator';
import AdvancedSettings from './components/AdvancedSettings';
import DetailTabs from './components/DetailTabs';
import MoreInfo from './components/MoreInfo';
import Footer from './components/Footer';
import { useCalculator } from './hooks/useCalculator';
import { textos } from './content/textos';

export default function App() {
  const {
    direction,
    setDirection,
    amount,
    setAmount,
    paidVacation,
    setPaidVacation,
    vacationDays,
    setVacationDays,
    isIntegral,
    setIsIntegral,
    trm,
    setTrm,
    trmInfo,
    exchangeCostPct,
    setExchangeCostPct,
    uvt,
    setUvt,
    compareAfterWithholding,
    setCompareAfterWithholding,
    result,
    resetDefaults,
    defaults,
  } = useCalculator();

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-body">
      <TopBar />

      <main className="hero-mesh flex-1">
        <div className="mx-auto max-w-6xl space-y-4 px-4 pb-5 pt-4 sm:px-6 sm:pt-5">
          {/* Compact hero */}
          <div>
            <h1 className="text-balance text-xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl">
              {textos.hero.title}
            </h1>
            <p className="mt-1 max-w-3xl text-pretty text-sm leading-snug text-muted sm:text-base">
              <span className="font-semibold text-ink">{textos.hero.question}</span>{' '}
              {textos.hero.subtitle}
            </p>
          </div>

          {/* Dashboard: inputs (left) + sticky result (right) */}
          <Calculator
            direction={direction}
            setDirection={setDirection}
            amount={amount}
            setAmount={setAmount}
            paidVacation={paidVacation}
            setPaidVacation={setPaidVacation}
            vacationDays={vacationDays}
            setVacationDays={setVacationDays}
            result={result}
            trm={trm}
          >
            <AdvancedSettings
              trm={trm}
              setTrm={setTrm}
              exchangeCostPct={exchangeCostPct}
              setExchangeCostPct={setExchangeCostPct}
              uvt={uvt}
              setUvt={setUvt}
              isIntegral={isIntegral}
              setIsIntegral={setIsIntegral}
              resetDefaults={resetDefaults}
              defaults={defaults}
            />
          </Calculator>

          {/* Tabbed detail: comparison / withholding & taxes / tax relief */}
          <DetailTabs
            result={result}
            isIntegral={isIntegral}
            trm={trm}
            paidVacation={paidVacation}
            vacationDays={vacationDays}
            uvt={uvt}
            compareAfterWithholding={compareAfterWithholding}
            setCompareAfterWithholding={setCompareAfterWithholding}
          />

          {/* Tabbed extra info: how it works / FAQ / sources */}
          <MoreInfo trm={trm} trmInfo={trmInfo} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
