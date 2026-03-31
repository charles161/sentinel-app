import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '@/constants/Colors';
import { SentinelData, SAMPLE_DATA } from '@/data/sampleData';
import { fetchSentinelData } from '@/lib/dataService';

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{icon}  {title}</Text>
      {children}
    </View>
  );
}

function Card({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <View style={s.card}>
      <Text style={s.cardLabel}>{label}</Text>
      <Text style={[s.cardValue, color ? { color } : null]}>{value}</Text>
      {sub && <Text style={s.cardSub}>{sub}</Text>}
    </View>
  );
}

function DevRow({ text }: { text: string }) {
  return (
    <View style={s.devRow}>
      <Text style={s.devDot}>{'\u2022'}</Text>
      <Text style={s.devText}>{text}</Text>
    </View>
  );
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'up') return <Text style={{ color: C.red }}>{'\u2191'}</Text>;
  if (trend === 'down') return <Text style={{ color: C.green }}>{'\u2193'}</Text>;
  return <Text style={{ color: C.textMuted }}>{'\u2014'}</Text>;
}

export default function DetailScreen() {
  const [data, setData] = useState<SentinelData>(SAMPLE_DATA);

  useEffect(() => {
    fetchSentinelData().then(setData);
  }, []);

  const d = data;

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        <Text style={s.pageTitle}>FULL BREAKDOWN</Text>

        {/* Energy */}
        <Section title="ENERGY" icon={'\u26A1'}>
          <View style={s.cardRow}>
            <Card label="Brent" value={`$${d.energy.brent.price}`} sub={`${d.energy.brent.change_pct}%`}
              color={d.energy.brent.price > 100 ? C.red : C.green} />
            <Card label="LPG" value={`\u20B9${d.energy.lpg.official_price}`} sub={`Deficit ${d.energy.lpg.deficit_pct}%`} color={C.red} />
          </View>
          <View style={s.cardRow}>
            <Card label="Petrol" value={`\u20B9${d.energy.petrol.price}`} sub={d.energy.petrol.city} />
            <Card label="Diesel" value={`\u20B9${d.energy.diesel.price}`} sub={d.energy.diesel.city} />
          </View>
          <View style={s.cardRow}>
            <Card label="Reserves" value={`${d.energy.lpg.reserves_days} days`}
              color={d.energy.lpg.reserves_days > 30 ? C.green : C.red} />
            <Card label="Black Mkt LPG" value={`\u20B9${d.energy.lpg.black_market_low}-${d.energy.lpg.black_market_high}`} color={C.red} />
          </View>
          {d.energy.natural_gas.status && (
            <View style={s.noteBox}>
              <Text style={s.noteText}>{d.energy.natural_gas.status}</Text>
            </View>
          )}
        </Section>

        {/* Supply Chain */}
        <Section title="SUPPLY CHAIN" icon={'\u2693'}>
          <View style={s.cardRow}>
            <Card label="Hormuz" value={d.supply_chain.hormuz_status.toUpperCase()}
              color={d.supply_chain.hormuz_status === 'closed' ? C.red : C.yellow} />
            <Card label="Stranded" value={`${d.supply_chain.stranded_vessels} ships`}
              sub={`${(d.supply_chain.stranded_tonnage / 1000).toFixed(0)}K tonnes`} color={C.red} />
          </View>
          <View style={s.cardRow}>
            <Card label="Insurance" value={`+${d.supply_chain.insurance_surge_pct}%`} sub="premium surge" color={C.red} />
            <Card label="Alt Routes" value={d.supply_chain.alternative_routes[0] || 'None'} />
          </View>
          {d.supply_chain.key_developments.slice(0, 6).map((dev, i) => (
            <DevRow key={i} text={dev} />
          ))}
        </Section>

        {/* Prices */}
        <Section title="PRICES" icon={'\u20B9'}>
          {d.prices.food.map((f, i) => (
            <View key={i} style={s.priceRow}>
              <Text style={s.priceItem}>{f.item}</Text>
              <View style={s.priceRight}>
                <Text style={s.priceValue}>{'\u20B9'}{f.price}</Text>
                <TrendIcon trend={f.trend} />
              </View>
            </View>
          ))}
          <View style={s.divider} />
          <View style={s.cardRow}>
            <Card label="Gold /10g" value={`\u20B9${Math.round(d.prices.gold.price_per_10g / 1000)}K`}
              color={C.yellow} />
            <Card label="\u20B9/USD" value={`${d.prices.forex.inr_usd}`}
              color={d.prices.forex.inr_usd > 90 ? C.red : C.green} />
          </View>
          <View style={s.cardRow}>
            <Card label="Urea" value={`+${d.prices.urea.change_pct}%`} color={C.red} />
            <Card label="Food CPI" value={`${d.prices.food_inflation}%`} sub="YoY" />
          </View>
          <View style={s.noteBox}>
            <Text style={s.noteText}>{d.prices.forex.note}</Text>
          </View>
        </Section>

        {/* Markets */}
        <Section title="MARKETS" icon={'\uD83D\uDCC8'}>
          <View style={s.cardRow}>
            <Card label="Nifty" value={d.markets.nifty.value.toLocaleString()}
              sub={`${d.markets.nifty.change_pct}%`}
              color={d.markets.nifty.change_pct >= 0 ? C.green : C.red} />
            <Card label="Sensex" value={d.markets.sensex.value.toLocaleString()}
              sub={`${d.markets.sensex.change_pct}%`}
              color={d.markets.sensex.change_pct >= 0 ? C.green : C.red} />
          </View>
          <View style={s.cardRow}>
            <Card label="FII Flows" value={`\u20B9${d.markets.fii_flows.amount_crore.toLocaleString()} cr`}
              color={d.markets.fii_flows.amount_crore < 0 ? C.red : C.green} />
            <Card label="DII" value="Net Buy" sub={d.markets.dii_flows.note} color={C.green} />
          </View>
          <View style={s.noteBox}>
            <Text style={s.noteText}>{d.markets.nifty.note}</Text>
          </View>
        </Section>

        {/* Political Signals */}
        <Section title="POLITICAL SIGNALS" icon={'\uD83C\uDFDB'}>
          {d.political_signals.map((sig, i) => (
            <View key={i} style={s.signalCard}>
              <View style={s.signalHeader}>
                <Text style={s.signalDate}>{sig.date}</Text>
                <Text style={s.signalSpeaker}>{sig.speaker}</Text>
              </View>
              <Text style={s.signalQuote}>"{sig.quote}"</Text>
              <Text style={s.signalAnalysis}>{'\u2192'} {sig.analysis}</Text>
            </View>
          ))}
        </Section>

        {/* Daily Life */}
        <Section title="DAILY LIFE" icon={'\uD83C\uDFE0'}>
          {d.daily_life.map((item, i) => <DevRow key={i} text={item} />)}
        </Section>

        {/* Risks */}
        <Section title="RISKS" icon={'\u26A0\uFE0F'}>
          {d.risks.map((r, i) => (
            <View key={i} style={[s.riskCard, {
              borderLeftColor: r.level === 'high' ? C.red : r.level === 'medium' ? C.yellow : C.textMuted
            }]}>
              <View style={s.riskHeader}>
                <View style={[s.riskBadge, {
                  backgroundColor: r.level === 'high' ? C.red : r.level === 'medium' ? C.yellow : C.textMuted
                }]}>
                  <Text style={s.riskBadgeText}>{r.level.toUpperCase()}</Text>
                </View>
                <Text style={s.riskTitle}>{r.title}</Text>
              </View>
              <Text style={s.riskDesc}>{r.description}</Text>
            </View>
          ))}
        </Section>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  content: { padding: 16 },
  pageTitle: { color: C.text, fontSize: 20, fontWeight: '800', letterSpacing: 2, marginBottom: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { color: C.text, fontSize: 15, fontWeight: '800', letterSpacing: 1, marginBottom: 12 },
  cardRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  card: { flex: 1, backgroundColor: C.surface, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: C.border },
  cardLabel: { color: C.textSecondary, fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 },
  cardValue: { color: C.text, fontSize: 18, fontWeight: '800' },
  cardSub: { color: C.textSecondary, fontSize: 11, marginTop: 2 },
  noteBox: { backgroundColor: C.surface, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: C.border, marginTop: 6 },
  noteText: { color: C.textSecondary, fontSize: 12, lineHeight: 18 },
  devRow: { flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 4 },
  devDot: { color: C.accent, fontSize: 14, marginRight: 8, marginTop: 1 },
  devText: { color: C.textSecondary, fontSize: 12, lineHeight: 18, flex: 1 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  priceItem: { color: C.text, fontSize: 14, fontWeight: '600' },
  priceRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  priceValue: { color: C.text, fontSize: 14, fontWeight: '700' },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 12 },
  signalCard: { backgroundColor: C.surface, borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: C.border },
  signalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  signalDate: { color: C.textMuted, fontSize: 11, fontWeight: '600' },
  signalSpeaker: { color: C.accent, fontSize: 11, fontWeight: '700' },
  signalQuote: { color: C.text, fontSize: 13, fontStyle: 'italic', lineHeight: 20, marginBottom: 8 },
  signalAnalysis: { color: C.textSecondary, fontSize: 12, lineHeight: 18 },
  riskCard: { backgroundColor: C.surface, borderRadius: 10, padding: 14, marginBottom: 10, borderLeftWidth: 3, borderWidth: 1, borderColor: C.border },
  riskHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  riskBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  riskBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  riskTitle: { color: C.text, fontSize: 13, fontWeight: '700', flex: 1 },
  riskDesc: { color: C.textSecondary, fontSize: 12, lineHeight: 18 },
});
