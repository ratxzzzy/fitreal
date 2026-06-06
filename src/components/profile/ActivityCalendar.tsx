import { View, Text, StyleSheet } from "react-native";
import { colors, radius, spacing } from "../../theme";

type Props = {
  entries: { date: string }[];
  weeks?: number;
};

function weeksBack(n: number): Date[][] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = (today.getDay() + 6) % 7;
  const start = new Date(today);
  start.setDate(today.getDate() - dayOfWeek - (n - 1) * 7);

  const out: Date[][] = [];
  for (let w = 0; w < n; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(start);
      day.setDate(start.getDate() + w * 7 + d);
      week.push(day);
    }
    out.push(week);
  }
  return out;
}

function isoDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function ActivityCalendar({ entries, weeks = 20 }: Props) {
  const set = new Set(entries.map((e) => e.date));
  const grid = weeksBack(weeks);
  const today = isoDate(new Date());

  return (
    <View style={styles.wrap}>
      <View style={styles.grid}>
        {grid.map((week, wi) => (
          <View key={wi} style={styles.col}>
            {week.map((day) => {
              const iso = isoDate(day);
              const future = iso > today;
              const active = set.has(iso);
              const isToday = iso === today;
              return (
                <View
                  key={iso}
                  style={[
                    styles.cell,
                    future && styles.future,
                    active && styles.active,
                    isToday && styles.today,
                  ]}
                />
              );
            })}
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        <Text style={styles.legendText}>Menos</Text>
        <View style={[styles.cell, styles.cellLegend]} />
        <View style={[styles.cell, styles.cellLegend, styles.active]} />
        <Text style={styles.legendText}>Mas</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  grid: {
    flexDirection: "row",
    gap: 3,
  },
  col: {
    gap: 3,
  },
  cell: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: colors.surfaceElevated,
  },
  cellLegend: {
    width: 10,
    height: 10,
  },
  future: {
    opacity: 0.3,
  },
  active: {
    backgroundColor: colors.accent,
  },
  today: {
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "flex-end",
    marginTop: spacing.xs,
  },
  legendText: {
    color: colors.textDim,
    fontSize: 11,
  },
});
