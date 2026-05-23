# DESIGN.md — MiMo DePIN Node Copilot

**Project:** MiMo DePIN Node Copilot  
**Status:** MVP Design  
**Last Updated:** 2026-05-23  
**Owner:** Ujang Ewok

---

## 1. Design System

### 1.1 Colors

```css
/* Primary */
--primary: #3b82f6; /* blue-500 */
--primary-dark: #1d4ed8; /* blue-700 */
--primary-light: #93c5fd; /* blue-300 */

/* Secondary */
--secondary: #10b981; /* emerald-500 */
--secondary-dark: #047857; /* emerald-700 */

/* Status */
--success: #10b981; /* emerald-500 */
--warning: #f59e0b; /* amber-500 */
--error: #ef4444; /* red-500 */
--info: #3b82f6; /* blue-500 */

/* Background */
--bg-primary: #ffffff;
--bg-secondary: #f8fafc; /* slate-50 */
--bg-tertiary: #f1f5f9; /* slate-100 */

/* Text */
--text-primary: #0f172a; /* slate-900 */
--text-secondary: #475569; /* slate-600 */
--text-tertiary: #94a3b8; /* slate-400 */

/* Border */
--border: #e2e8f0; /* slate-200 */
--border-dark: #cbd5e1; /* slate-300 */
```

### 1.2 Typography

```css
/* Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;   /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem;  /* 36px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 1.3 Spacing

```css
/* Spacing Scale */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

### 1.4 Shadows

```css
/* Shadows */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```

### 1.5 Border Radius

```css
/* Border Radius */
--radius-sm: 0.25rem;  /* 4px */
--radius: 0.5rem;      /* 8px */
--radius-md: 0.75rem;  /* 12px */
--radius-lg: 1rem;     /* 16px */
--radius-xl: 1.5rem;   /* 24px */
--radius-full: 9999px;
```

---

## 2. Component Library

### 2.1 Button

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

// Variants:
// primary: bg-primary text-white hover:bg-primary-dark
// secondary: bg-secondary text-white hover:bg-secondary-dark
// danger: bg-error text-white hover:bg-error-dark
// ghost: bg-transparent text-primary border border-border hover:bg-bg-secondary

// Sizes:
// sm: px-3 py-1.5 text-sm
// md: px-4 py-2 text-base
// lg: px-6 py-3 text-lg
```

### 2.2 Card

```tsx
interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'bordered' | 'shadow';
}

// Variants:
// default: bg-bg-primary
// bordered: border border-border
// shadow: shadow-md
```

### 2.3 Badge

```tsx
interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  children: React.ReactNode;
}

// Variants:
// success: bg-green-100 text-green-800
// warning: bg-yellow-100 text-yellow-800
// error: bg-red-100 text-red-800
// info: bg-blue-100 text-blue-800
// neutral: bg-slate-100 text-slate-800
```

### 2.4 Input

```tsx
interface InputProps {
  type?: 'text' | 'textarea' | 'select';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  helperText?: string;
}

// Textarea: rows={4} resize vertical
// Select: options array
```

### 2.5 Modal

```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}
```

### 2.6 Toast

```tsx
interface ToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number; // ms
}
```

---

## 3. Layout Structure

### 3.1 App Layout

```
┌─────────────────────────────────────────────────────┐
│  Navbar                                             │
│  Logo | Dashboard | Analyzer | Health | History     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐  ┌─────────────────────────────┐  │
│  │             │  │                             │  │
│  │  Sidebar    │  │  Main Content               │  │
│  │  - Node List│  │  (Page-specific)            │  │
│  │  - Quick    │  │                             │  │
│  │    Actions  │  │                             │  │
│  │             │  │                             │  │
│  └─────────────┘  └─────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3.2 Responsive Breakpoints

```css
/* Mobile: < 640px */
/* Tablet: 640px - 1024px */
/* Desktop: > 1024px */

/* Mobile: Sidebar hidden, hamburger menu */
/* Tablet: Sidebar collapsed, expand on hover */
/* Desktop: Full sidebar visible */
```

---

## 4. Page Designs

### 4.1 Dashboard

```
┌─────────────────────────────────────────────────────┐
│  Dashboard                                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ Total Nodes │  │ Healthy     │  │ Recent      │ │
│  │ 5           │  │ 3 (60%)     │  │ Errors: 2   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  Recent Nodes                                 │ │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐     │ │
│  │  │Node1│ │Node2│ │Node3│ │Node4│ │Node5│     │ │
│  │  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘     │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  Quick Actions                                │ │
│  │  [Analyze Log] [Health Check] [Add Node]      │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 4.2 Log Analyzer

```
┌─────────────────────────────────────────────────────┐
│  Log Analyzer                                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  Paste Error Log                              │ │
│  │  ┌─────────────────────────────────────────┐ │ │
│  │  │ [textarea: paste your error log here...]│ │ │
│  │  │                                         │ │ │
│  │  │                                         │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  │  [Analyze with MiMo] [Clear]                 │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  Analysis Result                              │ │
│  │  ┌─────────────────────────────────────────┐ │ │
│  │  │ Root Cause: [text]                      │ │ │
│  │  │ Severity: [badge]                       │ │ │
│  │  │                                         │ │ │
│  │  │ Recommended Fix:                        │ │ │
│  │  │ 1. [step 1]                             │ │ │
│  │  │ 2. [step 2]                             │ │ │
│  │  │                                         │ │ │
│  │  │ Commands:                               │ │ │
│  │  │ ┌─────────────────────────────────────┐ │ │ │
│  │  │ │ sudo systemctl restart node-service │ │ │ │
│  │  │ └─────────────────────────────────────┘ │ │ │
│  │  │ [Copy] [Save to History]                │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 4.3 Health Checker

```
┌─────────────────────────────────────────────────────┐
│  Health Checker                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  Select Node: [dropdown]                      │ │
│  │  [Generate Health Checklist]                  │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  Health Checklist                             │ │
│  │  ┌─────────────────────────────────────────┐ │ │
│  │  │ 1. Check CPU usage                      │ │ │
│  │  │    Command: top -bn1 | grep "Cpu(s)"    │ │ │
│  │  │                                         │ │ │
│  │  │ 2. Check memory                         │ │ │
│  │  │    Command: free -h                     │ │ │
│  │  │                                         │ │ │
│  │  │ 3. Check disk space                     │ │ │
│  │  │    Command: df -h                       │ │ │
│  │  │                                         │ │ │
│  │  │ [Copy All Commands]                     │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  Paste Output                                 │ │
│  │  ┌─────────────────────────────────────────┐ │ │
│  │  │ [textarea: paste command output...]     │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  │  [Analyze Health]                            │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  Health Score: 85/100 [progress bar]         │ │
│  │  ┌─────────────────────────────────────────┐ │ │
│  │  │ ✓ CPU: Normal                           │ │ │
│  │  │ ✓ Memory: Normal                        │ │ │
│  │  │ �� Disk: 85% used                        │ │ │
│  │  │ ✓ Network: Connected                    │ │ │
│  │  │ ✗ Process: Not running                  │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 4.4 Automation Generator

```
┌─────────────────────────────────────────────────────┐
│  Automation Generator                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  Configuration                               │ │
│  │  Node Type: [Zcash | Filecoin | Arweave...]  │ │
│  │  Process Manager: [systemd | pm2 | docker]   │ │
│  │  Node Name: [input]                          │ │
│  │  [Generate Config]                           │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  Generated Config                             │ │
│  │  ┌─────────────────────────────────────────┐ │ │
│  │  │ # systemd service file                  │ │ │
│  │  │ [Unit]                                  │ │ │
│  │  │ Description=Zcash Node                  │ │ │
│  │  │ After=network.target                    │ │ │
│  │  │                                         │ │ │
│  │  │ [Service]                               │ │ │
│  │  │ Type=simple                             │ │ │
│  │  │ User=node                               │ │ │
│  │  │ ...                                     │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  │  [Copy Config] [Download]                    │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  Startup Script                              │ │
│  │  ┌─────────────────────────────────────────┐ │ │
│  │  │ #!/bin/bash                             │ │ │
│  │  │ sudo systemctl daemon-reload            │ │ │
│  │  │ sudo systemctl enable node-service      │ │ │
│  │  │ sudo systemctl start node-service       │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  │  [Copy Script]                               │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 4.5 History

```
┌─────────────────────────────────────────────────────┐
│  History                                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  Filters                                      │ │
│  │  Node: [All | Node1 | Node2...]              │ │
│  │  Date: [Last 7 days | Last 30 days | Custom] │ │
│  │  Severity: [All | Critical | High...]        │ │
│  │  Search: [input]                             │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  Timeline                                     │ │
│  │  ┌─────────────────────────────────────────┐ │ │
│  │  │ May 23, 10:30 - Node1                   │ │ │
│  │  │ ⚠ High - Process crashed                │ │ │
│  │  │ Fix: sudo systemctl restart node        │ │ │
│  │  │                                         │ │ │
│  │  │ May 22, 15:45 - Node2                   │ │ │
│  │  │ ✓ Low - Disk space warning              │ │ │
│  │  │ Fix: rm -rf /tmp/*                      │ │ │
│  │  │                                         │ │ │
│  │  │ May 21, 09:15 - Node3                   │ │ │
│  │  │ ✗ Critical - Network disconnected       │ │ │
│  │  │ Fix: systemctl restart networking       │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  │  [Load More] [Export JSON] [Export CSV]      │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 4.6 Node Registry

```
┌─────────────────────────────────────────────────────┐
│  Node Registry                                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Add New Node]                                    │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  Node List                                    │ │
│  │  ┌─────────────────────────────────────────┐ │ │
│  │  │ Node1 (Zcash)                           │ │ │
│  │  │ 192.168.1.100:8232                      │ │ │
│  │  │ systemd | Health: 95%                   │ │ │
│  │  │ [Edit] [Delete] [Health Check]          │ │ │
│  │  │                                         │ │ │
│  │  │ Node2 (Filecoin)                        │ │ │
│  │  │ 192.168.1.101:1234                      │ │ │
│  │  │ docker | Health: 60%                    │ │ │
│  │  │ [Edit] [Delete] [Health Check]          │ │ │
│  │  └─────────────────��───────────────────────┘ │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 5. Mobile Design

### 5.1 Mobile Navigation

```
┌─────────────────────────────────────┐
│  MiMo Node Copilot          ≡       │
├─────────────────────────────────────┤
│                                     │
│  [Dashboard]                        │
│  [Log Analyzer]                     │
│  [Health Checker]                   │
│  [Automation]                       │
│  [History]                          │
│  [Nodes]                            │
│                                     │
└─────────────────────────────────────┘
```

### 5.2 Mobile Card Layout

- Single column layout
- Reduced padding/margin
- Larger touch targets (44px min)
- Simplified forms (stacked inputs)
- Bottom navigation for main actions

---

## 6. Accessibility

### 6.1 WCAG Compliance

- **Color Contrast:** Minimum 4.5:1 for text
- **Keyboard Navigation:** Tab order logical, focus visible
- **Screen Readers:** Semantic HTML, ARIA labels
- **Text Size:** Scalable to 200% without loss
- **Motion:** Respect prefers-reduced-motion

### 6.2 ARIA Labels

```html
<button aria-label="Analyze log with MiMo AI">
<nav aria-label="Main navigation">
<div role="alert" aria-live="polite">
```

---

## 7. Assets

### 7.1 Icons

- **Heroicons** (MIT license)
- **Lucide React** (ISC license)

### 7.2 Fonts

- **Inter** (Google Fonts, SIL Open Font License)

### 7.3 Images

- Logo: SVG format
- Placeholders: Simple illustrations
- Favicon: 32x32 PNG

---

## 8. Implementation Notes

### 8.1 Next.js Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (dashboard)
│   ├── analyzer/
│   │   └── page.tsx
│   ├── health/
│   │   └── page.tsx
│   ├── automation/
│   │   └── page.tsx
│   ├── history/
│   │   └── page.tsx
│   └── nodes/
│       └── page.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   └── features/
│       ├── LogAnalyzer.tsx
│       └── ...
├── lib/
│   ├── api/
│   │   ├── groq.ts
│   │   └── mimo.ts
│   ├── storage/
│   │   └── nodeStorage.ts
│   └── utils/
│       └── helpers.ts
└── styles/
    └── globals.css
```

### 8.2 State Management

- **Local State:** React useState/useReducer
- **Persistence:** localStorage (zustand persist)
- **No global state needed for MVP**

### 8.3 API Integration

```typescript
// lib/api/groq.ts
export async function analyzeLog(log: string): Promise<AnalysisResult> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a DePIN node expert. Analyze error logs and provide fixes.',
        },
        {
          role: 'user',
          content: `Analyze this node error log: ${log}`,
        },
      ],
    }),
  });
  
  return response.json();
}
```

---

## 9. Design Tokens (Tailwind Config)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          700: '#1d4ed8',
        },
        // ... other colors from design system
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

---

## 10. Design Review Checklist

- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Responsive on mobile/tablet/desktop
- [ ] Consistent spacing (8px grid)
- [ ] Clear visual hierarchy
- [ ] Accessible to screen readers
- [ ] Loading states for all async actions
- [ ] Error states for all forms
- [ ] Success feedback for user actions
- [ ] Copy-paste ready commands
- [ ] Intuitive navigation flow
