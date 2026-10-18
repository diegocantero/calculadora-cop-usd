import TopBar from './components/TopBar';
import Calculator from './components/Calculator';
import AdvancedSettings from './components/AdvancedSettings';
import ComparisonCards from './components/ComparisonCards';
import WithholdingSection from './components/WithholdingSection';
import TaxAlert from './components/TaxAlert';
import HowItWorks from './components/HowItWorks';
import TaxRelief from './components/TaxRelief';
import FAQ from './components/FAQ';
import Sources from './components/Sources';
import Footer from './components/Footer';
import { useCalculator } from './hooks/useCalculator';

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
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* 1. Sticky Navigation TopBar */}
      <TopBar />

      <main className="flex-1">
        {/* 2. Hero & Main Interactive Calculator */}
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
        />

        {/* Advanced Settings (collapsible, placed below the calculator) */}
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

        {/* 3. Comparison Cards (Empleado vs Independiente) */}
        <ComparisonCards
          result={result}
          isIntegral={isIntegral}
          trm={trm}
        />

        {/* 4. Withholding & Tax Provisioning Section */}
        <WithholdingSection
          result={result}
          compareAfterWithholding={compareAfterWithholding}
          setCompareAfterWithholding={setCompareAfterWithholding}
        />

        {/* 5. Conditional DIAN Tax Alert Banner (>= 1,400 UVT) */}
        <TaxAlert result={result} uvt={uvt} />

        {/* 6. How It Works (3 Steps) */}
        <HowItWorks />

        {/* 7. Tax Relief Accordion & Statutory Limits */}
        <TaxRelief />

        {/* 8. Frequently Asked Questions (FAQ) */}
        <FAQ />

        {/* 9. Official Data Sources & Parameter Validity */}
        <Sources trm={trm} />
      </main>

      {/* 10. Comprehensive Footer */}
      <Footer />
    </div>
  );
}
