import { SentinelData, SAMPLE_DATA } from '../data/sampleData';

const API_BASE = 'https://caren.lightslips.ai';

// Public endpoints — no API key needed for reads
const SENTINEL_LATEST_URL = `${API_BASE}/api/sentinel/latest`;
const SENTINEL_PRICES_URL = `${API_BASE}/api/sentinel/prices`;
const SENTINEL_HTML_URL = `${API_BASE}/sentinel`;

export interface PriceTimeSeries {
  dates: string[];
  brent: (number | null)[];
  gold: (number | null)[];
  rupee: (number | null)[];
  petrol: (number | null)[];
  diesel: (number | null)[];
  lpg: (number | null)[];
}

export async function fetchSentinelData(): Promise<SentinelData> {
  // Try API first (fastest, structured JSON)
  try {
    const response = await fetch(SENTINEL_LATEST_URL, {
      headers: { 'Accept': 'application/json' },
    });
    if (response.ok) {
      return await response.json() as SentinelData;
    }
  } catch (_) { /* fall through */ }

  // Fallback: parse HTML (legacy approach)
  try {
    const response = await fetch(SENTINEL_HTML_URL, {
      headers: { 'Accept': 'text/html' },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    const match = html.match(/var\s+D\s*=\s*(\{[\s\S]*?\});\s*\n/);
    if (!match) throw new Error('Could not find data in HTML');
    return JSON.parse(match[1]) as SentinelData;
  } catch (_) { /* fall through */ }

  // Final fallback: bundled sample data
  console.warn('Using bundled sample data');
  return SAMPLE_DATA;
}

export async function fetchPriceHistory(): Promise<PriceTimeSeries> {
  try {
    const response = await fetch(SENTINEL_PRICES_URL, {
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json() as PriceTimeSeries;
  } catch (error) {
    console.warn('Failed to fetch price history:', error);
    // Return empty series — charts will show "no data"
    return { dates: [], brent: [], gold: [], rupee: [], petrol: [], diesel: [], lpg: [] };
  }
}

export function computeMorningNumber(data: SentinelData): number {
  const petrolDelta = 8.19;
  const dieselDelta = 8.49;
  const avgDailyPetrolL = 3;
  const avgDailyDieselL = 0;
  const lpgMonthlyExtra = (data.energy.lpg.official_price - 803) / 30;
  const foodInflationDaily = (data.prices.food_inflation / 100) * 500;

  const daily = (petrolDelta * avgDailyPetrolL) +
                (dieselDelta * avgDailyDieselL) +
                lpgMonthlyExtra +
                foodInflationDaily;

  return Math.round(daily);
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'low': return '#3fb950';
    case 'elevated': return '#d29922';
    case 'high': return '#f85149';
    case 'critical': return '#ff6a33';
    case 'severe': return '#ff0040';
    default: return '#f85149';
  }
}

export function getTagColor(tag: string): string {
  switch (tag) {
    case 'war': return '#ff4444';
    case 'oil': return '#ff6a33';
    case 'india': return '#ff9500';
    case 'gov': return '#1f6feb';
    case 'mkt': return '#3fb950';
    case 'life': return '#d29922';
    default: return '#8b949e';
  }
}

export function formatCurrency(n: number): string {
  if (n >= 100000) return '\u20B9' + (n / 100000).toFixed(1) + 'L';
  if (n >= 1000) return '\u20B9' + (n / 1000).toFixed(1) + 'K';
  return '\u20B9' + n.toLocaleString('en-IN');
}
