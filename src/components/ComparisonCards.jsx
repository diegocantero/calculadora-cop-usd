import { textos } from '../content/textos';
import { formatCOP, formatUSD } from '../hooks/useCalculator';
import { AlertIcon, BriefcaseIcon, GlobeIcon } from './Icons';
import Switch from './Switch';
import TaxAlert from './TaxAlert';
import { mesesFacturables } from '../lib/calc';
import { AUXILIO_TRANSPORTE_2026, INTERESES_CESANTIAS, SMMLV_2026 } from '../config';

function Row({ label, hint, value, tone = 'default', strong = false }) {
  const toneClass = tone === 'ok' ? 'text-ok-text' : tone === 'muted' ? 'text-muted' : 'text-ink';
  return (
    <li className="flex items-start justify-between gap-3 py-1 text-[13px] leading-snug">
      <span className="text-body">
        {label}
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
      <span
        className={`shrink-0 text-right tabular-nums ${toneClass} ${strong ? 'font-bold' : 'font-semibold'}`}
      >
        {value}
      </span>
    </li>
  );
}

function Group({ tone, title, children }) {
  const isOk = tone === 'ok';
  return (
    <div className="mt-2.5">
      <div
        className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${
          isOk ? 'text-ok-text' : 'text-muted'
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${isOk ? 'bg-ok' : 'bg-line-strong'}`} />
        {title}
      </div>
      <ul className="mt-0.5 divide-y divide-line/70">{children}</ul>
    </div>
  );
}

function Footer({ netLabel, net, annualLabel, annual, percent, brand }) {
  return (
    <div className="mt-3 border-t border-line pt-3">
      <div className="flex items-center justify-between gap-3 text-[13px]">
        <span className="text-muted">{netLabel}</span>
        <span className="whitespace-nowrap font-bold tabular-nums text-ink">{net}</span>
      </div>
      <div
        className={`mt-2 rounded-lg px-3 py-2 ${brand ? 'bg-brand-soft' : 'bg-sunken'}`}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13px] font-semibold text-body">{annualLabel}</span>
          <span
            className={`whitespace-nowrap text-base font-extrabold tabular-nums ${brand ? 'text-brand-text' : 'text-ink'}`}
          >
            {annual}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-line/80" aria-hidden="true">
          <div
            className={`h-full rounded-full transition-all duration-500 ${brand ? 'bg-brand' : 'bg-muted'}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function ComparisonCards({
  result,
  isIntegral,
  trm,
  paidVacation,
  vacationDays,
  uvt,
  compareAfterWithholding,
  setCompareAfterWithholding,
}) {
  const { empleado, independiente, retencionEmpleado, provisionIndependiente } = result;
  const withTax = compareAfterWithholding;
  const netLabel = withTax ? textos.comparison.netoDespuesImpuestos : textos.comparison.netoDeBolsillo;
  const mesesLabel = mesesFacturables(paidVacation, vacationDays).toLocaleString('es-CO', {
    maximumFractionDigits: 1,
  });

  const empleadoSalario = empleado.salarioMensual || 0;
  const empleadoSalud = Math.round(empleado.aportesMensuales / 2);
  const empleadoPension = Math.round(empleado.aportesMensuales / 2);
  const empleadoPrimaMensual = isIntegral ? 0 : Math.round(empleadoSalario / 12);
  const empleadoCesantiasMensual = isIntegral ? 0 : Math.round(empleadoSalario / 12);
  const empleadoInteresesMensual = isIntegral ? 0 : Math.round((empleadoSalario * 0.12) / 12);
  // Annual prima + cesantías + intereses (0 for integral salary, which already compensates them).
  const prestacionesAnuales = isIntegral ? 0 : empleadoSalario * (2 + INTERESES_CESANTIAS.value);
  const empleadoNetoMensual = Math.max(
    0,
    empleadoSalario - empleado.aportesMensuales - (withTax ? retencionEmpleado : 0)
  );

  const independienteCobroCOP = independiente.cobroMensualCOP || 0;
  const independienteCobroUSD = independiente.cobroMensualUSD || 0;
  const independienteSeguridadSocial = independiente.seguridadSocialMensual || 0;
  const independienteCostoCambio = independiente.costosCambioMensual || 0;
  const independienteDeduccionesTotal = independienteSeguridadSocial + independienteCostoCambio;
  const independienteNetoMensual = Math.max(
    0,
    independienteCobroCOP - independienteDeduccionesTotal - (withTax ? provisionIndependiente : 0)
  );

  const maxAnnual = Math.max(empleado.ingresoAnual, independiente.ingresoAnual, 1);
  const empleadoPercent = Math.min(100, Math.round((empleado.ingresoAnual / maxAnnual) * 100));
  const independientePercent = Math.min(
    100,
    Math.round((independiente.ingresoAnual / maxAnnual) * 100)
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 rounded-xl bg-sunken px-3">
        <Switch
          id="withholding-switch"
          checked={compareAfterWithholding}
          onChange={setCompareAfterWithholding}
        >
          {textos.retencion.switch}
        </Switch>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {/* Empleado */}
      <div className="rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sunken text-body">
              <BriefcaseIcon className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-base font-bold leading-tight text-ink">
                {textos.comparison.empleado}
              </h3>
              <span className="block truncate text-xs text-muted">
                {textos.comparison.empleadoBadge}
              </span>
            </div>
          </div>
          <span className="shrink-0 whitespace-nowrap text-sm font-bold tabular-nums text-ink">
            {formatCOP(empleadoSalario)}
          </span>
        </div>

        <Group tone="ok" title={textos.comparison.loQueRecibes}>
          <Row label={textos.comparison.salarioMensual} value={`${formatCOP(empleadoSalario)}/mes`} tone="ok" />
          {isIntegral ? (
            <Row
              label={textos.comparison.integralPrestacional}
              hint={textos.comparison.integralPrestacionalHint}
              value={textos.comparison.integralIncluido}
              tone="ok"
            />
          ) : (
            <>
              <Row
                label={textos.comparison.prima}
                hint={textos.comparison.primaHint(formatCOP(empleadoPrimaMensual))}
                value={textos.comparison.valorAnual(formatCOP(empleadoSalario))}
                tone="ok"
              />
              <Row
                label={textos.comparison.cesantias}
                hint={textos.comparison.cesantiasHint(formatCOP(empleadoCesantiasMensual))}
                value={textos.comparison.valorAnual(formatCOP(empleadoSalario))}
                tone="ok"
              />
              <Row
                label={textos.comparison.interesesCesantias}
                hint={textos.comparison.interesesHint(formatCOP(empleadoInteresesMensual))}
                value={textos.comparison.valorAnual(formatCOP(empleadoSalario * 0.12))}
                tone="ok"
              />
              {empleadoSalario <= 2 * SMMLV_2026.value && (
                <Row
                  label={textos.comparison.auxilioTransporte}
                  hint={textos.comparison.auxilioHint}
                  value={textos.comparison.valorAnual(formatCOP(12 * AUXILIO_TRANSPORTE_2026.value))}
                  tone="ok"
                />
              )}
            </>
          )}
          <Row
            label={textos.comparison.vacacionesPagas}
            hint={textos.comparison.vacacionesEmpleadoHint}
            value={textos.comparison.vacacionesEmpleadoValor}
            tone="ok"
          />
        </Group>
        <p className="mt-2 text-xs leading-snug text-muted">{textos.comparison.incluyeEmpleado}</p>

        <Group title={textos.comparison.loQuePagas}>
          <Row label={textos.comparison.aportesSalud} value={`- ${formatCOP(empleadoSalud)}`} />
          <Row label={textos.comparison.aportesPension} value={`- ${formatCOP(empleadoPension)}`} />
          <Row
            label={<span className="font-semibold text-ink">Total descuentos obligatorios</span>}
            value={`- ${formatCOP(empleado.aportesMensuales)}`}
            strong
          />
          {withTax && (
            <Row
              label={textos.retencion.empleado}
              hint={
                retencionEmpleado === 0
                  ? textos.retencion.empleadoSinRetencion(formatCOP(95 * uvt))
                  : undefined
              }
              value={`- ≈ ${formatCOP(retencionEmpleado)}`}
            />
          )}
        </Group>

        <Footer
          netLabel={netLabel}
          net={formatCOP(empleadoNetoMensual)}
          annualLabel={textos.comparison.ingresoAnual}
          annual={formatCOP(empleado.ingresoAnual)}
          percent={empleadoPercent}
        />
      </div>

      {/* Independiente */}
      <div className="rounded-2xl border border-brand-line bg-surface p-4 ring-1 ring-brand/20">
        <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="icon-tile h-9 w-9">
              <GlobeIcon className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-base font-bold leading-tight text-ink">
                {textos.comparison.independiente}
              </h3>
              <span className="block truncate text-xs text-muted">
                {textos.comparison.independienteBadge}
              </span>
            </div>
          </div>
          <span className="shrink-0 whitespace-nowrap text-sm font-bold tabular-nums text-brand-text">
            {formatUSD(independienteCobroUSD)}
          </span>
        </div>

        <Group tone="ok" title={textos.comparison.loQueRecibes}>
          <Row
            label={`${textos.comparison.cobroMensual} (USD)`}
            value={formatUSD(independienteCobroUSD)}
            tone="ok"
          />
          <Row
            label={`Conversión en COP (TRM ${formatCOP(trm)})`}
            value={formatCOP(independienteCobroCOP)}
            tone="ok"
          />
          <Row
            label={textos.comparison.prestacionesIndependiente}
            hint={textos.comparison.prestacionesIndependienteHint(formatCOP(prestacionesAnuales))}
            value={textos.comparison.prestacionesIndependienteValor}
            tone="muted"
          />
          <Row
            label={textos.comparison.vacacionesIndependiente}
            hint={
              paidVacation
                ? textos.comparison.vacacionesIncluidasHint
                : textos.comparison.vacacionesNoIncluidasHint(vacationDays)
            }
            value={
              paidVacation
                ? textos.comparison.vacacionesIncluidasValor
                : textos.comparison.vacacionesNoIncluidasValor(mesesLabel)
            }
            tone={paidVacation ? 'ok' : 'muted'}
          />
          <Row
            label="Factor de compensación"
            value={`${result.factor.toLocaleString('es-CO')}x`}
            tone="ok"
          />
        </Group>

        <Group title={textos.comparison.loQuePagas}>
          <Row
            label={textos.comparison.seguridadSocial}
            hint="Pensión 16% + Salud 12.5% + ARL s/ 40% IBC"
            value={`- ${formatCOP(independienteSeguridadSocial)}`}
          />
          <Row
            label={textos.comparison.costoCambio}
            hint="Spread bancario / plataformas"
            value={`- ${formatCOP(independienteCostoCambio)}`}
          />
          <Row
            label={<span className="font-semibold text-ink">Total deducciones mensuales</span>}
            value={`- ${formatCOP(independienteDeduccionesTotal)}`}
            strong
          />
          {withTax && (
            <Row
              label={textos.retencion.provisionIndependiente}
              hint={
                provisionIndependiente === 0
                  ? textos.retencion.independienteSinProvision
                  : textos.retencion.independiente
              }
              value={`- ≈ ${formatCOP(provisionIndependiente)}`}
            />
          )}
        </Group>
        <p className="mt-2 text-xs leading-snug text-muted">{textos.comparison.incluyeIndependiente}</p>

        <Footer
          netLabel={netLabel}
          net={formatCOP(independienteNetoMensual)}
          annualLabel={textos.comparison.ingresoAnual}
          annual={formatCOP(independiente.ingresoAnual)}
          percent={independientePercent}
          brand
        />
      </div>
      </div>

      <TaxAlert result={result} uvt={uvt} />

      {withTax && (
        <div
          role="note"
          className="anim-in flex items-start gap-2.5 rounded-xl border border-warn-line bg-warn-soft p-3 text-[13px] leading-snug text-body"
        >
          <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-warn-text" />
          <p>
            <strong className="text-warn-text">{textos.retencion.disclaimerTitulo}:</strong>{' '}
            {textos.retencion.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
}
