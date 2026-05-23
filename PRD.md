# PRD — MiMo DePIN Node Copilot

**Project:** MiMo DePIN Node Copilot  
**Status:** MVP  
**Last Updated:** 2026-05-23  
**Owner:** Ujang Ewok

---

## 1. Overview

**MiMo DePIN Node Copilot** adalah AI assistant yang membantu user install, debug, dan monitor node DePIN (Decentralized Physical Infrastructure Network) melalui analisis log terminal real-time.

**Problem:** Node operators kesulitan troubleshoot error, setup automation, dan track health node. Proses manual = lambat, error-prone, dan butuh expertise tinggi.

**Solution:** Paste error log → AI analisis → actionable fix + automation commands + health checklist.

---

## 2. MVP Scope

### 2.1 Core Features

| Feature | Description | Priority |
|---------|-------------|----------|
| **Log Analyzer** | Paste error log VPS/node → MiMo identify root cause | P0 |
| **Fix Generator** | Generate shell commands untuk fix error | P0 |
| **Health Checklist** | Auto-generate checklist untuk node health | P0 |
| **Automation Generator** | Generate systemd/pm2/docker commands | P0 |
| **History Tracker** | Simpan riwayat node (error, fix, timestamp) | P1 |
| **Node Registry** | Manage multiple nodes (name, IP, type) | P1 |

### 2.2 User Flows

#### Flow 1: Error Diagnosis & Fix
```
User paste error log
  ↓
MiMo analyze (Groq/MiMo API)
  ↓
Display:
  - Root cause (1-2 sentences)
  - Severity (Critical/High/Medium/Low)
  - Recommended fix (step-by-step)
  - Shell commands (copy-paste ready)
  ↓
User execute commands
  ↓
Paste new log (optional)
  ↓
Confirm fix worked → Save to history
```

#### Flow 2: Health Check
```
User request health checklist
  ↓
MiMo generate checklist based on node type
  ↓
Display:
  - System resources (CPU, RAM, disk)
  - Network connectivity
  - Process status
  - Log warnings
  ↓
User run checklist commands
  ↓
Paste output → MiMo analyze health score
```

#### Flow 3: Automation Setup
```
User select node type (Zcash, Filecoin, etc.)
  ↓
User select process manager (systemd/pm2/docker)
  ↓
MiMo generate config + startup script
  ↓
User copy-paste → deploy
  ↓
Save config to history
```

---

## 3. Technical Requirements

### 3.1 Stack
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend:** Next.js API routes
- **AI:** Groq (Llama 3.3 70B, free tier) + MiMo fallback
- **Storage:** localStorage (client-side) + optional Supabase (future)
- **Deployment:** Netlify

### 3.2 API Integration
- **Groq API:** Free tier (30 RPM) for log analysis
- **MiMo API:** Fallback + premium features (if available)

### 3.3 Data Model

#### Node
```typescript
interface Node {
  id: string;
  name: string;
  type: "zcash" | "filecoin" | "arweave" | "other";
  ip: string;
  port?: number;
  processManager: "systemd" | "pm2" | "docker";
  createdAt: Date;
  lastHealthCheck?: Date;
}
```

#### AnalysisResult
```typescript
interface AnalysisResult {
  nodeId: string;
  logInput: string;
  rootCause: string;
  severity: "critical" | "high" | "medium" | "low";
  recommendedFix: string[];
  commands: string[];
  timestamp: Date;
}
```

#### HealthCheckResult
```typescript
interface HealthCheckResult {
  nodeId: string;
  score: number; // 0-100
  checks: {
    cpu: boolean;
    memory: boolean;
    disk: boolean;
    network: boolean;
    process: boolean;
  };
  warnings: string[];
  timestamp: Date;
}
```

---

## 4. UI/UX Design

### 4.1 Pages

#### Dashboard
- List nodes (card view)
- Quick stats: total nodes, health score, recent errors
- CTA: "Add Node", "Analyze Log", "Health Check"

#### Log Analyzer
- Textarea: paste error log
- Button: "Analyze with MiMo"
- Results panel:
  - Root cause (highlighted)
  - Severity badge
  - Recommended fix (step-by-step)
  - Commands (copy button)
  - Save to history

#### Health Checker
- Select node
- Button: "Generate Health Checklist"
- Display checklist (commands to run)
- Paste output → "Analyze Health"
- Health score + warnings

#### Automation Generator
- Select node type
- Select process manager
- Button: "Generate Config"
- Display:
  - systemd service file / pm2 config / docker-compose.yml
  - Startup script
  - Copy buttons

#### History
- Timeline view: all analyses + fixes
- Filter by node, date, severity
- Search by error keyword
- Export as JSON/CSV

#### Node Registry
- Add/edit/delete nodes
- Fields: name, type, IP, port, process manager
- Quick actions: health check, analyze log

### 4.2 UI Components
- **Navbar:** Logo, nav links, settings
- **Sidebar:** Node list (collapsible)
- **Card:** Node info, analysis result
- **Badge:** Severity, status
- **Button:** Primary (CTA), secondary, danger
- **Input:** Text, textarea, select
- **Modal:** Add node, confirm delete
- **Toast:** Success, error, info

---

## 5. MVP Acceptance Criteria

- [ ] User dapat paste error log dan MiMo analyze root cause
- [ ] MiMo generate shell commands untuk fix
- [ ] User dapat generate health checklist
- [ ] User dapat generate systemd/pm2/docker commands
- [ ] History tersimpan di localStorage
- [ ] User dapat manage multiple nodes
- [ ] UI responsive (mobile + desktop)
- [ ] Groq API integration working
- [ ] Deploy ke Netlify tanpa error

---

## 6. Out of Scope (Post-MVP)

- Real-time monitoring dashboard
- Webhook alerts
- Multi-user collaboration
- Database persistence (Supabase)
- Advanced ML model training
- Mobile app (native)
- Slack/Discord integration

---

## 7. Success Metrics

- **Adoption:** 50+ active users dalam 1 bulan
- **Engagement:** Avg 5+ analyses per user per week
- **Satisfaction:** 4.5+ rating (if feedback collected)
- **Performance:** <2s response time untuk analysis

---

## 8. Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **Phase 1: Setup** | 1 day | Project scaffold, design system, API setup |
| **Phase 2: Core** | 3 days | Log analyzer, fix generator, health checker |
| **Phase 3: Features** | 2 days | Automation generator, history, node registry |
| **Phase 4: Polish** | 1 day | UI/UX refinement, testing, deployment |
| **Total** | ~1 week | MVP ready |

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Groq API rate limit (30 RPM) | Slow analysis | Queue system + MiMo fallback |
| Inaccurate AI diagnosis | User frustration | Add confidence score + manual override |
| localStorage limit (5-10MB) | History overflow | Implement pagination + export |
| Node type variations | Generic fixes | Build node-type-specific prompts |

---

## 10. Notes

- Prioritas: **working MVP > perfect architecture**
- Iterasi: Core → features → polish
- Deployment: Netlify (no backend needed for MVP)
- Free tier: Groq 30 RPM sufficient untuk MVP
