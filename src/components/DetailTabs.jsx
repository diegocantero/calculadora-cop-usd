import { useState } from 'react';
import { textos } from '../content/textos';
import Tabs, { useHashTabs } from './Tabs';
import ComparisonCards from './ComparisonCards';
import TaxRelief from './TaxRelief';

const HASH_TO_TAB = {
  detalle: 'comparacion',
  comparacion: 'comparacion',
  retencion: 'comparacion',
  alivios: 'alivios',
};

export default function DetailTabs({
  result,
  isIntegral,
  trm,
  paidVacation,
  vacationDays,
  uvt,
  compareAfterWithholding,
  setCompareAfterWithholding,
}) {
  const [active, setActive] = useState('comparacion');
  useHashTabs(HASH_TO_TAB, setActive);
  const t = textos.detalle;

  const tabs = [
    { id: 'comparacion', label: t.tabs.comparacion },
    { id: 'alivios', label: t.tabs.alivios },
  ];

  const panels = {
    comparacion: (
      <ComparisonCards
        result={result}
        isIntegral={isIntegral}
        trm={trm}
        paidVacation={paidVacation}
        vacationDays={vacationDays}
        uvt={uvt}
        compareAfterWithholding={compareAfterWithholding}
        setCompareAfterWithholding={setCompareAfterWithholding}
      />
    ),
    alivios: <TaxRelief />,
  };

  return (
    <section id="detalle" className="card rounded-2xl p-3 sm:p-4" aria-label={t.title}>
      <Tabs tabs={tabs} active={active} onChange={setActive} ariaLabel={t.ariaLabel} panels={panels} />
    </section>
  );
}
