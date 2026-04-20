# PLC Temperature Monitor

Next.js dashboard that reads temperature from **Siemens LOGO! 8.4** PLC via S7 protocol.

## PLC Configuration

| Parameter | Value |
|-----------|-------|
| PLC | Siemens LOGO! 8.4 |
| IP | 192.168.10.254 |
| Network | 172.16.0.17/24 |
| Protocol | S7 (port 102) |
| Rack / Slot | 0 / 2 |
| Address | VM1 → DB1,REAL0 |

## Setup

```bash
chmod +x setup.sh
./setup.sh
```

## Run

```bash
npm run dev      # development
npm run build    # production build
npm run start    # production server
```

Open http://localhost:3000

## How it works

- **API route** (`/api/temperature`) connects to PLC via `nodes7` (S7 protocol)
- **Frontend** polls the API every 2 seconds and displays temperature with color coding
- Green (≤30°C) → Amber (30-40°C) → Red (>40°C)
