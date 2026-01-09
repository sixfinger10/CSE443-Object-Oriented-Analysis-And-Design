// app/(auth)/register.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { router } from "expo-router";

import { apiPostJson } from "@/lib/api";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = () => {
    if (password.length < 6) return "Weak";
    if (password.length < 10) return "Medium";
    return "Strong";
  };

  const strengthColor = {
    Weak: "#ff4d4d",
    Medium: "#ffb020",
    Strong: "#2ecc71",
  }[getPasswordStrength()];

  const handleRegister = async () => {
    if (!email || !username || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const json: any = await apiPostJson("/api/auth/signup", {
        email,
        username,
        password,
      });

      if (json?.success === false) {
        Alert.alert("Registration Failed", json?.message || "Failed");
        return;
      }

      Alert.alert("Success", "Account created successfully", [
        { text: "OK", onPress: () => router.replace("/(auth)/login") },
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
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join PLMS to manage your library</Text>

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.strengthRow}>
          <View style={[styles.strengthBar, { backgroundColor: strengthColor }]} />
          <Text style={[styles.strengthText, { color: strengthColor }]}>
            {getPasswordStrength()} password
          </Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? "Creating..." : "Create Account"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text style={styles.secondaryText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { width: "88%", backgroundColor: "#fff", borderRadius: 16, padding: 24, elevation: 10 },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 14, marginBottom: 12 },
  strengthRow: { marginBottom: 12 },
  strengthBar: { height: 5, borderRadius: 5, marginBottom: 4 },
  strengthText: { fontSize: 12 },
  button: { backgroundColor: "#6A7DFF", paddingVertical: 14, borderRadius: 10, alignItems: "center", marginTop: 4 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  secondaryButton: { borderWidth: 1, borderColor: "#6A7DFF", paddingVertical: 12, borderRadius: 10, alignItems: "center", marginTop: 10 },
  secondaryText: { color: "#6A7DFF", fontWeight: "600" },
});

