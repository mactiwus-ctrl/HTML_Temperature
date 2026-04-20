"use client";

import { useEffect, useState } from "react";
import { PLC_CONFIG, PLC_DISPLAY } from "@/config/plc";

interface TempData {
  temperature: number | null;
  timestamp: string;
  error?: string;
}

export default function Home() {
  const [data, setData] = useState<TempData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTemp = async () => {
    try {
      const res = await fetch("/api/temperature");
      const json = await res.json();
      setData(json);
    } catch {
      setData({ temperature: null, timestamp: new Date().toISOString(), error: "Fetch failed" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemp();
    const interval = setInterval(fetchTemp, PLC_DISPLAY.pollIntervalMs);
    return () => clearInterval(interval);
  }, []);

  const temp = data?.temperature;
  const tempColor =
    temp === null || temp === undefined
      ? "#888"
      : temp > 40
        ? "#ef4444"
        : temp > 30
          ? "#f59e0b"
          : "#22c55e";

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🌡️ PLC Temperature Monitor</h1>
        <p style={styles.subtitle}>{PLC_DISPLAY.name} — VM1 @ {PLC_CONFIG.host}</p>

        <div style={{ ...styles.tempBox, borderColor: tempColor }}>
          {loading ? (
            <span style={styles.loading}>Connecting...</span>
          ) : temp !== null && temp !== undefined ? (
            <span style={{ ...styles.tempValue, color: tempColor }}>
              {temp.toFixed(1)} °C
            </span>
          ) : (
            <span style={styles.error}>
              {data?.error || "No data"}
            </span>
          )}
        </div>

        {data?.timestamp && (
          <p style={styles.timestamp}>
            Last update: {new Date(data.timestamp).toLocaleTimeString()}
          </p>
        )}

        {data?.error && (
          <p style={styles.errorDetail}>⚠️ {data.error}</p>
        )}

        <div style={styles.info}>
          <p><strong>PLC:</strong> {PLC_DISPLAY.name}</p>
          <p><strong>IP:</strong> {PLC_CONFIG.host}</p>
          <p><strong>Address:</strong> {PLC_DISPLAY.address}</p>
          <p><strong>Poll:</strong> every {PLC_DISPLAY.pollIntervalMs / 1000} seconds</p>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    fontFamily: "system-ui, sans-serif",
    padding: 20,
  },
  card: {
    background: "#1e293b",
    borderRadius: 16,
    padding: 40,
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    maxWidth: 420,
    width: "100%",
    border: "1px solid #334155",
  },
  title: {
    color: "#f8fafc",
    fontSize: 24,
    margin: "0 0 8px",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 14,
    margin: "0 0 30px",
  },
  tempBox: {
    border: "3px solid",
    borderRadius: 12,
    padding: "30px 20px",
    margin: "0 0 20px",
    background: "#0f172a",
  },
  tempValue: {
    fontSize: 56,
    fontWeight: 700,
  },
  loading: {
    color: "#64748b",
    fontSize: 20,
  },
  error: {
    color: "#f87171",
    fontSize: 18,
  },
  errorDetail: {
    color: "#fbbf24",
    fontSize: 13,
    margin: "8px 0 16px",
  },
  timestamp: {
    color: "#64748b",
    fontSize: 13,
    margin: "0 0 20px",
  },
  info: {
    textAlign: "left" as const,
    color: "#94a3b8",
    fontSize: 13,
    background: "#0f172a",
    borderRadius: 8,
    padding: 16,
  },
};
