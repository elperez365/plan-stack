<div align="center">

# ✨ PlanStack

### La piattaforma completa per la gestione dei progetti software

<p>
  <a href="#-panoramica">Panoramica</a> •
  <a href="#-funzionalità">Funzionalità</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-tecnologie">Tecnologie</a> •
  <a href="#-installazione">Installazione</a> •
  <a href="#-architettura">Architettura</a>
</p>

<p>
  <img src="https://img.shields.io/badge/Next.js-16.0.6-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Zustand-5.0.9-orange?style=for-the-badge" alt="Zustand"/>
</p>

<br />

<img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/layout-dashboard.svg" width="120" />

</div>

---

## 📋 Panoramica

**PlanStack** è un'applicazione web enterprise-grade per la gestione completa del ciclo di vita dei progetti software. Costruita con le tecnologie più moderne, offre un'esperienza utente fluida e professionale per team di sviluppo di qualsiasi dimensione.

### 🎯 Perché PlanStack?

| Caratteristica | Descrizione |
|----------------|-------------|
| 🔄 **All-in-one** | Tutto ciò che serve per gestire un progetto in un'unica piattaforma integrata |
| ⚡ **Modern Stack** | Next.js 16, React 19, TypeScript 5, Tailwind CSS 4 per performance ottimali |
| 👥 **Team-oriented** | Ruoli differenziati, assegnazioni, activity feed e comunicazione integrata |
| 📊 **Data-driven** | Dashboard con metriche real-time, statistiche e tracking del progresso |
| 🔗 **Fully Integrated** | Requisiti → Stime → Task → Test → Defect collegati tra loro |
| 💾 **Persistent State** | Dati salvati automaticamente nel browser con Zustand + persist |

---

## ✨ Funzionalità

### 🏠 Dashboard Intelligente

La home page offre una panoramica completa e immediata:

- **Statistiche globali**: progetti totali, attivi e completati
- **Metriche task**: completati vs totali con barra di progresso
- **Effort tracking**: ore stimate totali su tutti i progetti
- **Quick stats**: requisiti documentati, test cases, stime create
- **Progetti recenti**: accesso rapido ai progetti più aggiornati
- **Activity feed**: timeline delle attività del team in tempo reale

---

### 📁 Gestione Progetti Completa

<details>
<summary><b>Clicca per espandere</b></summary>

#### Creazione Progetti
- **Tipologie**: Web, Mobile, Desktop, API, Fullstack, Other
- **Stati**: Planning, In Progress, Review, Completed, On Hold
- **Priorità**: Low, Medium, High, Urgent

#### Informazioni Progetto
- Nome, descrizione e client
- Data inizio e fine prevista
- Budget allocato
- Stack tecnologico con colori personalizzati
- Link esterni: Repository Git, Figma, Documentazione

#### Vista Progetto
- Overview con statistiche e progresso
- Team assegnato con avatar e ruoli
- Accesso rapido a tutte le sezioni
- Card con metriche per ogni area (Task, Requisiti, Stime, Test, Bug)

</details>

---

### 📝 Analisi Funzionale e Requisiti

<details>
<summary><b>Clicca per espandere</b></summary>

#### Tipi di Requisiti
- \`functional\` - Requisiti funzionali
- \`non-functional\` - Requisiti non funzionali
- \`technical\` - Requisiti tecnici
- \`business\` - Requisiti di business
- \`user-story\` - User stories

#### Sistema di Priorità MoSCoW
- 🔴 **Must Have** - Indispensabili
- 🟠 **Should Have** - Importanti
- �� **Could Have** - Desiderabili
- ⚪ **Won't Have** - Esclusi

#### Stati Workflow
\`Draft\` → \`Review\` → \`Approved\` → \`Implemented\`

#### Features
- Criteri di accettazione multipli
- Dipendenze tra requisiti
- Commenti e discussioni
- Allegati e documentazione
- Versioning automatico
- Storico modifiche completo
- Collegamento a task

</details>

---

### ⏱️ Stime e Planning

<details>
<summary><b>Clicca per espandere</b></summary>

#### Metodi di Stima
- **Ore** - Stima in ore lavorative
- **Story Points** - Punti relativi
- **T-Shirt Sizing** - XS, S, M, L, XL, XXL

#### Categorie
| Categoria | Icona |
|-----------|-------|
| Development | 💻 |
| Design | 🎨 |
| Testing | 🧪 |
| DevOps | ⚙️ |
| Management | 📊 |
| Documentation | �� |

#### Livelli di Complessità
- 🟢 Low
- 🟡 Medium  
- 🟠 High
- 🔴 Critical

#### Livelli di Confidenza
- 🔵 Low - Stima incerta
- 🟡 Medium - Stima ragionevole
- 🟢 High - Stima affidabile

#### Features
- Buffer percentuale automatico
- Contingency per rischi
- Collegamento a requisiti
- Note e assunzioni
- Approvazione stime
- Ricalcolo totali automatico

</details>

---

### ✅ Task Management con Kanban

<details>
<summary><b>Clicca per espandere</b></summary>

#### Kanban Board
Board interattiva con **Drag & Drop** completo:

| Colonna | Colore | Descrizione |
|---------|--------|-------------|
| **Da Fare** | ⬜ Grigio | Task in backlog |
| **In Corso** | 🔵 Blu | Task in lavorazione |
| **Review** | 🟡 Amber | Task in revisione |
| **Completati** | 🟢 Verde | Task completati |

#### Funzionalità Task
- Titolo e descrizione
- Priorità (Low, Medium, High, Urgent)
- Assegnazione membro team
- Data di scadenza
- Tag multipli
- Ore stimate vs ore effettive
- Collegamento a requisiti funzionali

#### Interazioni
- **Drag & Drop** tra colonne
- Feedback visivo durante il trascinamento
- Filtri per stato e priorità
- Ricerca testuale
- Contatori per colonna

</details>

---

### 🧪 Test Management Completo

<details>
<summary><b>Clicca per espandere</b></summary>

#### Test Cases
\`\`\`
Codice: TC-001
Titolo: Verifica login utente
Tipo: Manuale | Automatizzato
Priorità: Critical | High | Medium | Low
Stato: Draft | Active | Blocked | Deprecated
\`\`\`

#### Test Steps
Ogni test case contiene step strutturati:
1. **Azione** - Cosa fare
2. **Risultato Atteso** - Cosa dovrebbe succedere
3. **Risultato Attuale** - Cosa è successo (in esecuzione)
4. **Screenshot** - Evidenze opzionali

#### Cicli di Test
- Nome e descrizione
- Ambiente target (Staging, Production, etc.)
- Build/versione
- Selezione test cases
- Tracciamento esecuzioni

#### Esecuzione Test
| Risultato | Badge | Descrizione |
|-----------|-------|-------------|
| ✅ Passed | Verde | Test superato |
| ❌ Failed | Rosso | Test fallito |
| ⚠️ Blocked | Amber | Test bloccato |
| ⏭️ Skipped | Grigio | Test saltato |
| ⏳ Pending | Grigio | In attesa |

#### Metriche
- Pass Rate percentuale
- Barra di progresso visiva
- Contatori per risultato
- Tempo di esecuzione

</details>

---

### 🐛 Defect & Bug Tracking

<details>
<summary><b>Clicca per espandere</b></summary>

#### Severity Levels
| Severity | Icona | Descrizione |
|----------|-------|-------------|
| 🔴 Critical | ⚠️ | Blocca l'utilizzo |
| �� High | 🔺 | Impatto significativo |
| 🟡 Medium | ℹ️ | Impatto limitato |
| 🔵 Low | ℹ️ | Non blocca l'uso |

#### Workflow Stati
\`\`\`
Open → In Progress → Resolved → Closed
              ↓
           Reopened
              ↓
           Rejected
\`\`\`

#### Informazioni Bug
- **Codice**: BUG-001 (auto-generato)
- **Titolo**: Descrizione breve
- **Descrizione**: Dettaglio completo
- **Steps to Reproduce**: Lista passi numerati
- **Comportamento Atteso** vs **Comportamento Attuale**
- **Ambiente**: Browser, OS, dispositivo
- **Collegamento** a Test Case e Requisiti
- **Assegnazione** a membro del team
- **Allegati** e screenshot

#### Dashboard Defects
- Totale bug
- Bug aperti (🔴)
- In lavorazione (🟡)
- Risolti (🟢)
- Critici aperti (⚠️ evidenziato)

</details>

---

### 👥 Gestione Team e Ruoli

<details>
<summary><b>Clicca per espandere</b></summary>

#### Ruoli Disponibili
| Ruolo | Badge | Permessi |
|-------|-------|----------|
| 👔 CEO | Viola | Accesso completo |
| 📋 Project Manager | Blu | Gestione progetti |
| 💻 Developer | Verde | Task e codice |
| 🎨 Designer | Rosa | Design e UI |
| 🧪 QA | Amber | Test e defect |
| ⚙️ DevOps | Grigio | Infrastruttura |

#### Profilo Utente
- Nome e email
- Avatar generato automaticamente
- Ruolo e dipartimento
- Progetti assegnati

#### Cambio Utente (Demo)
Menu dropdown nella sidebar per simulare diversi utenti e testare le funzionalità.

</details>

---

### 💬 Comunicazione e Messaggi

- Sistema messaggi integrato per progetto
- Menzioni utenti con @username
- Allegati (documenti, immagini)
- Reazioni con emoji
- Annunci importanti evidenziati
- Risposte threaded

---

### 📅 Calendario

- Visualizzazione timeline progetti
- Milestone e scadenze
- Date inizio/fine progetti
- Filtri per periodo

---

### ⚙️ Activity Tracking

Ogni azione viene tracciata automaticamente:
- Creazione/modifica progetti
- Aggiunta/completamento task
- Creazione requisiti e stime
- Esecuzione test
- Segnalazione bug
- Messaggi inviati

L'activity feed mostra le ultime 200 attività con:
- Dettaglio azione
- Timestamp
- Tipo entità (progetto, task, requisito, test, defect)
- Link all'elemento

---

## 🎮 Demo

L'applicazione include **dati demo precaricati**:

- 👥 **6 utenti** con ruoli diversi
- 📁 **Progetti di esempio** con dati realistici
- ✅ **Task** in vari stati
- 📝 **Requisiti** documentati
- ⏱️ **Stime** complete
- 🧪 **Test cases** e cicli
- 🐛 **Defect** di esempio
- 📊 **Activity feed** popolato

Puoi **resettare ai dati demo** in qualsiasi momento dalle impostazioni.

---

## 🛠️ Tecnologie

### Core Stack

| Tecnologia | Versione | Uso |
|------------|----------|-----|
| [Next.js](https://nextjs.org/) | 16.0.6 | Framework React con App Router |
| [React](https://react.dev/) | 19.2.0 | Libreria UI |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Styling utility-first |

### State & Data

| Tecnologia | Versione | Uso |
|------------|----------|-----|
| [Zustand](https://zustand-demo.pmnd.rs/) | 5.0.9 | State management |
| [date-fns](https://date-fns.org/) | 4.1.0 | Manipolazione date |
| [uuid](https://www.npmjs.com/package/uuid) | 13.0.0 | Generazione ID univoci |

### UI Components

| Tecnologia | Versione | Uso |
|------------|----------|-----|
| [Lucide React](https://lucide.dev/) | 0.555.0 | Icone SVG |

### Development

| Tecnologia | Versione | Uso |
|------------|----------|-----|
| [ESLint](https://eslint.org/) | 9.x | Linting codice |
| [PostCSS](https://postcss.org/) | - | Processing CSS |

---

## 🚀 Installazione

### Prerequisiti

- **Node.js** 18.17 o superiore
- **npm**, **yarn**, **pnpm** o **bun**

### Quick Start

\`\`\`bash
# 1. Clona il repository
git clone https://github.com/your-username/plan-stack.git

# 2. Entra nella directory
cd plan-stack

# 3. Installa le dipendenze
npm install

# 4. Avvia il server di sviluppo
npm run dev

# 5. Apri http://localhost:3000
\`\`\`

### Script Disponibili

\`\`\`bash
npm run dev      # 🔥 Avvia server sviluppo (hot reload)
npm run build    # 📦 Build produzione ottimizzata
npm run start    # 🚀 Avvia server produzione
npm run lint     # 🔍 Controlla errori ESLint
\`\`\`

---

## 🏗️ Architettura

### Struttura Directory

\`\`\`
plan-stack/
├── 📁 app/
│   ├── 📁 components/
│   │   ├── 📁 layout/
│   │   │   └── Navigation.tsx      # Sidebar + Header
│   │   ├── 📁 projects/
│   │   │   ├── CreateProjectModal.tsx
│   │   │   └── ProjectCard.tsx
│   │   └── 📁 ui/
│   │       ├── Avatar.tsx
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── EmptyState.tsx
│   │       ├── Input.tsx
│   │       └── Modal.tsx
│   │
│   ├── 📁 projects/
│   │   ├── page.tsx                # Lista progetti
│   │   └── 📁 [id]/
│   │       ├── page.tsx            # Dettaglio progetto
│   │       ├── 📁 requirements/    # Analisi funzionale
│   │       ├── 📁 estimates/       # Stime
│   │       ├── 📁 tasks/           # Kanban board
│   │       ├── 📁 tests/           # Test management
│   │       ├── 📁 defects/         # Bug tracking
│   │       └── 📁 messages/        # Chat progetto
│   │
│   ├── 📁 store/
│   │   ├── projectStore.ts         # Zustand store principale
│   │   └── demoData.ts             # Dati demo
│   │
│   ├── 📁 types/
│   │   └── index.ts                # TypeScript definitions
│   │
│   ├── 📁 calendar/
│   ├── 📁 messages/
│   ├── 📁 settings/
│   ├── 📁 team/
│   │
│   ├── globals.css                 # Stili globali + Tailwind
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Dashboard home
│
├── 📁 public/                      # Asset statici
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── next.config.ts
\`\`\`

### Data Flow

\`\`\`
┌─────────────────────────────────────────────────────┐
│                    Zustand Store                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ • projects[]     • users[]                   │    │
│  │ • activities[]   • technologies[]            │    │
│  │ • currentUser                                │    │
│  └─────────────────────────────────────────────┘    │
│                         ↕                            │
│           localStorage (persist middleware)          │
└─────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────┐
│                 React Components                     │
│  Dashboard ─→ ProjectList ─→ ProjectDetail          │
│                    ↓                                 │
│       Tasks │ Requirements │ Tests │ Defects        │
└─────────────────────────────────────────────────────┘
\`\`\`

### Type System

L'applicazione utilizza un sistema di tipi TypeScript robusto:

\`\`\`typescript
// Esempi tipi principali
type ProjectType = 'web' | 'mobile' | 'desktop' | 'api' | 'fullstack' | 'other'
type ProjectStatus = 'planning' | 'in-progress' | 'review' | 'completed' | 'on-hold'
type Priority = 'low' | 'medium' | 'high' | 'urgent'
type UserRole = 'ceo' | 'project-manager' | 'developer' | 'designer' | 'qa' | 'devops'

interface Project {
  id: string
  name: string
  description: string
  type: ProjectType
  status: ProjectStatus
  priority: Priority
  technologies: Technology[]
  team: User[]
  tasks: Task[]
  functionalAnalyses: FunctionalAnalysis[]
  estimations: Estimation[]
  testCases: TestCase[]
  testCycles: TestCycle[]
  defects: Defect[]
  // ... altri campi
}
\`\`\`

---

## 🧩 Componenti UI

Il progetto include una libreria di componenti UI riutilizzabili:

### Button
\`\`\`tsx
<Button variant="primary" size="md" onClick={handleClick}>
  <Icon /> Label
</Button>
// Varianti: primary, secondary, ghost, danger
// Sizes: sm, md, lg
\`\`\`

### Card
\`\`\`tsx
<Card hover className="p-6">
  <CardHeader>Titolo</CardHeader>
  <CardContent>Contenuto</CardContent>
</Card>
\`\`\`

### Badge
\`\`\`tsx
<Badge variant="success" size="sm">Completato</Badge>
<StatusBadge status="in-progress" />
<PriorityBadge priority="high" />
<RoleBadge role="developer" />
\`\`\`

### Modal
\`\`\`tsx
<Modal isOpen={open} onClose={close} title="Titolo" size="lg">
  Contenuto modal
</Modal>
\`\`\`

### Input Components
\`\`\`tsx
<Input label="Nome" placeholder="Inserisci..." />
<TextArea label="Descrizione" rows={3} />
<Select label="Stato" options={[...]} />
\`\`\`

### Avatar
\`\`\`tsx
<Avatar name="Mario Rossi" size="lg" />
// Genera colore e iniziali automaticamente
\`\`\`

### EmptyState
\`\`\`tsx
<EmptyState
  icon={FolderIcon}
  title="Nessun elemento"
  description="Crea il primo elemento"
  action={{ label: "Crea", onClick: handleCreate }}
/>
\`\`\`

---

## 🗺️ Roadmap

### ✅ Completato (v0.1.0)
- [x] Dashboard con statistiche
- [x] Gestione progetti CRUD
- [x] Analisi funzionale e requisiti
- [x] Sistema stime con calcoli automatici
- [x] Kanban board con drag & drop
- [x] Test management completo
- [x] Bug tracking con workflow
- [x] Gestione team e ruoli
- [x] Activity tracking
- [x] Persistenza localStorage

### 🚧 In Sviluppo
- [ ] Sistema notifiche in-app
- [ ] Export report PDF
- [ ] Grafici e analytics avanzati
- [ ] Dark mode

### 📋 Pianificato
- [ ] Autenticazione utenti
- [ ] Backend API (Node.js/Python)
- [ ] Database (PostgreSQL/MongoDB)
- [ ] Integrazione GitHub/GitLab
- [ ] API REST/GraphQL
- [ ] Notifiche push
- [ ] Import/Export dati
- [ ] Localizzazione multi-lingua
- [ ] Mobile app (React Native)
- [ ] Plugin per IDE

---

## 🤝 Contributing

I contributi sono benvenuti! Ecco come partecipare:

### Come Contribuire

1. **Fork** del repository
2. **Crea** un branch per la feature
   \`\`\`bash
   git checkout -b feature/amazing-feature
   \`\`\`
3. **Committa** le modifiche
   \`\`\`bash
   git commit -m 'Add: amazing feature'
   \`\`\`
4. **Pusha** il branch
   \`\`\`bash
   git push origin feature/amazing-feature
   \`\`\`
5. **Apri** una Pull Request

### Convenzioni Commit
- \`Add:\` nuove funzionalità
- \`Fix:\` correzione bug
- \`Update:\` modifiche a funzionalità esistenti
- \`Refactor:\` refactoring codice
- \`Docs:\` documentazione
- \`Style:\` formattazione, stili
- \`Test:\` test

### Code Style
- ESLint per linting
- Prettier per formattazione
- TypeScript strict mode
- Tailwind CSS per stili

---

## 📄 Licenza

Questo progetto è distribuito sotto licenza **MIT**.

\`\`\`
MIT License

Copyright (c) 2024 PlanStack

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
\`\`\`

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Lucide](https://lucide.dev/) - Beautiful icons
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [date-fns](https://date-fns.org/) - Date utilities

---

<div align="center">

### ⭐ Se ti piace PlanStack, lascia una stella!

<br />

**Realizzato con ❤️ e molto ☕**

<br />

[🐛 Segnala Bug](https://github.com/your-username/plan-stack/issues) •
[💡 Richiedi Feature](https://github.com/your-username/plan-stack/issues) •
[📖 Documentazione](https://github.com/your-username/plan-stack/wiki)

<br />

<sub>Built with Next.js 16 + React 19 + TypeScript + Tailwind CSS</sub>

</div>
