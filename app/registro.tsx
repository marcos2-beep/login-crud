import { API_URL } from "@/constants/config";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    if (!email || !password) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const contentType = response.headers.get("content-type") || "";
      let json = null;

      if (contentType.includes("application/json")) {
        try {
          json = await response.json();
        } catch {
          json = null;
        }
      }

      //Si email ya existe
      if (response.status === 409) {
        return Alert.alert("Correo en uso", "Este correo ya está registrado.");
      }

      // contraseña debe ser de 6 dígitos mínimo
      if (password.length < 6) {
        Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
        return;
      }

      //Cualquier otro error
      if (!response.ok) {
        return Alert.alert(
          "Error",
          json?.error || json?.message || "No se pudo crear la cuenta."
        );
      }

      Alert.alert("Éxito", "Cuenta creada correctamente.", [
        { text: "Ir a Login", onPress: () => router.push("/login") },
      ]);
    } catch {
      return Alert.alert(
        "Error de conexión",
        "No se pudo conectar con el servidor. Intenta nuevamente."
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarme</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#6366f1",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#3b82f6",
    fontWeight: "500",
  },
});
