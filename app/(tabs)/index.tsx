import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '@/constants/Colors';
import { SentinelData, SAMPLE_DATA } from '@/data/sampleData';
import { fetchSentinelData, computeMorningNumber, getSeverityColor } from '@/lib/dataService';

function TrendArrow({ pct }: { pct: number }) {
  const color = pct >= 0 ? C.red : C.green;
  const arrow = pct >= 0 ? '\u2191' : '\u2193';
  return <Text style={{ color, fontSize: 18, fontWeight: '700' }}>{arrow} {Math.abs(pct).toFixed(1)}%</Text>;
}

function SummaryCard({ label, value, change, color }: {
  label: string; value: string; change: string; color: string;
}) {
  return (
    <View style={s.summaryCard}>
      <Text style={s.cardLabel}>{label}</Text>
      <Text style={[s.cardValue, { color }]}>{value}</Text>
      <Text style={[s.cardChange, { color }]}>{change}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const [data, setData] = useState<SentinelData>(SAMPLE_DATA);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const d = await fetchSentinelData();
    setData(d);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const morningNumber = computeMorningNumber(data);
  const sevColor = getSeverityColor(data.meta.severity);

  if (loading) {
    return (
      <SafeAreaView style={s.container}>
        <ActivityIndicator size="large" color={C.accent} style={{ marginTop: 100 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />}
      >
        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>SENTINEL</Text>
          <View style={[s.dayBadge, { backgroundColor: sevColor }]}>
            <Text style={s.dayText}>DAY {data.meta.war_day}</Text>
          </View>
        </View>

        {/* Severity Bar */}
        <View style={s.sevBar}>
          <View style={[s.sevFill, { width: `${data.meta.severity === 'critical' ? 78 : 50}%`, backgroundColor: sevColor }]} />
        </View>
        <View style={s.sevLabels}>
          {['low', 'elevated', 'high', 'critical', 'severe'].map(l => (
            <Text key={l} style={[s.sevLabel, data.meta.severity === l && { color: sevColor, fontWeight: '700' }]}>
              {l.toUpperCase()}
            </Text>
          ))}
        </View>

        {/* Morning Number */}
        <View style={s.morningBox}>
          <Text style={s.morningLabel}>YOUR DAILY CRISIS COST</Text>
          <Text style={s.morningNumber}>{'\u20B9'}{morningNumber}</Text>
          <Text style={s.morningUnit}>/day above normal</Text>
          <TrendArrow pct={data.energy.brent.change_pct} />
        </View>

        {/* Situation */}
        <View style={s.situationBox}>
          <Text style={s.situationText}>{data.meta.situation}</Text>
        </View>

        {/* 3-Card Summary */}
        <View style={s.cardRow}>
          <SummaryCard
            label="OIL (Brent)"
            value={`$${data.energy.brent.price}`}
            change={`${data.energy.brent.change_pct > 0 ? '+' : ''}${data.energy.brent.change_pct}%`}
            color={data.energy.brent.price > 100 ? C.red : C.green}
          />
          <SummaryCard
            label="GOLD /10g"
            value={`\u20B9${Math.round(data.prices.gold.price_per_10g / 1000)}K`}
            change={data.prices.gold.trend === 'up' ? '\u2191 Rising' : '\u2193 Falling'}
            color={data.prices.gold.trend === 'up' ? C.yellow : C.green}
          />
          <SummaryCard
            label="RUPEE"
            value={`\u20B9${data.prices.forex.inr_usd}`}
            change={data.prices.forex.inr_usd > 90 ? 'Weak' : 'Stable'}
            color={data.prices.forex.inr_usd > 90 ? C.red : C.green}
          />
        </View>

        {/* Quick Stats */}
        <View style={s.quickRow}>
          <View style={s.quickItem}>
            <Text style={s.quickLabel}>HORMUZ</Text>
            <Text style={[s.quickValue, { color: C.yellow }]}>{data.supply_chain.hormuz_status.toUpperCase()}</Text>
          </View>
          <View style={s.quickItem}>
            <Text style={s.quickLabel}>LPG GAP</Text>
            <Text style={[s.quickValue, { color: C.red }]}>{data.energy.lpg.deficit_pct}%</Text>
          </View>
          <View style={s.quickItem}>
            <Text style={s.quickLabel}>NIFTY</Text>
            <Text style={[s.quickValue, { color: data.markets.nifty.change_pct >= 0 ? C.green : C.red }]}>
              {data.markets.nifty.value.toLocaleString()}
            </Text>
          </View>
          <View style={s.quickItem}>
            <Text style={s.quickLabel}>RESERVES</Text>
            <Text style={[s.quickValue, { color: data.energy.lpg.reserves_days > 30 ? C.green : C.red }]}>
              {data.energy.lpg.reserves_days}d
            </Text>
          </View>
        </View>

        {/* Top Risks */}
        <Text style={s.sectionTitle}>TOP RISKS</Text>
        {data.risks.filter(r => r.level === 'high').slice(0, 3).map((r, i) => (
          <View key={i} style={[s.riskCard, { borderLeftColor: C.red }]}>
            <Text style={s.riskTitle}>{r.title}</Text>
            <Text style={s.riskDesc}>{r.description}</Text>
          </View>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  content: { padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { color: C.text, fontSize: 24, fontWeight: '800', letterSpacing: 2 },
  dayBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  dayText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  sevBar: { height: 6, backgroundColor: C.surface, borderRadius: 3, overflow: 'hidden', marginBottom: 4 },
  sevFill: { height: '100%', borderRadius: 3 },
  sevLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  sevLabel: { color: C.textMuted, fontSize: 9, fontWeight: '600', textTransform: 'uppercase' },
  morningBox: { alignItems: 'center', paddingVertical: 24, marginBottom: 16 },
  morningLabel: { color: C.textSecondary, fontSize: 12, fontWeight: '600', letterSpacing: 1, marginBottom: 4 },
  morningNumber: { color: C.accent, fontSize: 64, fontWeight: '800' },
  morningUnit: { color: C.textSecondary, fontSize: 14, marginBottom: 8 },
  situationBox: { backgroundColor: C.surface, borderRadius: 12, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: C.border },
  situationText: { color: C.textSecondary, fontSize: 13, lineHeight: 20 },
  cardRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  summaryCard: { flex: 1, backgroundColor: C.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: C.border },
  cardLabel: { color: C.textSecondary, fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginBottom: 6 },
  cardValue: { fontSize: 22, fontWeight: '800', marginBottom: 2 },
  cardChange: { fontSize: 12, fontWeight: '600' },
  quickRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  quickItem: { flex: 1, backgroundColor: C.surface, borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  quickLabel: { color: C.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 },
  quickValue: { fontSize: 15, fontWeight: '800' },
  sectionTitle: { color: C.text, fontSize: 14, fontWeight: '800', letterSpacing: 1, marginBottom: 10 },
  riskCard: { backgroundColor: C.surface, borderRadius: 10, padding: 14, marginBottom: 10, borderLeftWidth: 3, borderWidth: 1, borderColor: C.border },
  riskTitle: { color: C.text, fontSize: 14, fontWeight: '700', marginBottom: 4 },
  riskDesc: { color: C.textSecondary, fontSize: 12, lineHeight: 18 },
});
