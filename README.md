# NetMedic – AI Network Operations Demo

A fully interactive frontend prototype for an AI-assisted network monitoring, diagnosis, and autonomous recovery platform.

> **Frontend only.** No backend, database, real AI, or network integration. All data is mock/simulated.

---

## Quick Start

```bash
# 1. Navigate to the project folder
cd "NetMedic Demo"

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will open at **http://localhost:3000**

**Demo login credentials:**
- Email: `admin@netmedic.demo`
- Password: `demo1234`

---

## Interactive Demo Workflow

Follow these steps to see the full AI-assisted recovery cycle:

| Step | Action | Location |
|------|--------|----------|
| 1 | Click **"Simulate Network Issue"** | Dashboard |
| 2 | Click **"Run Network Diagnosis"** | AI Diagnosis |
| 3 | Review root cause and evidence | AI Diagnosis |
| 4 | Click **"Approve & Execute"** | Recovery Center |
| 5 | View before/after metrics | Recovery Center |
| 6 | Click **"Generate Recovery Report"** | Reports |
| 7 | Click **"Reset Demo"** to restore | Dashboard |

---

## Pages

| Page | Description |
|------|-------------|
| Dashboard | Live stats, charts, recent incidents, activity feed |
| Network Monitoring | Device table, link monitoring, VLAN monitoring |
| Network Topology | Interactive SVG topology with pan/zoom |
| Packet Tracer Projects | File upload simulation, project management |
| AI Diagnosis | Animated diagnosis workflow, root cause analysis |
| Recovery Center | Recovery execution, before/after comparison |
| Reports | Report generation, PDF/CSV export |
| Alerts & Incidents | Incident management, status updates, notes |
| Settings | All preferences with live toggle controls |

---

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- Recharts
- Lucide React
- React Router 6

---

## Project Structure

```
src/
├── App.tsx                   # Root router + auth gate
├── context/DemoContext.tsx   # Shared demo workflow state
├── data/                     # All mock datasets
├── pages/                    # One file per page
├── components/
│   ├── layout/               # Sidebar, Topbar, AppLayout
│   └── ui/                   # Button, Card, Badge, Modal, Toast…
├── types/index.ts            # All TypeScript interfaces
└── utils/                    # cn(), format helpers
```

---

## Notes

- This prototype runs entirely in the browser. No server calls are made.
- All network metrics, incidents, diagnosis results, and recovery actions are pre-programmed demo data.
- File uploads store metadata in React state only — no files leave the browser.
- Reports can be downloaded as `.txt` or `.csv` from the browser.
