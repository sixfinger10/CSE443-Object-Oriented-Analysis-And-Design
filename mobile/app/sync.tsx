import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useState } from "react";

export default function SyncScreen() {
  const [autoSync, setAutoSync] = useState(true);
  const [syncOnMobile, setSyncOnMobile] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sync Status</Text>
      <Text style={styles.subtitle}>
        Keep your library synchronized across all your devices
      </Text>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerCheck}>✓</Text>
        <Text style={styles.bannerTitle}>All Synced!</Text>
        <Text style={styles.bannerSub}>
          Your library is up to date across all devices
        </Text>
        <Text style={styles.bannerSmall}>Last synced: 5 minutes ago</Text>

        <TouchableOpacity style={styles.bannerBtn}>
          <Text style={styles.bannerBtnText}>Sync Now</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard value="3" label="Connected Devices" />
        <StatCard value="248" label="Items Synced" />
        <StatCard value="5m" label="Last Sync" />
        <StatCard value="0" label="Conflicts" />
      </View>

      {/* Devices */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Connected Devices</Text>

        <DeviceRow
          name="MacBook Pro"
          detail="macOS • Chrome"
          status="This device"
          highlight
        />
        <DeviceRow name="Work Laptop" detail="Windows • Edge" status="Synced" />
        <DeviceRow name="iPhone 15 Pro" detail="iOS • Safari" status="Yesterday" />
      </View>

      {/* Settings */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Sync Settings</Text>

        <Toggle
          label="Automatic Sync"
          value={autoSync}
          onChange={setAutoSync}
        />
        <Toggle
          label="Sync on Mobile Data"
          value={syncOnMobile}
          onChange={setSyncOnMobile}
        />

        <SettingRow label="Conflict Resolution" value="Keep newest version" />
        <SettingRow label="Sync Interval" value="Every 5 minutes" />
      </View>

      {/* Activity */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Recent Sync Activity</Text>

        <ActivityRow time="5 minutes ago" text="Automatic sync completed" />
        <ActivityRow time="2 hours ago" text="Synced from Work Laptop" />
        <ActivityRow time="Yesterday at 9:35 PM" text="Automatic sync completed" />
        <ActivityRow time="6 days ago" text="Conflict resolved (newest version kept)" />
      </View>
    </ScrollView>
  );
}

/* ───────── Components ───────── */

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function DeviceRow({
  name,
  detail,
  status,
  highlight = false,
}: {
  name: string;
  detail: string;
  status: string;
  highlight?: boolean;
}) {
  return (
    <View style={[styles.deviceRow, highlight && styles.deviceHighlight]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.deviceName}>{name}</Text>
        <Text style={styles.deviceDetail}>{detail}</Text>
      </View>
      <View style={styles.deviceBadge}>
        <Text style={styles.deviceBadgeText}>{status}</Text>
      </View>
    </View>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleText}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Text style={styles.settingValue}>{value}</Text>
    </View>
  );
}

function ActivityRow({ time, text }: { time: string; text: string }) {
  return (
    <View style={styles.activityRow}>
      <Text style={styles.activityTime}>{time}</Text>
      <Text style={styles.activityText}>{text}</Text>
    </View>
  );
}

/* ───────── Styles ───────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 16,
  },

  banner: {
    backgroundColor: "#6A7DFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  bannerCheck: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  bannerSub: {
    color: "#E9ECFF",
    fontSize: 12,
    marginTop: 4,
  },
  bannerSmall: {
    color: "#E9ECFF",
    fontSize: 12,
    marginTop: 10,
  },
  bannerBtn: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 12,
  },
  bannerBtnText: {
    color: "#6A7DFF",
    fontWeight: "700",
  },

  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: 12,
  },

  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  deviceHighlight: {
    backgroundColor: "#E8F7EC",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  deviceName: {
    fontWeight: "600",
  },
  deviceDetail: {
    fontSize: 12,
    color: "#666",
  },
  deviceBadge: {
    backgroundColor: "#EEF0FF",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  deviceBadgeText: {
    fontSize: 12,
    color: "#6A7DFF",
    fontWeight: "600",
  },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  toggleText: {
    flex: 1,
    marginRight: 12,
  },

  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  settingLabel: {
    color: "#555",
  },
  settingValue: {
    color: "#6A7DFF",
    fontWeight: "600",
  },

  activityRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  activityTime: {
    fontSize: 12,
    color: "#6A7DFF",
    fontWeight: "600",
    marginBottom: 2,
  },
  activityText: {
    fontSize: 12,
    color: "#555",
  },
});

