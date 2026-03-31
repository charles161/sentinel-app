// Historical crisis prices: Feb 28 (Day 0) through Mar 31 (Day 31), 2026
// Key data points from sentinel briefs, interpolated for daily coverage.
//
// Sources: Sentinel daily briefs (Mar 25, 27, 28, 30, 31), CONTEXT.md,
// watchlist.md, journal.md, stock-checks, patterns.md

export interface DailyPrice {
  date: string;    // YYYY-MM-DD
  day: number;     // crisis day (0-31)
  brent: number;   // USD/bbl
  gold: number;    // INR/gram 24K
  rupee: number;   // INR per USD
  petrol: number;  // INR/L Bangalore
  diesel: number;  // INR/L Bangalore
  lpg: number;     // INR domestic 14.2kg cylinder
}

// Baselines (Day 0)
export const BASELINES = {
  brent: 71,
  gold: 9200,
  rupee: 86.5,
  petrol: 94.77,
  diesel: 82.50,
  lpg: 803,
};

// Key verified data points, then interpolated daily
export const HISTORICAL_PRICES: DailyPrice[] = [
  // Week 1: Initial shock — Iran blockade begins
  { date: '2026-02-28', day: 0,  brent: 71.0,  gold: 9200,  rupee: 86.50, petrol: 94.77, diesel: 82.50, lpg: 803 },
  { date: '2026-03-01', day: 1,  brent: 76.5,  gold: 9450,  rupee: 87.10, petrol: 94.77, diesel: 82.50, lpg: 803 },
  { date: '2026-03-02', day: 2,  brent: 79.0,  gold: 9680,  rupee: 87.55, petrol: 94.77, diesel: 82.50, lpg: 803 },
  { date: '2026-03-03', day: 3,  brent: 81.5,  gold: 9900,  rupee: 87.90, petrol: 94.77, diesel: 82.50, lpg: 803 },
  { date: '2026-03-04', day: 4,  brent: 83.0,  gold: 10100, rupee: 88.20, petrol: 94.77, diesel: 82.50, lpg: 803 },
  { date: '2026-03-05', day: 5,  brent: 84.5,  gold: 10350, rupee: 88.60, petrol: 94.77, diesel: 82.50, lpg: 803 },
  { date: '2026-03-06', day: 6,  brent: 86.0,  gold: 10550, rupee: 88.95, petrol: 94.77, diesel: 82.50, lpg: 803 },

  // Week 2: Selective blockade confirmed, shipping disrupted
  { date: '2026-03-07', day: 7,  brent: 88.0,  gold: 10800, rupee: 89.30, petrol: 94.77, diesel: 82.50, lpg: 863 },
  { date: '2026-03-08', day: 8,  brent: 89.0,  gold: 11000, rupee: 89.50, petrol: 94.77, diesel: 82.50, lpg: 863 },
  { date: '2026-03-09', day: 9,  brent: 89.5,  gold: 11150, rupee: 89.80, petrol: 94.77, diesel: 82.50, lpg: 863 },
  { date: '2026-03-10', day: 10, brent: 90.5,  gold: 11350, rupee: 90.10, petrol: 94.77, diesel: 82.50, lpg: 863 },
  { date: '2026-03-11', day: 11, brent: 91.0,  gold: 11500, rupee: 90.40, petrol: 94.77, diesel: 82.50, lpg: 870 },
  { date: '2026-03-12', day: 12, brent: 91.5,  gold: 11650, rupee: 90.65, petrol: 94.77, diesel: 82.50, lpg: 870 },
  { date: '2026-03-13', day: 13, brent: 92.0,  gold: 11800, rupee: 90.90, petrol: 94.77, diesel: 82.50, lpg: 875 },

  // Week 3: Insurance surge, ships stranded, prices climbing
  { date: '2026-03-14', day: 14, brent: 93.0,  gold: 12000, rupee: 91.20, petrol: 94.77, diesel: 82.50, lpg: 875 },
  { date: '2026-03-15', day: 15, brent: 93.5,  gold: 12150, rupee: 91.40, petrol: 94.77, diesel: 82.50, lpg: 880 },
  { date: '2026-03-16', day: 16, brent: 94.0,  gold: 12300, rupee: 91.65, petrol: 94.77, diesel: 82.50, lpg: 880 },
  { date: '2026-03-17', day: 17, brent: 95.0,  gold: 12500, rupee: 91.90, petrol: 94.77, diesel: 82.50, lpg: 885 },
  { date: '2026-03-18', day: 18, brent: 95.5,  gold: 12650, rupee: 92.10, petrol: 94.77, diesel: 82.50, lpg: 885 },
  { date: '2026-03-19', day: 19, brent: 96.0,  gold: 12800, rupee: 92.40, petrol: 94.77, diesel: 82.50, lpg: 890 },
  { date: '2026-03-20', day: 20, brent: 97.0,  gold: 13000, rupee: 92.70, petrol: 94.77, diesel: 82.50, lpg: 890 },

  // Week 4: Breaks $100, Gold surging, excise cuts
  { date: '2026-03-21', day: 21, brent: 97.5,  gold: 13100, rupee: 93.00, petrol: 94.77, diesel: 82.50, lpg: 895 },
  { date: '2026-03-22', day: 22, brent: 98.0,  gold: 13200, rupee: 93.20, petrol: 94.77, diesel: 82.50, lpg: 900 },
  { date: '2026-03-23', day: 23, brent: 98.5,  gold: 13300, rupee: 93.40, petrol: 94.77, diesel: 82.50, lpg: 900 },
  { date: '2026-03-24', day: 24, brent: 99.5,  gold: 13400, rupee: 93.55, petrol: 94.77, diesel: 82.50, lpg: 905 },
  { date: '2026-03-25', day: 25, brent: 100.5, gold: 13500, rupee: 93.75, petrol: 94.77, diesel: 82.50, lpg: 910 }, // verified
  { date: '2026-03-26', day: 26, brent: 104.0, gold: 13950, rupee: 94.00, petrol: 94.77, diesel: 82.50, lpg: 910 },

  // Day 27+: Escalation — Israel strikes, Houthis, excise cuts, price jumps
  { date: '2026-03-27', day: 27, brent: 108.0, gold: 14400, rupee: 94.21, petrol: 98.50, diesel: 86.50, lpg: 915 }, // verified: excise cut ₹10 + price pass-through
  { date: '2026-03-28', day: 28, brent: 112.6, gold: 14454, rupee: 94.71, petrol: 100.50, diesel: 88.50, lpg: 915 }, // verified
  { date: '2026-03-29', day: 29, brent: 113.0, gold: 14600, rupee: 94.75, petrol: 102.00, diesel: 90.65, lpg: 915.5 }, // Houthis enter, diesel +25% industrial
  { date: '2026-03-30', day: 30, brent: 113.0, gold: 14728, rupee: 94.80, petrol: 102.96, diesel: 90.65, lpg: 915.5 }, // verified: Brent high $116.23, settled $113
  { date: '2026-03-31', day: 31, brent: 110.0, gold: 14929, rupee: 94.35, petrol: 102.96, diesel: 90.99, lpg: 915.5 }, // verified: volatile drop, gold ATH
];

// Metric display configuration
export const CHART_CONFIGS = [
  {
    key: 'gold' as const,
    title: 'Gold 24K',
    unit: '\u20B9/g',
    color: '#FFD700',
    baseline: BASELINES.gold,
    format: (v: number) => `\u20B9${(v / 1000).toFixed(1)}K`,
  },
  {
    key: 'brent' as const,
    title: 'Brent Crude',
    unit: '$/bbl',
    color: '#ff6a33',
    baseline: BASELINES.brent,
    format: (v: number) => `$${v}`,
  },
  {
    key: 'rupee' as const,
    title: 'INR/USD',
    unit: '\u20B9/$',
    color: '#f85149',
    baseline: BASELINES.rupee,
    format: (v: number) => `\u20B9${v.toFixed(1)}`,
    inverted: true, // higher = worse for rupee
  },
  {
    key: 'diesel' as const,
    title: 'Diesel Bangalore',
    unit: '\u20B9/L',
    color: '#1f6feb',
    baseline: BASELINES.diesel,
    format: (v: number) => `\u20B9${v.toFixed(1)}`,
  },
];
