import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '@/constants/Colors';
import { SentinelData, SAMPLE_DATA } from '@/data/sampleData';
import { fetchSentinelData, getTagColor } from '@/lib/dataService';

function TagPill({ tag }: { tag: string }) {
  const bg = getTagColor(tag);
  return (
    <View style={[s.tagPill, { backgroundColor: bg + '22', borderColor: bg }]}>
      <Text style={[s.tagText, { color: bg }]}>{tag.toUpperCase()}</Text>
    </View>
  );
}

export default function TimelineScreen() {
  const [data, setData] = useState<SentinelData>(SAMPLE_DATA);

  useEffect(() => {
    fetchSentinelData().then(setData);
  }, []);

  // Sort timeline: most recent first, but Apr 6 (future) at top
  const sorted = [...data.timeline].sort((a, b) => {
    // Future dates first
    const aFuture = a.date.startsWith('Apr');
    const bFuture = b.date.startsWith('Apr');
    if (aFuture && !bFuture) return -1;
    if (!aFuture && bFuture) return 1;
    // Then by day descending
    return b.day - a.day;
  });

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        <Text style={s.pageTitle}>{'\uD83D\uDCC5'}  TIMELINE</Text>

        {/* Tag Legend */}
        <View style={s.legendRow}>
          {['war', 'oil', 'gov', 'mkt', 'life', 'india'].map(tag => (
            <TagPill key={tag} tag={tag} />
          ))}
        </View>

        {/* Timeline */}
        {sorted.map((entry, idx) => {
          const isFuture = entry.date.startsWith('Apr');
          return (
            <View key={idx} style={s.timelineEntry}>
              {/* Connector line */}
              <View style={s.lineCol}>
                <View style={[s.dot, isFuture && s.dotFuture]} />
                {idx < sorted.length - 1 && <View style={s.line} />}
              </View>

              {/* Content */}
              <View style={s.entryContent}>
                <View style={s.entryHeader}>
                  <Text style={[s.entryDate, isFuture && s.entryDateFuture]}>
                    {entry.date}
                  </Text>
                  <View style={[s.dayChip, isFuture && s.dayChipFuture]}>
                    <Text style={[s.dayChipText, isFuture && s.dayChipTextFuture]}>
                      {isFuture ? 'UPCOMING' : `Day ${entry.day}`}
                    </Text>
                  </View>
                </View>

                {entry.events.map((ev, evIdx) => (
                  <View key={evIdx} style={s.eventRow}>
                    <TagPill tag={ev.tag} />
                    <Text style={s.eventText}>{ev.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  content: { padding: 16 },
  pageTitle: { color: C.text, fontSize: 20, fontWeight: '800', letterSpacing: 2, marginBottom: 16 },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 20 },
  tagPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
  tagText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  timelineEntry: { flexDirection: 'row', marginBottom: 0 },
  lineCol: { width: 24, alignItems: 'center' },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: C.accent, marginTop: 4 },
  dotFuture: { backgroundColor: C.red, borderWidth: 2, borderColor: '#ff000066' },
  line: { width: 2, flex: 1, backgroundColor: C.border, marginVertical: 2 },
  entryContent: { flex: 1, paddingLeft: 12, paddingBottom: 20 },
  entryHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  entryDate: { color: C.text, fontSize: 15, fontWeight: '800' },
  entryDateFuture: { color: C.red },
  dayChip: { backgroundColor: C.surface, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, borderWidth: 1, borderColor: C.border },
  dayChipFuture: { backgroundColor: C.red + '22', borderColor: C.red },
  dayChipText: { color: C.textSecondary, fontSize: 10, fontWeight: '700' },
  dayChipTextFuture: { color: C.red },
  eventRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  eventText: { color: C.textSecondary, fontSize: 12, lineHeight: 18, flex: 1 },
});
