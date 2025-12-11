import { Stack, usePathname, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "../components/context/auth-context";

function RootLayoutNav() {
  const { user, isInitializing } = useAuth();
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Esperar a que se complete la inicialización antes de hacer redirecciones
    if (!mounted || isInitializing) return;

    const isAuthenticated = !!user?.token;
    const isPublicRoute =
      pathname === "/login" ||
      pathname === "/" ||
      pathname === "/registro";
    
    // Si no hay token válido, forzar al login
    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/login");
    } else if (isAuthenticated && isPublicRoute) {
      router.replace("/(tabs)");
    }
  }, [user, pathname, router, mounted, isInitializing]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
