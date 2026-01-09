import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { apiDelete } from "@/lib/api";
import { clearStoredAuth, getStoredAuth, getUserIdOrDefault } from "@/lib/auth";

export default function SettingsScreen() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [syncDevices, setSyncDevices] = useState(true);
  const [showRecent, setShowRecent] = useState(true);

  const [profile, setProfile] = useState({ username: "—", email: "—" });
  const [userId, setUserId] = useState<number>(1);

  /* 🔹 Mock personal info */
  const [firstName, setFirstName] = useState("Sarah");
  const [lastName, setLastName] = useState("Johnson");
  const [bio, setBio] = useState("An enthusiastic reader and movie buff");

  useEffect(() => {
    (async () => {
      const auth = await getStoredAuth();
      setProfile({
        username: auth?.username || "—",
        email: auth?.email || "—",
      });
      setUserId(await getUserIdOrDefault(1));
    })();
  }, []);

  const signOut = async () => {
    await clearStoredAuth();
    router.replace("/(auth)/login");
  };

  const deleteAccount = async () => {
    Alert.alert("Delete Account", "This action is permanent. Continue?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await apiDelete(`/api/auth/delete-account/${userId}`);
            await clearStoredAuth();
            router.replace("/(auth)/login");
          } catch {
            Alert.alert("Error", "Delete account failed");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile Settings</Text>

      {/* Profile Card */}
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(profile.username || "U").slice(0, 2).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{profile.username}</Text>
        <Text style={styles.email}>{profile.email}</Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={signOut}>
          <Text style={styles.primaryText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Profile Stats (mock) */}
        <View style={styles.profileStats}>
          <ProfileStat label="Total Items" value="248" />
          <ProfileStat label="Favorites" value="42" />
          <ProfileStat label="Lists" value="3" />
        </View>
      </View>

      {/* Personal Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.row}>
          <Input label="First Name" value={firstName} onChange={setFirstName} />
          <Input label="Last Name" value={lastName} onChange={setLastName} />
        </View>

        <Input label="Username" value={profile.username} />
        <Input label="Email Address" value={profile.email} />

        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>Bio</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={3}
            style={[styles.input, { height: 80 }]}
          />
          <Text style={styles.helperText}>Brief description for your profile</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryText}>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn}>
            <Text style={styles.secondaryText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Preferences (existing – untouched) */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <Toggle label="Enable email notifications" value={emailNotif} onChange={setEmailNotif} />
        <Toggle label="Automatically sync data across devices" value={syncDevices} onChange={setSyncDevices} />
        <Toggle label="Show recently added items on dashboard" value={showRecent} onChange={setShowRecent} />
      </View>

      {/* Danger Zone (existing – untouched) */}
      <View style={styles.danger}>
        <Text style={styles.dangerTitle}>Danger Zone</Text>
        <Text style={styles.dangerText}>
          Deleting your account is permanent and cannot be undone.
        </Text>

        <TouchableOpacity style={styles.deleteBtn} onPress={deleteAccount}>
          <Text style={styles.deleteText}>Delete My Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* =========================
   Small Components
========================= */

function Toggle({ label, value, onChange }: any) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleText}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Input({ label, value, onChange }: any) {
  return (
    <View style={{ flex: 1, marginBottom: 12 }}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput value={value} onChangeText={onChange} style={styles.input} />
    </View>
  );
}

/* =========================
   Styles
========================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB", padding: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#6A7DFF",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 18 },
  name: { textAlign: "center", fontWeight: "600", marginTop: 8 },
  email: { textAlign: "center", fontSize: 12, color: "#666" },

  profileStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  statItem: { alignItems: "center" },
  statValue: { fontWeight: "700", fontSize: 16 },
  statLabel: { fontSize: 12, color: "#666" },

  sectionTitle: { fontWeight: "600", marginBottom: 12 },

  row: { flexDirection: "row", gap: 12 },

  inputLabel: { fontSize: 12, marginBottom: 4, color: "#444" },
  input: {
    backgroundColor: "#F6F7FB",
    borderRadius: 8,
    padding: 10,
  },
  helperText: { fontSize: 11, color: "#888", marginTop: 4 },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  primaryBtn: {
    backgroundColor: "#6A7DFF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  primaryText: { color: "#fff", fontWeight: "700" },

  secondaryBtn: {
    backgroundColor: "#EEE",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
  secondaryText: { fontWeight: "600" },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  toggleText: { flex: 1, marginRight: 12 },

  danger: {
    backgroundColor: "#FDECEA",
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  dangerTitle: { fontWeight: "700", color: "#C62828", marginBottom: 6 },
  dangerText: { fontSize: 12, color: "#C62828", marginBottom: 12 },
  deleteBtn: {
    borderWidth: 1,
    borderColor: "#C62828",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  deleteText: { color: "#C62828", fontWeight: "700" },
});

