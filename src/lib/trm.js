import { TRM_DEFAULT } from '../config.js';

const FALLBACK_TRM = TRM_DEFAULT?.value ?? 4000;
const MAX_AGE_DAYS = 5;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Determines if a given date string represents a timestamp older than 5 days.
 * @param {string} [dateString]
 * @returns {boolean}
 */
function isDateOutdated(dateString) {
  if (!dateString) return true;
  const parsed = new Date(dateString);
  if (isNaN(parsed.getTime())) return true;
  const now = new Date();
  const diffDays = (now.getTime() - parsed.getTime()) / MS_PER_DAY;
  return diffDays > MAX_AGE_DAYS;
}

/**
 * Fetches TRM data from public/trm.json relative to the app base URL.
 * Falls back to default config TRM (4000) when unavailable or corrupted.
 * Marks desactualizada = true if older than 5 days or if fetch fails.
 *
 * @returns {Promise<{ valor: number, vigenteDesde: string, fuente: string, desactualizada: boolean }>}
 */
export async function getTRM() {
  const defaultResult = {
    valor: FALLBACK_TRM,
    vigenteDesde: new Date().toISOString().slice(0, 10),
    fuente: 'Configuración predeterminada',
    desactualizada: true,
  };

  try {
    const baseUrl = import.meta.env?.BASE_URL || '/';
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const url = `${normalizedBase}trm.json`;

    const response = await fetch(url);
    if (!response.ok) {
      return defaultResult;
    }

    const data = await response.json();
    const rawVal = Number(data?.valor);
    const valor = !isNaN(rawVal) && rawVal > 0 ? rawVal : FALLBACK_TRM;
    const vigenteDesde = data?.vigenteDesde ? String(data.vigenteDesde) : defaultResult.vigenteDesde;
    const fuente = data?.fuente ? String(data.fuente) : defaultResult.fuente;

    const referenceDate = data?.vigenteHasta || data?.vigenteDesde || data?.actualizado;
    const desactualizada = isDateOutdated(referenceDate);

    return {
      valor,
      vigenteDesde,
      fuente,
      desactualizada,
    };
  } catch {
    return defaultResult;
  }
}
