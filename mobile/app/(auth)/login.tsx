import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";

import { apiPostJson } from "@/lib/api";
import { setStoredAuth } from "@/lib/auth";

function extractFromData(json: any) {
  const d = json?.data ?? {};
  const u = d.user ?? {};

  const userId = Number(u.id);
  const token =
    d.token ??
    d.accessToken ??
    d.jwt;

  return {
    userId: Number.isFinite(userId) && userId > 0 ? userId : null,
    username: u.username ?? null,
    email: u.email ?? null,
    token,
  };
}

export default function LoginScreen() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!usernameOrEmail || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const json: any = await apiPostJson("/api/auth/signin", {
        usernameOrEmail,
        password,
      });

      console.log("LOGIN RESPONSE", JSON.stringify(json, null, 2));

      if (json?.success !== true) {
        Alert.alert("Login Failed", json?.message || "Invalid credentials");
        return;
      }

      const { userId, token, username, email } = extractFromData(json);

      if (!userId) {
        console.error("LOGIN RESPONSE:", json);
        Alert.alert(
          "Login Failed",
          "Server did not return user information."
        );
        return;
      }

      await setStoredAuth({
        userId,
        token,
        username,
        email,
      });

      router.replace("/(drawer)/(tabs)/dashboard");
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#6A7DFF", "#7F5AC8"]} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <TextInput
          placeholder="Username or Email"
          placeholderTextColor="#999"
          style={styles.input}
          value={usernameOrEmail}
          onChangeText={setUsernameOrEmail}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Signing In..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Don’t have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => router.push("/(auth)/register")}
          >
            Create Account
          </Text>
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  forgot: {
    color: "#6A7DFF",
    textAlign: "right",
    marginBottom: 20,
    fontSize: 13,
  },
  button: {
    backgroundColor: "#6A7DFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  footer: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 13,
    color: "#666",
  },
  link: {
    color: "#6A7DFF",
    fontWeight: "600",
  },
});

