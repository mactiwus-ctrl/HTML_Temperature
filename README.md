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

## Windows Permission Setup

Run all commands in **PowerShell (Administrator)**.

### 1. Allow S7 Traffic Through Firewall

```powershell
New-NetFirewallRule -DisplayName "Allow S7 PLC (port 102)" `
  -Direction Inbound -Protocol TCP -LocalPort 102 -Action Allow

New-NetFirewallRule -DisplayName "Allow S7 PLC Outbound (port 102)" `
  -Direction Outbound -Protocol TCP -RemotePort 102 -Action Allow
```

To verify:

```powershell
Get-NetFirewallRule -DisplayName "Allow S7*" | Format-Table DisplayName, Enabled, Direction
```

### 2. Set Static IP on Network Adapter

Find your adapter name first:

```powershell
Get-NetAdapter | Format-Table Name, Status, InterfaceDescription
```

Then set the static IP (replace `"Ethernet"` with your adapter name):

```powershell
New-NetIPAddress -InterfaceAlias "Ethernet" `
  -IPAddress 172.16.0.17 -PrefixLength 24 -DefaultGateway 172.16.0.1

Set-DnsClientServerAddress -InterfaceAlias "Ethernet" `
  -ServerAddresses ("8.8.8.8","8.8.4.4")
```

To verify connectivity to PLC:

```powershell
Test-NetConnection -ComputerName 192.168.10.254 -Port 102
```

### 3. Run Node.js as Administrator

If `npm` commands fail with permission errors:

```powershell
# Open elevated PowerShell
Start-Process powershell -Verb RunAs

# Or allow execution policy for scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Setup (Linux / macOS)

```bash
chmod +x setup.sh
./setup.sh
```

## Setup (Windows)

```powershell
npm install
npm run build
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
