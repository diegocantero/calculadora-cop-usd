import { useState } from 'react';
import { textos } from '../content/textos';
import Tabs, { useHashTabs } from './Tabs';
import HowItWorks from './HowItWorks';
import FAQ from './FAQ';
import Sources from './Sources';

const HASH_TO_TAB = {
  'mas-info': 'como-funciona',
  'como-funciona': 'como-funciona',
  faq: 'faq',
  fuentes: 'fuentes',
};

export default function MoreInfo({ trm, trmInfo }) {
  const [active, setActive] = useState('como-funciona');
  useHashTabs(HASH_TO_TAB, setActive);
  const t = textos.masInfo;

  const tabs = [
    { id: 'como-funciona', label: t.tabs.comoFunciona },
    { id: 'faq', label: t.tabs.faq },
    { id: 'fuentes', label: t.tabs.fuentes },
  ];

  const panels = {
    'como-funciona': <HowItWorks />,
    faq: <FAQ />,
    fuentes: <Sources trm={trm} trmInfo={trmInfo} />,
  };

  return (
    <section id="mas-info" className="card rounded-2xl p-3 sm:p-4" aria-label={t.title}>
      <Tabs tabs={tabs} active={active} onChange={setActive} ariaLabel={t.ariaLabel} panels={panels} />
    </section>
  );
}
