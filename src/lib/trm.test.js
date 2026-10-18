import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getTRM } from './trm.js';
import { TRM_DEFAULT } from '../config.js';
import {
  getBogotaDate,
  buildSoapEnvelope,
  parseSoapResponse,
} from '../../scripts/fetch-trm.mjs';

describe('trm.js - getTRM()', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('returns valid TRM data when response is recent and valid', async () => {
    const today = new Date().toISOString().slice(0, 10);
    const mockData = {
      valor: 4250.75,
      vigenteDesde: today,
      vigenteHasta: today,
      fuente: 'Superintendencia Financiera (SOAP)',
      actualizado: new Date().toISOString(),
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await getTRM();

    expect(result.valor).toBe(4250.75);
    expect(result.vigenteDesde).toBe(today);
    expect(result.fuente).toBe('Superintendencia Financiera (SOAP)');
    expect(result.desactualizada).toBe(false);
  });

  it('marks desactualizada = true when data is older than 5 days', async () => {
    const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const mockData = {
      valor: 4100.0,
      vigenteDesde: sixDaysAgo,
      vigenteHasta: sixDaysAgo,
      fuente: 'Superintendencia Financiera (SOAP)',
      actualizado: `${sixDaysAgo}T12:00:00Z`,
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await getTRM();

    expect(result.valor).toBe(4100.0);
    expect(result.desactualizada).toBe(true);
  });

  it('falls back to default TRM when fetch fails with HTTP error', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    const result = await getTRM();

    expect(result.valor).toBe(TRM_DEFAULT.value);
    expect(result.desactualizada).toBe(true);
  });

  it('falls back to default TRM when fetch throws network error', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network down'));

    const result = await getTRM();

    expect(result.valor).toBe(TRM_DEFAULT.value);
    expect(result.desactualizada).toBe(true);
  });

  it('falls back to default TRM when valor in payload is invalid or zero', async () => {
    const today = new Date().toISOString().slice(0, 10);
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ valor: 'invalid-number', vigenteDesde: today }),
    });

    const result = await getTRM();

    expect(result.valor).toBe(TRM_DEFAULT.value);
  });
});

describe('fetch-trm.mjs pure helpers', () => {
  it('formats Bogota date as YYYY-MM-DD', () => {
    const testDate = new Date('2026-10-18T15:00:00Z');
    const bogotaDate = getBogotaDate(testDate);
    expect(bogotaDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(bogotaDate).toBe('2026-10-18');
  });

  it('builds valid SOAP envelope containing query date', () => {
    const envelope = buildSoapEnvelope('2026-10-18');
    expect(envelope).toContain('<tcrmQueryAssociatedDate>2026-10-18</tcrmQueryAssociatedDate>');
    expect(envelope).toContain('soapenv:Envelope');
    expect(envelope).toContain('queryTCRM');
  });

  it('parses valid Superfinanciera SOAP XML response', () => {
    const sampleXml = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Body>
    <ns2:queryTCRMResponse xmlns:ns2="http://action.trm.services.generic.action.superfinanciera.nexura.sc.com.co/">
      <return>
        <id>10543</id>
        <unit>COP</unit>
        <validityFrom>2026-10-18T00:00:00-05:00</validityFrom>
        <validityTo>2026-10-18T00:00:00-05:00</validityTo>
        <value>4380.50</value>
        <success>true</success>
      </return>
    </ns2:queryTCRMResponse>
  </soapenv:Body>
</soapenv:Envelope>`;

    const parsed = parseSoapResponse(sampleXml);
    expect(parsed.valor).toBe(4380.5);
    expect(parsed.vigenteDesde).toBe('2026-10-18');
    expect(parsed.vigenteHasta).toBe('2026-10-18');
    expect(parsed.fuente).toBe('Superintendencia Financiera (SOAP)');
    expect(parsed.actualizado).toBeDefined();
  });

  it('throws error when SOAP response indicates failure', () => {
    const failureXml = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Body>
    <queryTCRMResponse>
      <return>
        <success>false</success>
        <message>Date not found</message>
      </return>
    </queryTCRMResponse>
  </soapenv:Body>
</soapenv:Envelope>`;

    expect(() => parseSoapResponse(failureXml)).toThrow('Superfinanciera query unsuccessful');
  });
});
