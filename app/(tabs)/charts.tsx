import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { C } from '@/constants/Colors';
import { fetchPriceHistory, PriceTimeSeries } from '@/lib/dataService';

const screenWidth = Dimensions.get('window').width - 32;

const BASELINES = {
  brent: 71,
  gold: 9200,
  rupee: 86.5,
  diesel: 82.50,
};

interface ChartConfig {
  key: 'gold' | 'brent' | 'rupee' | 'diesel';
  title: string;
  unit: string;
  color: string;
  baseline: number;
  format: (v: number) => string;
}

const CHART_CONFIGS: ChartConfig[] = [
  { key: 'gold', title: 'Gold 24K', unit: '\u20B9/g', color: '#FFD700', baseline: BASELINES.gold, format: (v: number) => `\u20B9${(v / 1000).toFixed(1)}K` },
  { key: 'brent', title: 'Brent Crude', unit: '$/bbl', color: '#ff6a33', baseline: BASELINES.brent, format: (v: number) => `$${v}` },
  { key: 'rupee', title: 'INR/USD', unit: '\u20B9/$', color: '#f85149', baseline: BASELINES.rupee, format: (v: number) => `\u20B9${v.toFixed(1)}` },
  { key: 'diesel', title: 'Diesel Bangalore', unit: '\u20B9/L', color: '#1f6feb', baseline: BASELINES.diesel, format: (v: number) => `\u20B9${v.toFixed(1)}` },
];

function PriceChart({ config, prices }: { config: ChartConfig; prices: PriceTimeSeries }) {
  const key = config.key;
  const values = (prices[key] as (number | null)[]).map(v => v ?? 0);
  if (values.length === 0) return null;

  const current = values[values.length - 1];
  const baseline = config.baseline;
  const changePct = ((current - baseline) / baseline * 100).toFixed(1);
  const isUp = current > baseline;

  // Day labels: show D0 at start, then every 7 days, and final
  const labels = prices.dates.map((d, i) => {
    if (i === 0) return 'D0';
    if (i === values.length - 1) return `D${i}`;
    if (i % 7 === 0) return `D${i}`;
    return '';
  });

  const baselineData = values.map(() => baseline);

  return (
    <View style={s.chartCard}>
      <View style={s.chartHeader}>
        <View>
          <Text style={s.chartTitle}>{config.title}</Text>
          <Text style={s.chartUnit}>{config.unit}</Text>
        </View>
        <View style={s.chartValues}>
          <Text style={[s.chartCurrent, { color: config.color }]}>
            {config.format(current)}
          </Text>
          <Text style={[s.chartChange, { color: isUp ? C.red : C.green }]}>
            {isUp ? '\u2191' : '\u2193'} {changePct}%
          </Text>
        </View>
      </View>

      <LineChart
        data={{
          labels,
          datasets: [
            { data: values, color: () => config.color, strokeWidth: 2.5 },
            { data: baselineData, color: () => 'rgba(139, 148, 158, 0.4)', strokeWidth: 1, withDots: false },
          ],
        }}
        width={screenWidth}
        height={200}
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        withDots={false}
        withShadow={false}
        fromZero={false}
        segments={4}
        chartConfig={{
          backgroundColor: C.surface,
          backgroundGradientFrom: C.surface,
          backgroundGradientTo: C.surface,
          decimalPlaces: 0,
          color: () => 'rgba(139, 148, 158, 0.3)',
          labelColor: () => C.textMuted,
          propsForLabels: { fontSize: 9 },
          propsForBackgroundLines: { strokeDasharray: '4 4', stroke: C.border, strokeWidth: 0.5 },
        }}
        style={s.chart}
        bezier
      />

      <View style={s.legendRow}>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: config.color }]} />
          <Text style={s.legendText}>Current</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendDash, { borderColor: 'rgba(139, 148, 158, 0.4)' }]} />
          <Text style={s.legendText}>Day 0 baseline ({config.format(baseline)})</Text>
        </View>
      </View>

      <View style={s.keyDates}>
        <Text style={s.keyDateLabel}>D0: {config.format(baseline)}</Text>
        {values.length > 25 && <Text style={s.keyDateLabel}>D25: {config.format(values[25])}</Text>}
        <Text style={s.keyDateLabel}>D{values.length - 1}: {config.format(current)}</Text>
      </View>
    </View>
  );
}

function SummaryBar({ prices }: { prices: PriceTimeSeries }) {
  const last = (arr: (number | null)[]) => {
    for (let i = arr.length - 1; i >= 0; i--) if (arr[i] != null) return arr[i]!;
    return 0;
  };
  const brent = last(prices.brent);
  const gold = last(prices.gold);
  const rupee = last(prices.rupee);
  const diesel = last(prices.diesel);

  const summaries = [
    { label: 'BRENT', value: `$${brent}`, change: `+${((brent - BASELINES.brent) / BASELINES.brent * 100).toFixed(0)}%`, color: C.orange },
    { label: 'GOLD', value: `\u20B9${(gold / 1000).toFixed(1)}K`, change: `+${((gold - BASELINES.gold) / BASELINES.gold * 100).toFixed(0)}%`, color: '#FFD700' },
    { label: '\u20B9/USD', value: `${rupee.toFixed(1)}`, change: `+${((rupee - BASELINES.rupee) / BASELINES.rupee * 100).toFixed(0)}%`, color: C.red },
    { label: 'DIESEL', value: `\u20B9${diesel}`, change: `+${((diesel - BASELINES.diesel) / BASELINES.diesel * 100).toFixed(0)}%`, color: C.blue },
  ];

  return (
    <View style={s.summaryRow}>
      {summaries.map((item, i) => (
        <View key={i} style={s.summaryItem}>
          <Text style={s.summaryLabel}>{item.label}</Text>
          <Text style={[s.summaryValue, { color: item.color }]}>{item.value}</Text>
          <Text style={[s.summaryChange, { color: C.red }]}>{item.change}</Text>
        </View>
      ))}
    </View>
  );
}

export default function ChartsScreen() {
  const [prices, setPrices] = useState<PriceTimeSeries | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPriceHistory().then(data => {
      setPrices(data);
      setLoading(false);
    });
  }, []);

  if (loading || !prices || prices.dates.length === 0) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={C.accent} />
          <Text style={{ color: C.textSecondary, marginTop: 12, fontSize: 13 }}>Loading price history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const numDays = prices.dates.length;
  const firstDate = prices.dates[0]?.slice(5) || '';
  const lastDate = prices.dates[numDays - 1]?.slice(5) || '';

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        <Text style={s.pageTitle}>{'\uD83D\uDCC8'}  PRICE CHARTS</Text>
        <Text style={s.subtitle}>Day 0 ({firstDate}) {'\u2192'} Day {numDays - 1} ({lastDate}) {'\u00B7'} {numDays} days</Text>

        <SummaryBar prices={prices} />

        {CHART_CONFIGS.map(config => (
          <PriceChart key={config.key} config={config} prices={prices} />
        ))}

        <View style={s.milestonesCard}>
          <Text style={s.milestonesTitle}>CRISIS MILESTONES</Text>
          {[
            { day: 0, label: 'Iran blocks Hormuz selectively', color: C.red },
            { day: 7, label: 'Shipping insurance +300%, LPG first hike', color: C.orange },
            { day: 14, label: 'Ships stranded, gold breaks \u20B912K/g', color: '#FFD700' },
            { day: 25, label: 'Brent breaks $100, rupee at \u20B993.75', color: C.red },
            { day: 27, label: 'Excise cut \u20B910/L, Israel strikes Yazd', color: C.blue },
            { day: 29, label: 'Houthis enter war, diesel +25%', color: C.red },
            { day: 31, label: 'Brent volatile $106-115, gold \u20B914.9K ATH', color: C.orange },
          ].map((m, i) => (
            <View key={i} style={s.milestoneRow}>
              <View style={[s.milestoneDot, { backgroundColor: m.color }]} />
              <Text style={s.milestoneDay}>D{m.day}</Text>
              <Text style={s.milestoneText}>{m.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  content: { padding: 16 },
  pageTitle: { color: C.text, fontSize: 20, fontWeight: '800', letterSpacing: 2, marginBottom: 4 },
  subtitle: { color: C.textMuted, fontSize: 12, marginBottom: 16 },
  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  summaryItem: { flex: 1, backgroundColor: C.surface, borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  summaryLabel: { color: C.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 },
  summaryValue: { fontSize: 14, fontWeight: '800', marginBottom: 2 },
  summaryChange: { fontSize: 10, fontWeight: '600' },
  chartCard: { backgroundColor: C.surface, borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: C.border },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  chartTitle: { color: C.text, fontSize: 15, fontWeight: '800' },
  chartUnit: { color: C.textMuted, fontSize: 11, marginTop: 2 },
  chartValues: { alignItems: 'flex-end' },
  chartCurrent: { fontSize: 20, fontWeight: '800' },
  chartChange: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  chart: { marginLeft: -16, borderRadius: 8 },
  legendRow: { flexDirection: 'row', gap: 16, marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 3, borderRadius: 1.5 },
  legendDash: { width: 10, height: 0, borderTopWidth: 1.5, borderStyle: 'dashed' },
  legendText: { color: C.textMuted, fontSize: 10 },
  keyDates: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: C.border },
  keyDateLabel: { color: C.textMuted, fontSize: 10, fontWeight: '600' },
  milestonesCard: { backgroundColor: C.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: C.border },
  milestonesTitle: { color: C.text, fontSize: 13, fontWeight: '800', letterSpacing: 1, marginBottom: 12 },
  milestoneRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  milestoneDot: { width: 8, height: 8, borderRadius: 4 },
  milestoneDay: { color: C.textSecondary, fontSize: 11, fontWeight: '700', width: 30 },
  milestoneText: { color: C.textSecondary, fontSize: 12, flex: 1 },
});
