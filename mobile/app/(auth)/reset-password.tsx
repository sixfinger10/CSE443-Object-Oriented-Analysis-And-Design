// app/(auth)/reset-password.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, router } from "expo-router";
import { useMemo, useState } from "react";
import { apiPostJson } from "@/lib/api";

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams();
  const initialEmail = useMemo(() => String(params.email || "").trim(), [params.email]);

  const [email, setEmail] = useState(initialEmail);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = async () => {
    if (!email.trim() || !resetCode.trim() || !newPassword) {
      Alert.alert("Error", "Email, code and new password are required");
      return;
    }
    if (newPassword !== confirm) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const json: any = await apiPostJson("/api/auth/reset-password", {
        email: email.trim(),
        resetCode: resetCode.trim(),
        newPassword,
      });

      if (json?.success === false) {
        Alert.alert("Failed", json?.message || "Reset failed");
        return;
      }

      Alert.alert("Success", json?.message || "Password updated", [
        { text: "Go to Login", onPress: () => router.replace("/(auth)/login") },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#6A7DFF", "#7F5AC8"]} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter the code you received</Text>

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Reset Code"
          autoCapitalize="none"
          value={resetCode}
          onChangeText={setResetCode}
        />

        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />

        <TouchableOpacity style={styles.button} onPress={reset} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Updating..." : "Update Password"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.replace("/(auth)/login")}>
          <Text style={styles.secondaryText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { width: "88%", backgroundColor: "#fff", borderRadius: 16, padding: 24, elevation: 10 },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 6 },
  subtitle: { fontSize: 13, color: "#666", textAlign: "center", marginBottom: 18 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 14, marginBottom: 12 },
  button: { backgroundColor: "#6A7DFF", paddingVertical: 14, borderRadius: 10, alignItems: "center", marginTop: 4 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  secondaryButton: { borderWidth: 1, borderColor: "#6A7DFF", paddingVertical: 12, borderRadius: 10, alignItems: "center", marginTop: 10 },
  secondaryText: { color: "#6A7DFF", fontWeight: "600" },
});

