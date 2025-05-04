# AI Agentic Evaluation Platform

An enterprise-grade AI evaluation system that assesses AI responses against implied human intent using YAML-driven configurations. The platform combines a Python backend for AI orchestration and evaluation with a modern Next.js dashboard for visualization and analysis.

![Platform Overview](https://img.shields.io/badge/Platform-AI%20Evaluation-blue)
![Backend](https://img.shields.io/badge/Backend-Python%203.10+-green)
![Frontend](https://img.shields.io/badge/Frontend-Next.js%2016-black)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Configuration](#configuration)
  - [YAML Configuration Files](#yaml-configuration-files)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
  - [Running Evaluations](#running-evaluations)
  - [Using the Dashboard](#using-the-dashboard)
- [API Reference](#api-reference)
- [Evaluation Methodology](#evaluation-methodology)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)

---

## Overview

The AI Agentic Evaluation Platform is designed for AI teams who need to:

- **Evaluate AI responses** against expected human intent
- **Track evaluation metrics** across multiple tasks and models
- **Configure evaluations** using human-readable YAML files
- **Visualize results** through a professional dashboard
- **Audit AI behavior** with detailed breakdowns and explanations

This is NOT a consumer chatbot application. It's an internal evaluation tool similar to those used by leading AI companies for quality assurance and model assessment.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AI EVALUATION PLATFORM                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         FRONTEND (Next.js)                          │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │   │
│  │  │  Dashboard  │  │  Task List  │  │ Task Detail │  │YAML Editor │  │   │
│  │  │      /      │  │   /tasks    │  │ /tasks/[id] │  │  /editor   │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         REST API Layer                              │   │
│  │              GET /api/tasks    GET /api/tasks/:id                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        BACKEND (Python)                             │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │   │
│  │  │ Orchestrator │──│    Agents    │──│    Tools     │               │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │   │
│  │          │                                                          │   │
│  │          ▼                                                          │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │                    Evaluation Pipeline                        │   │   │
│  │  │  ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐  │   │   │
│  │  │  │ Intent Matcher │  │Constraint Check│  │     Scorer      │  │   │   │
│  │  │  └────────────────┘  └────────────────┘  └─────────────────┘  │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      YAML CONFIGURATIONS                            │   │
│  │    tasks.yaml  │  agents.yaml  │  tools.yaml  │  evaluation.yaml   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Features

### Backend Features

- **YAML-Driven Configuration**: Define tasks, agents, tools, and evaluation criteria in human-readable YAML
- **Intent Matching**: Semantic evaluation of AI responses against expected intents
- **Constraint Checking**: Verify responses don't violate defined constraints
- **Weighted Scoring**: Configurable scoring weights for different evaluation criteria
- **OpenAI Integration**: Built-in support for GPT models via OpenAI API
- **Modular Architecture**: Easily extend with new agents, tools, and evaluation methods

### Frontend Features

- **Dashboard Overview**: System-wide metrics, pass/fail ratios, and score distributions
- **Task Management**: Browse, search, and filter evaluation tasks
- **Detailed Analysis**: Two-column layout showing input vs. output vs. evaluation
- **YAML Viewer**: Monaco Editor integration for viewing configurations
- **Real-time Validation**: Visual YAML structure validation
- **Responsive Design**: Works on desktop and tablet devices

### Color Semantics

| Color  | Meaning                    | Score Range |
|--------|----------------------------|-------------|
| Green  | Pass / Intent Matched      | ≥ 80%       |
| Yellow | Partial / Warning          | 50% - 79%   |
| Red    | Fail / Intent Not Matched  | < 50%       |

---

## Project Structure

```
ai-agentic-platform/
├── README.md                           # This file
│
├── server/                             # Python Backend
│   ├── agents/                         # AI Agent implementations
│   │   ├── __init__.py
│   │   ├── base_agent.py              # Abstract base agent class
│   │   └── intent_agent.py            # Intent inference agent (OpenAI)
│   │
│   ├── evaluation/                     # Evaluation pipeline
│   │   ├── __init__.py
│   │   ├── intent_matcher.py          # Semantic intent matching
│   │   ├── constraint_checker.py      # Constraint violation detection
│   │   └── scorer.py                  # Final score calculation
│   │
│   ├── orchestrator/                   # Task orchestration
│   │   ├── __init__.py
│   │   ├── orchestrator.py            # Main orchestrator class
│   │   ├── context.py                 # Execution context management
│   │   └── loader.py                  # YAML configuration loader
│   │
│   ├── tools/                          # Available tools
│   │   ├── __init__.py
│   │   ├── base_tool.py               # Abstract base tool
│   │   ├── summarizer.py              # Text summarization tool
│   │   └── classifier.py              # Classification tool
│   │
│   ├── runners/                        # Execution scripts
│   │   ├── __init__.py
│   │   └── run_task.py                # Main task runner
│   │
│   ├── utils/                          # Utility functions
│   │   ├── __init__.py
│   │   └── yaml_validator.py          # YAML validation helpers
│   │
│   ├── yaml_configs/                   # Configuration files
│   │   ├── tasks.yaml                 # Task definitions
│   │   ├── agents.yaml                # Agent configurations
│   │   ├── tools.yaml                 # Tool definitions
│   │   └── evaluation.yaml            # Scoring weights
│   │
│   ├── outputs/                        # Generated results (JSON)
│   │   └── TASK_001.json              # Example output
│   │
│   ├── requirements.txt                # Python dependencies
│   └── .gitignore
│
└── frontend/                           # Next.js Frontend
    ├── src/
    │   ├── app/                        # App Router pages
    │   │   ├── page.tsx               # Dashboard (/)
    │   │   ├── layout.tsx             # Root layout
    │   │   ├── globals.css            # Global styles
    │   │   ├── tasks/
    │   │   │   ├── page.tsx           # Task list (/tasks)
    │   │   │   └── [id]/
    │   │   │       └── page.tsx       # Task detail (/tasks/[id])
    │   │   └── editor/
    │   │       └── page.tsx           # YAML editor (/editor)
    │   │
    │   ├── components/                 # React components
    │   │   ├── dashboard/             # Dashboard-specific
    │   │   │   ├── StatCard.tsx
    │   │   │   └── TaskSummaryChart.tsx
    │   │   ├── tasks/                 # Task-related
    │   │   │   ├── TaskTable.tsx
    │   │   │   ├── TaskRow.tsx
    │   │   │   └── StatusBadge.tsx
    │   │   ├── detail/                # Task detail page
    │   │   │   ├── YamlViewer.tsx
    │   │   │   ├── ResponsePanel.tsx
    │   │   │   └── EvaluationPanel.tsx
    │   │   ├── layout/                # Layout components
    │   │   │   ├── Sidebar.tsx
    │   │   │   └── Header.tsx
    │   │   └── ui/                    # shadcn/ui components
    │   │       ├── button.tsx
    │   │       ├── card.tsx
    │   │       ├── badge.tsx
    │   │       └── ...
    │   │
    │   └── lib/                        # Utilities & API
    │       ├── api.ts                 # API client + mock data
    │       ├── types.ts               # TypeScript interfaces
    │       └── utils.ts               # Helper functions
    │
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    └── next.config.ts
```

---

## Getting Started

### Prerequisites

- **Python 3.10+** for the backend
- **Node.js 18+** and npm for the frontend
- **OpenAI API Key** for AI evaluations

### Backend Setup

1. **Navigate to the server directory:**

   ```bash
   cd server
   ```

2. **Create and activate a virtual environment:**

   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**

   Create a `.env` file in the `server/` directory:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. **Run the evaluation pipeline:**

   ```bash
   python runners/run_task.py
   ```

   Results will be saved to `server/outputs/` as JSON files.

### Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**

   Navigate to [http://localhost:3000](http://localhost:3000)

   > Note: The frontend includes mock data fallback, so you can explore the UI without a running backend.

### Production Build

```bash
# Frontend
cd frontend
npm run build
npm run start

# The production server will run on port 3000
```

---

## Configuration

### YAML Configuration Files

#### tasks.yaml

Defines evaluation tasks with user messages and expected intents:

```yaml
tasks:
  - id: TASK_001
    user_message: >
      I'll be away next week and my inbox is already chaos.
    expected_intent:
      primary: email_prioritization
    constraints:
      - No travel advice
```

#### agents.yaml

Configures AI agents with their roles and model settings:

```yaml
agents:
  - id: intent_analyst
    role: You infer implied human intent accurately.
    model: gpt-4.1-mini
    temperature: 0.2
```

#### tools.yaml

Defines available tools for agents:

```yaml
tools:
  - name: summarizer
    enabled: true
```

#### evaluation.yaml

Sets scoring weights for evaluation criteria:

```yaml
evaluation:
  weights:
    intent_match: 1.0
    constraint_violation: 0.5
```

### Environment Variables

| Variable        | Description                    | Required |
|-----------------|--------------------------------|----------|
| `OPENAI_API_KEY`| Your OpenAI API key            | Yes      |

---

## Usage

### Running Evaluations

1. **Define tasks** in `yaml_configs/tasks.yaml`
2. **Configure agents** in `yaml_configs/agents.yaml`
3. **Set evaluation weights** in `yaml_configs/evaluation.yaml`
4. **Run the pipeline:**

   ```bash
   cd server
   python runners/run_task.py
   ```

5. **View results** in the `outputs/` directory or via the dashboard

### Using the Dashboard

| Page | URL | Description |
|------|-----|-------------|
| **Dashboard** | `/` | Overview with stats, charts, and recent tasks |
| **Task List** | `/tasks` | Browse all tasks with search and filters |
| **Task Detail** | `/tasks/[id]` | Deep dive into individual task evaluation |
| **YAML Editor** | `/editor` | View and validate YAML configurations |

#### Dashboard Page

- View total tasks evaluated
- Monitor average intent scores
- Track pass/fail ratios
- See active model information

#### Task List Page

- Search by Task ID or Domain
- Filter by status (Pass/Partial/Fail)
- Toggle between table and grid views
- Click any task to see details

#### Task Detail Page

- **Left Column**: User message, expected intent, constraints, YAML viewer
- **Right Column**: AI response, evaluation breakdown, score visualization

---

## API Reference

### Endpoints

The frontend expects these REST API endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | List all tasks |
| `GET` | `/api/tasks/:id` | Get task by ID |
| `GET` | `/api/stats` | Dashboard statistics |
| `POST` | `/api/evaluate` | Trigger evaluation (future) |

### Task Response Schema

```typescript
interface Task {
  task_id: string;
  user_message: string;
  expected_intent: {
    primary: string;
    secondary?: string[];
  };
  constraints: string[];
  domain?: string;
  response?: string;
  evaluation?: {
    score: number;        // 0.0 - 1.0
    intent_match: boolean;
    explanation?: string;
    constraint_violations?: string[];
  };
}
```

---

## Evaluation Methodology

### Scoring Formula

```
Final Score = (Intent Match Weight × Intent Match Result)
            - (Constraint Violation Weight × Violation Penalty)
```

### Intent Matching

The system uses keyword-based semantic matching:

1. Extract expected intent from task configuration
2. Check AI response for relevant keywords
3. Return boolean match result

### Constraint Checking

Constraints are validated against the response:

1. Parse constraint rules from task
2. Check for violations (e.g., "No travel advice")
3. Deduct points for violations

### Future Enhancements

- [ ] LLM-based semantic similarity scoring
- [ ] Multi-intent evaluation
- [ ] Custom constraint validators
- [ ] A/B testing between models

---

## Tech Stack

### Backend

| Technology | Purpose |
|------------|---------|
| Python 3.10+ | Core runtime |
| PyYAML | YAML configuration parsing |
| OpenAI SDK | GPT model integration |
| python-dotenv | Environment management |
| NumPy | Numerical operations |

### Frontend

| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework with App Router |
| TypeScript | Type-safe development |
| Tailwind CSS 4 | Utility-first styling |
| shadcn/ui | UI component library |
| Recharts | Data visualization |
| Monaco Editor | YAML code viewer |
| Axios | HTTP client |
| Lucide React | Icon library |

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write TypeScript with proper typing
- Test your changes before submitting
- Update documentation as needed

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

For questions or issues:

- Open a GitHub Issue
- Check existing documentation
- Review the codebase for examples

---

Built with precision for AI evaluation teams.
