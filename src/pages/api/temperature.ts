import type { NextApiRequest, NextApiResponse } from "next";

const nodes7 = require("nodes7");

const PLC_CONFIG = {
  host: "192.168.10.254",   // LOGO! 8.4 IP
  port: 102,
  rack: 0,
  slot: 2,                  // LOGO! uses slot 2
  timeout: 3000,
};

// LOGO! VM1 maps to DB1.DBW0 in S7 protocol
const PLC_VARIABLES = {
  temperature: "DB1,REAL0", // VM1 as REAL (32-bit float)
};

function readFromPLC(): Promise<{ temperature: number; timestamp: string }> {
  return new Promise((resolve, reject) => {
    const conn = new nodes7();

    conn.initiateConnection(
      {
        host: PLC_CONFIG.host,
        port: PLC_CONFIG.port,
        rack: PLC_CONFIG.rack,
        slot: PLC_CONFIG.slot,
        timeout: PLC_CONFIG.timeout,
      },
      (err: Error | undefined) => {
        if (err) {
          return reject(new Error(`PLC connection failed: ${err.message}`));
        }

        conn.setTranslationCB((tag: string) => PLC_VARIABLES[tag as keyof typeof PLC_VARIABLES]);
        conn.addItems(Object.keys(PLC_VARIABLES));

        conn.readAllItems((readErr: Error | undefined, values: Record<string, number>) => {
          conn.dropConnection();
          if (readErr) {
            return reject(new Error(`PLC read failed: ${readErr.message}`));
          }
          resolve({
            temperature: values.temperature ?? 0,
            timestamp: new Date().toISOString(),
          });
        });
      }
    );
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = await readFromPLC();
    res.status(200).json(data);
  } catch (error: any) {
    console.error("PLC Error:", error.message);
    res.status(500).json({
      error: "Failed to read PLC",
      detail: error.message,
      temperature: null,
      timestamp: new Date().toISOString(),
    });
  }
}
