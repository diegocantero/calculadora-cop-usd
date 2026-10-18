#!/usr/bin/env node

/**
 * TRM (Tasa Representativa del Mercado) fetching script.
 * Primary source: Superfinanciera SOAP WebService.
 * Fallback source: datos.gov.co open data API.
 * Never fails with non-zero exit code; preserves existing trm.json on complete failure.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { XMLParser } from 'fast-xml-parser';

const SOAP_ENDPOINT = 'https://www.superfinanciera.gov.co/SuperfinancieraWebServiceTRM/TCRMServicesWebService/TCRMServicesWebService';
const DATOS_GOV_CO_ENDPOINT = 'https://www.datos.gov.co/resource/32sa-8pi3.json?$limit=1&$order=vigenciadesde%20DESC';
const TIMEOUT_MS = 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const trmFilePath = path.join(projectRoot, 'public', 'trm.json');

/**
 * Returns today's date formatted as YYYY-MM-DD in the America/Bogota timezone.
 * @param {Date} [date=new Date()]
 * @returns {string}
 */
export function getBogotaDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  const day = parts.find((p) => p.type === 'day')?.value;
  return `${year}-${month}-${day}`;
}

/**
 * Builds the SOAP 1.1 envelope for queryTCRM.
 * @param {string} dateString - YYYY-MM-DD
 * @returns {string}
 */
export function buildSoapEnvelope(dateString) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:act="http://action.trm.services.generic.action.superfinanciera.nexura.sc.com.co/">
  <soapenv:Header/>
  <soapenv:Body>
    <act:queryTCRM>
      <tcrmQueryAssociatedDate>${dateString}</tcrmQueryAssociatedDate>
    </act:queryTCRM>
  </soapenv:Body>
</soapenv:Envelope>`;
}

/**
 * Parses the Superfinanciera SOAP XML response.
 * @param {string} xmlText
 * @returns {{ valor: number, vigenteDesde: string, vigenteHasta: string, fuente: string, actualizado: string }}
 */
export function parseSoapResponse(xmlText) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    removeNSPrefix: true,
    parseTagValue: false,
  });

  const parsed = parser.parse(xmlText);
  const body = parsed?.Envelope?.Body;
  if (!body) {
    throw new Error('SOAP response body missing');
  }

  const queryResponse = body.queryTCRMResponse;
  if (!queryResponse) {
    throw new Error('queryTCRMResponse element missing');
  }

  const returnData = queryResponse.return;
  if (!returnData) {
    throw new Error('return element missing in SOAP response');
  }

  const isSuccess = returnData.success === true || returnData.success === 'true';
  if (!isSuccess) {
    throw new Error(`Superfinanciera query unsuccessful: ${returnData.message || 'unknown error'}`);
  }

  const valor = parseFloat(returnData.value);
  if (isNaN(valor) || valor <= 0) {
    throw new Error(`Invalid TRM value parsed: ${returnData.value}`);
  }

  const vigenteDesde = returnData.validityFrom ? String(returnData.validityFrom).slice(0, 10) : '';
  const vigenteHasta = returnData.validityTo ? String(returnData.validityTo).slice(0, 10) : '';

  return {
    valor: Math.round(valor * 100) / 100,
    vigenteDesde,
    vigenteHasta,
    fuente: 'Superintendencia Financiera (SOAP)',
    actualizado: new Date().toISOString(),
  };
}

/**
 * Fetches TRM from the Superfinanciera SOAP WebService.
 * @param {string} dateString - YYYY-MM-DD
 * @returns {Promise<{ valor: number, vigenteDesde: string, vigenteHasta: string, fuente: string, actualizado: string }>}
 */
async function fetchFromSuperfinanciera(dateString) {
  const envelope = buildSoapEnvelope(dateString);

  const response = await fetch(SOAP_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml;charset=UTF-8',
      'SOAPAction': '',
    },
    body: envelope,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} from Superfinanciera SOAP endpoint`);
  }

  const xmlText = await response.text();
  return parseSoapResponse(xmlText);
}

/**
 * Fetches TRM from datos.gov.co as fallback.
 * @returns {Promise<{ valor: number, vigenteDesde: string, vigenteHasta: string, fuente: string, actualizado: string }>}
 */
async function fetchFromDatosGovCo() {
  const response = await fetch(DATOS_GOV_CO_ENDPOINT, {
    headers: {
      'Accept': 'application/json',
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} from datos.gov.co`);
  }

  const rows = await response.json();
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('Empty response array from datos.gov.co');
  }

  const record = rows[0];
  const valor = parseFloat(record.valor);
  if (isNaN(valor) || valor <= 0) {
    throw new Error(`Invalid TRM value in datos.gov.co: ${record.valor}`);
  }

  const vigenteDesde = record.vigenciadesde ? String(record.vigenciadesde).slice(0, 10) : '';
  const vigenteHasta = record.vigenciahasta ? String(record.vigenciahasta).slice(0, 10) : '';

  return {
    valor: Math.round(valor * 100) / 100,
    vigenteDesde,
    vigenteHasta,
    fuente: 'Superintendencia Financiera (datos.gov.co)',
    actualizado: new Date().toISOString(),
  };
}

/**
 * Main execution.
 */
async function main() {
  const todayBogota = getBogotaDate();
  console.log(`[TRM] Fetching TRM for date: ${todayBogota} (America/Bogota)`);

  let trmData = null;

  try {
    console.log('[TRM] Attempting fetch from Superfinanciera SOAP WebService...');
    trmData = await fetchFromSuperfinanciera(todayBogota);
    console.log(`[TRM] Successfully fetched from SOAP: ${trmData.valor} COP/USD`);
  } catch (soapError) {
    console.warn(`[TRM] Superfinanciera SOAP failed: ${soapError.message}`);
    console.log('[TRM] Falling back to datos.gov.co dataset API...');

    try {
      trmData = await fetchFromDatosGovCo();
      console.log(`[TRM] Successfully fetched from datos.gov.co: ${trmData.valor} COP/USD`);
    } catch (fallbackError) {
      console.warn(`[TRM] Fallback to datos.gov.co failed: ${fallbackError.message}`);
    }
  }

  if (!trmData) {
    console.warn('[TRM] Both primary and fallback sources failed. Keeping existing trm.json without changes.');
    process.exit(0);
  }

  try {
    await fs.writeFile(trmFilePath, JSON.stringify(trmData, null, 2) + '\n', 'utf8');
    console.log(`[TRM] Successfully updated ${trmFilePath}`);
  } catch (writeError) {
    console.error(`[TRM] Failed to write trm.json: ${writeError.message}`);
  }

  process.exit(0);
}

// Run main only when invoked directly from CLI
const isDirectExecution = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isDirectExecution) {
  main().catch((err) => {
    console.error(`[TRM] Unexpected error: ${err.message}`);
    process.exit(0);
  });
}
