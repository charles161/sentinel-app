import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { C } from '@/constants/Colors';
import { HISTORICAL_PRICES, CHART_CONFIGS, BASELINES, DailyPrice } from '@/data/historicalPrices';

const screenWidth = Dimensions.get('window').width - 32;

type MetricKey = 'gold' | 'brent' | 'rupee' | 'diesel';

function PriceChart({ config }: { config: typeof CHART_CONFIGS[number] }) {
  const [showAll, setShowAll] = useState(false);

  const key = config.key as MetricKey;
  const data = HISTORICAL_PRICES;
  const values = data.map(d => d[key]);
  const current = values[values.length - 1];
  const baseline = config.baseline;
  const changePct = ((current - baseline) / baseline * 100).toFixed(1);
  const isUp = current > baseline;

  // Show fewer labels to avoid crowding
  const labelInterval = showAll ? 5 : 7;
  const labels = data.map((d, i) => {
    if (i === 0) return 'D0';
    if (i === data.length - 1) return 'D' + d.day;
    if (i % labelInterval === 0) return 'D' + d.day;
    return '';
  });

  // Create baseline dataset (horizontal line)
  const baselineData = data.map(() => baseline);

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
          <Text style={[s.chartChange, { color: isUp ? (config.inverted ? C.red : C.red) : C.green }]}>
            {isUp ? '\u2191' : '\u2193'} {changePct}%
          </Text>
        </View>
      </View>

      <LineChart
        data={{
          labels,
          datasets: [
            {
              data: values,
              color: () => config.color,
              strokeWidth: 2.5,
            },
            {
              data: baselineData,
              color: () => 'rgba(139, 148, 158, 0.4)',
              strokeWidth: 1,
              withDots: false,
            },
          ],
        }}
        width={screenWidth}
        height={200}
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
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
          propsForLabels: {
            fontSize: 9,
          },
          propsForBackgroundLines: {
            strokeDasharray: '4 4',
            stroke: C.border,
            strokeWidth: 0.5,
          },
        }}
        style={s.chart}
        bezier
      />

      {/* Legend */}
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

      {/* Key dates */}
      <View style={s.keyDates}>
        <Text style={s.keyDateLabel}>D0: {config.format(baseline)}</Text>
        <Text style={s.keyDateLabel}>D25: {config.format(data[25][key])}</Text>
        <Text style={s.keyDateLabel}>D31: {config.format(current)}</Text>
      </View>
    </View>
  );
}

function SummaryBar() {
  const latest = HISTORICAL_PRICES[HISTORICAL_PRICES.length - 1];
  const summaries = [
    { label: 'BRENT', value: `$${latest.brent}`, change: `+${((latest.brent - BASELINES.brent) / BASELINES.brent * 100).toFixed(0)}%`, color: C.orange },
    { label: 'GOLD', value: `\u20B9${(latest.gold / 1000).toFixed(1)}K`, change: `+${((latest.gold - BASELINES.gold) / BASELINES.gold * 100).toFixed(0)}%`, color: '#FFD700' },
    { label: '\u20B9/USD', value: `${latest.rupee}`, change: `+${((latest.rupee - BASELINES.rupee) / BASELINES.rupee * 100).toFixed(0)}%`, color: C.red },
    { label: 'DIESEL', value: `\u20B9${latest.diesel}`, change: `+${((latest.diesel - BASELINES.diesel) / BASELINES.diesel * 100).toFixed(0)}%`, color: C.blue },
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
  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        <Text style={s.pageTitle}>{'\uD83D\uDCC8'}  PRICE CHARTS</Text>
        <Text style={s.subtitle}>Day 0 (Feb 28) \u2192 Day 31 (Mar 31)</Text>

        <SummaryBar />

        {CHART_CONFIGS.map(config => (
          <PriceChart key={config.key} config={config} />
        ))}

        {/* Crisis milestones */}
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
