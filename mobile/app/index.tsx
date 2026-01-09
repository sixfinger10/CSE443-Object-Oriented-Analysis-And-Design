import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getStoredAuth } from "@/lib/auth";

export default function Index() {
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const auth = await getStoredAuth();
      setHref(auth ? "/(drawer)/(tabs)/dashboard" : "/(auth)/login");
    })();
  }, []);

  if (!href) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Redirect href={href as any} />;
}

