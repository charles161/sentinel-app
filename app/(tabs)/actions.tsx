import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { C } from '@/constants/Colors';
import { SentinelData, SAMPLE_DATA } from '@/data/sampleData';
import { fetchSentinelData } from '@/lib/dataService';

const DONE_KEY = 'sentinel_actions_done';

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = { BUY: C.red, PREPARE: C.yellow, WATCH: C.blue };
  const bg = colors[type] || C.textMuted;
  return (
    <View style={[s.typeBadge, { backgroundColor: bg }]}>
      <Text style={s.typeBadgeText}>{type}</Text>
    </View>
  );
}

export default function ActionsScreen() {
  const [data, setData] = useState<SentinelData>(SAMPLE_DATA);
  const [doneSet, setDoneSet] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSentinelData().then(setData);
    AsyncStorage.getItem(DONE_KEY).then(v => {
      if (v) setDoneSet(new Set(JSON.parse(v)));
    });
  }, []);

  const toggleDone = useCallback(async (item: string) => {
    setDoneSet(prev => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      AsyncStorage.setItem(DONE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const d = await fetchSentinelData();
    setData(d);
    setRefreshing(false);
  }, []);

  const actionsByType = {
    BUY: data.actions.filter(a => a.type === 'BUY'),
    PREPARE: data.actions.filter(a => a.type === 'PREPARE'),
    WATCH: data.actions.filter(a => a.type === 'WATCH'),
  };

  const totalDone = data.actions.filter(a => a.done || doneSet.has(a.item)).length;
  const total = data.actions.length;
  const pct = Math.round((totalDone / total) * 100);

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />}
      >
        <Text style={s.pageTitle}>{'\uD83C\uDFAF'}  ACTION ITEMS</Text>

        {/* Progress */}
        <View style={s.progressBox}>
          <View style={s.progressHeader}>
            <Text style={s.progressLabel}>PROGRESS</Text>
            <Text style={s.progressPct}>{totalDone}/{total} ({pct}%)</Text>
          </View>
          <View style={s.progressBar}>
            <View style={[s.progressFill, { width: `${pct}%` }]} />
          </View>
        </View>

        {/* Sections */}
        {(['BUY', 'PREPARE', 'WATCH'] as const).map(type => (
          <View key={type} style={s.section}>
            <View style={s.sectionHeader}>
              <TypeBadge type={type} />
              <Text style={s.sectionCount}>{actionsByType[type].length}</Text>
            </View>
            {actionsByType[type].map((action, i) => {
              const done = action.done || doneSet.has(action.item);
              return (
                <TouchableOpacity
                  key={i}
                  style={[s.actionCard, done && s.actionCardDone]}
                  onPress={() => toggleDone(action.item)}
                  activeOpacity={0.7}
                >
                  <View style={s.actionHeader}>
                    <View style={[s.checkbox, done && s.checkboxDone]}>
                      {done && <Text style={s.checkmark}>{'\u2713'}</Text>}
                    </View>
                    <Text style={[s.actionItem, done && s.actionItemDone]}>{action.item}</Text>
                  </View>
                  <Text style={s.actionDetail}>{action.detail}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {/* Stock Radar */}
        <Text style={s.sectionTitle}>{'\uD83D\uDD0D'}  STOCK RADAR</Text>
        {data.stock_radar.map((item, i) => (
          <View key={i} style={s.radarCard}>
            <View style={s.radarHeader}>
              <Text style={s.radarName}>{item.name}</Text>
              <View style={[s.radarStatus, {
                backgroundColor: item.status === 'STABLE' ? C.green :
                  item.status === 'PRICE DOWN' ? C.green :
                  item.status === 'DEMAND STRESS' ? C.red : C.yellow,
              }]}>
                <Text style={s.radarStatusText}>{item.status}</Text>
              </View>
            </View>
            <View style={s.radarMeta}>
              <Text style={s.radarCategory}>{item.category}</Text>
              <Text style={s.radarPrice}>{item.price}</Text>
            </View>
          </View>
        ))}

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
  progressBox: { backgroundColor: C.surface, borderRadius: 12, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: C.border },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { color: C.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  progressPct: { color: C.accent, fontSize: 13, fontWeight: '700' },
  progressBar: { height: 6, backgroundColor: C.bg, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.accent, borderRadius: 3 },
  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionCount: { color: C.textMuted, fontSize: 12, fontWeight: '600' },
  sectionTitle: { color: C.text, fontSize: 15, fontWeight: '800', letterSpacing: 1, marginBottom: 12, marginTop: 8 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  typeBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  actionCard: { backgroundColor: C.surface, borderRadius: 10, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: C.border },
  actionCardDone: { opacity: 0.5 },
  actionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: C.textMuted, alignItems: 'center', justifyContent: 'center' },
  checkboxDone: { backgroundColor: C.green, borderColor: C.green },
  checkmark: { color: '#fff', fontSize: 13, fontWeight: '800' },
  actionItem: { color: C.text, fontSize: 14, fontWeight: '700', flex: 1 },
  actionItemDone: { textDecorationLine: 'line-through', color: C.textMuted },
  actionDetail: { color: C.textSecondary, fontSize: 12, lineHeight: 18, marginLeft: 32 },
  radarCard: { backgroundColor: C.surface, borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: C.border },
  radarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  radarName: { color: C.text, fontSize: 13, fontWeight: '700', flex: 1 },
  radarStatus: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  radarStatusText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  radarMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  radarCategory: { color: C.textMuted, fontSize: 11 },
  radarPrice: { color: C.textSecondary, fontSize: 12, fontWeight: '600' },
});
