// app/(auth)/forgot-password.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { router } from "expo-router";
import { apiPostJson } from "@/lib/api";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendReset = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Email is required");
      return;
    }

    try {
      setLoading(true);

      const json: any = await apiPostJson("/api/auth/forgot-password", {
        email: email.trim(),
      });

      if (json?.success === false) {
        Alert.alert("Failed", json?.message || "Request failed");
        return;
      }

      Alert.alert("Success", json?.message || "Reset code/link sent", [
        {
          text: "Continue",
          onPress: () =>
            router.push(`/(auth)/reset-password?email=${encodeURIComponent(email.trim())}`),
        },
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
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>We’ll send you a reset code/link</Text>

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.button} onPress={sendReset} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Sending..." : "Send Reset"}</Text>
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

