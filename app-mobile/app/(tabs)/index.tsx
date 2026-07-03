import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Viaje = {
  success: boolean;
  mensaje: string;
  pasajero: string;
  origen: string;
  destino: string;
  tipoPago: string;
  conductorAsignado: {
    nombre: string;
    auto: string;
    placas: string;
  };
  distanciaKm: number;
  tiempoEstimadoLlegadaMin: number;
};

export default function HomeScreen() {
  const [input, setInput] = useState(
    "Hola soy Mike, necesito un taxi desde Plaza Río hasta CESUN Universidad y voy a pagar en efectivo"
  );
  const [loading, setLoading] = useState(false);
  const [viaje, setViaje] = useState<Viaje | null>(null);

  const WEBHOOK_URL =
  "http://192.168.1.74:5678/webhook/845f8be5-caff-492d-ad91-0a48becdccad";

  const solicitarViaje = async () => {
    if (!input.trim()) {
      Alert.alert("Campo requerido", "Escribe una solicitud de viaje.");
      return;
    }

    try {
      setLoading(true);
      setViaje(null);

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input,
          sessionId: "usuario_app_001",
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await response.json();
      const resultado = Array.isArray(data) ? data[0] : data;
      setViaje(resultado);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error de conexión",
        "No se pudo conectar con n8n. Revisa la IP, el puerto 5678 y que el workflow esté activo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.brand}>Taxi IA</Text>
          <Text style={styles.subtitle}>
            Solicita un viaje con inteligencia artificial
          </Text>
        </View>

        <View style={styles.mainCard}>
          <Text style={styles.sectionTitle}>¿A dónde vamos?</Text>

          <View style={styles.routeBox}>
            <View style={styles.routeRow}>
              <View style={styles.dotOrigin} />
              <Text style={styles.routeLabel}>Solicitud</Text>
            </View>

            <TextInput
              style={styles.input}
              multiline
              value={input}
              onChangeText={setInput}
              editable={!loading}
              placeholder="Ej. Hola soy Mike, necesito un taxi desde Plaza Río hasta CESUN Universidad y voy a pagar en efectivo"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={solicitarViaje}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingInline}>
                <ActivityIndicator color="#000" />
                <Text style={styles.buttonText}> Buscando conductor...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Solicitar viaje</Text>
            )}
          </TouchableOpacity>
        </View>

        {viaje && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Viaje confirmado</Text>
              <Text style={styles.resultBadge}>LISTO</Text>
            </View>

            <View style={styles.infoGroup}>
              <Text style={styles.groupTitle}>Pasajero</Text>
              <Text style={styles.groupText}>{viaje.pasajero}</Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.tripSection}>
              <View style={styles.routeLineContainer}>
                <View style={styles.dotOriginBig} />
                <View style={styles.line} />
                <View style={styles.dotDestinationBig} />
              </View>

              <View style={styles.tripDetails}>
                <View style={styles.locationBlock}>
                  <Text style={styles.locationLabel}>Origen</Text>
                  <Text style={styles.locationValue}>{viaje.origen}</Text>
                </View>

                <View style={styles.locationBlock}>
                  <Text style={styles.locationLabel}>Destino</Text>
                  <Text style={styles.locationValue}>{viaje.destino}</Text>
                </View>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Método de pago</Text>
              <Text style={styles.infoValue}>{viaje.tipoPago}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Distancia</Text>
              <Text style={styles.infoValue}>{viaje.distanciaKm} km</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tiempo estimado</Text>
              <Text style={styles.infoValue}>
                {viaje.tiempoEstimadoLlegadaMin} min
              </Text>
            </View>

            <View style={styles.separator} />

            <Text style={styles.driverTitle}>Tu conductor</Text>

            <View style={styles.driverCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {viaje.conductorAsignado?.nombre?.charAt(0) || "C"}
                </Text>
              </View>

              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>
                  {viaje.conductorAsignado?.nombre}
                </Text>
                <Text style={styles.driverCar}>
                  {viaje.conductorAsignado?.auto}
                </Text>
                <Text style={styles.driverPlate}>
                  Placas: {viaje.conductorAsignado?.placas}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0B0B0B",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  brand: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  subtitle: {
    color: "#A1A1AA",
    fontSize: 15,
    marginTop: 6,
  },
  mainCard: {
    backgroundColor: "#111111",
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1F1F1F",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  routeBox: {
    backgroundColor: "#18181B",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#27272A",
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dotOrigin: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    marginRight: 10,
  },
  routeLabel: {
    color: "#D4D4D8",
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    minHeight: 120,
    color: "#FFFFFF",
    fontSize: 16,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 18,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "800",
  },
  loadingInline: {
    flexDirection: "row",
    alignItems: "center",
  },
  resultCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultTitle: {
    color: "#111111",
    fontSize: 26,
    fontWeight: "800",
  },
  resultBadge: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "800",
  },
  infoGroup: {
    marginTop: 18,
  },
  groupTitle: {
    color: "#71717A",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  groupText: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 18,
  },
  tripSection: {
    flexDirection: "row",
  },
  routeLineContainer: {
    width: 24,
    alignItems: "center",
    marginRight: 12,
    marginTop: 4,
  },
  dotOriginBig: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: "#111111",
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: "#D4D4D8",
    marginVertical: 4,
  },
  dotDestinationBig: {
    width: 12,
    height: 12,
    borderRadius: 4,
    backgroundColor: "#111111",
  },
  tripDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  locationBlock: {
    marginBottom: 16,
  },
  locationLabel: {
    color: "#71717A",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },
  locationValue: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "700",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoLabel: {
    color: "#71717A",
    fontSize: 15,
    fontWeight: "600",
  },
  infoValue: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "700",
  },
  driverTitle: {
    color: "#111111",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 14,
  },
  driverCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F5",
    borderRadius: 18,
    padding: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "800",
  },
  driverCar: {
    color: "#52525B",
    fontSize: 15,
    marginTop: 4,
  },
  driverPlate: {
    color: "#27272A",
    fontSize: 14,
    marginTop: 4,
    fontWeight: "600",
  },
});