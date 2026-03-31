import { SentinelData, SAMPLE_DATA } from '../data/sampleData';

const SENTINEL_URL = 'https://caren.lightslips.ai/sentinel';

export async function fetchSentinelData(): Promise<SentinelData> {
  try {
    const response = await fetch(SENTINEL_URL, {
      headers: { 'Accept': 'text/html' },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();

    // Extract var D={...}; from the HTML
    const match = html.match(/var\s+D\s*=\s*(\{[\s\S]*?\});\s*\n/);
    if (!match) throw new Error('Could not find data in HTML');

    const data = JSON.parse(match[1]) as SentinelData;
    return data;
  } catch (error) {
    console.warn('Failed to fetch live data, using sample:', error);
    return SAMPLE_DATA;
  }
}

export function computeMorningNumber(data: SentinelData): number {
  // Estimate daily crisis cost (₹/day) based on price increases
  const petrolDelta = 8.19; // vs baseline
  const dieselDelta = 8.49;
  const avgDailyPetrolL = 3; // ~3L/day driving
  const avgDailyDieselL = 0;
  const lpgMonthlyExtra = (data.energy.lpg.official_price - 803) / 30; // baseline ~₹803
  const foodInflationDaily = (data.prices.food_inflation / 100) * 500; // ₹500/day food spend

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
