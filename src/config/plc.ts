// Central PLC configuration — edit IPs and settings here
export const PLC_CONFIG = {
  host: "192.168.10.254",
  port: 102,
  rack: 0,
  slot: 2,
  timeout: 3000,
} as const;

export const PLC_VARIABLES = {
  temperature: "DB1,REAL0", // VM1 as REAL (32-bit float)
} as const;

export const PLC_DISPLAY = {
  name: "Siemens LOGO! 8.4",
  address: "VM1 (DB1,REAL0)",
  pollIntervalMs: 2000,
} as const;
