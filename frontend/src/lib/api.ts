import axios, { AxiosError } from "axios";
import { Task, TaskListItem, DashboardStats, ScoreDataPoint, ApiResponse } from "./types";
import { getTaskStatus } from "./utils";

// =============================================================================
// API Configuration
// =============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// =============================================================================
// Mock Data (Fallback when API is unavailable)
// =============================================================================

const MOCK_TASKS: Task[] = [
  {
    id: "1",
    task_id: "TASK_001",
    user_message: "I'll be away next week and my inbox is already chaos.",
    expected_intent: {
      primary: "email_prioritization",
      secondary: ["organization", "productivity"],
    },
    constraints: ["No travel advice", "Focus on actionable steps"],
    domain: "productivity",
    response:
      "To manage your inbox while you're away next week, set up an automatic out-of-office reply informing senders of your absence and expected return date. Additionally, consider organizing your emails by creating filters or folders to prioritize important messages, and mark or flag any urgent emails that need attention before you leave. If possible, delegate inbox monitoring to a trusted colleague during your absence. This will help keep your inbox manageable and ensure important matters are addressed.",
    evaluation: {
      score: 1.0,
      intent_match: true,
      explanation: "Response correctly addresses email prioritization with actionable steps.",
    },
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:35:00Z",
  },
  {
    id: "2",
    task_id: "TASK_002",
    user_message: "My team keeps missing deadlines and I don't know how to address it without being harsh.",
    expected_intent: {
      primary: "team_management",
      secondary: ["communication", "leadership"],
    },
    constraints: ["Maintain positive tone", "No punitive measures"],
    domain: "management",
    response:
      "Consider having a one-on-one conversation with each team member to understand their challenges. Set clear expectations and realistic deadlines collaboratively. Implement regular check-ins to track progress and offer support. Use project management tools to increase visibility and accountability without micromanaging.",
    evaluation: {
      score: 0.92,
      intent_match: true,
      explanation: "Response addresses team management with empathetic communication strategies.",
    },
    created_at: "2024-01-15T11:00:00Z",
    updated_at: "2024-01-15T11:05:00Z",
  },
  {
    id: "3",
    task_id: "TASK_003",
    user_message: "I need to present quarterly results to the board but I'm terrible at public speaking.",
    expected_intent: {
      primary: "presentation_skills",
      secondary: ["confidence_building", "preparation"],
    },
    constraints: ["No generic advice", "Include specific techniques"],
    domain: "communication",
    response:
      "Start by structuring your presentation with a clear narrative: opening hook, key metrics, insights, and action items. Practice in front of a mirror or record yourself to identify areas for improvement. Use the 'pause and breathe' technique before key points. Prepare for likely questions and have backup slides ready. Consider joining a local Toastmasters group for ongoing practice.",
    evaluation: {
      score: 0.88,
      intent_match: true,
      explanation: "Response provides specific techniques for presentation improvement.",
    },
    created_at: "2024-01-15T14:20:00Z",
    updated_at: "2024-01-15T14:25:00Z",
  },
  {
    id: "4",
    task_id: "TASK_004",
    user_message: "Our customer support tickets are piling up and response times are terrible.",
    expected_intent: {
      primary: "customer_support_optimization",
      secondary: ["efficiency", "automation"],
    },
    constraints: ["Maintain service quality", "Consider budget constraints"],
    domain: "operations",
    response:
      "Here are some travel tips for your upcoming vacation...",
    evaluation: {
      score: 0.1,
      intent_match: false,
      explanation: "Response completely misses the intent. Provided travel advice instead of customer support optimization.",
      constraint_violations: ["Response is off-topic"],
    },
    created_at: "2024-01-16T09:00:00Z",
    updated_at: "2024-01-16T09:05:00Z",
  },
  {
    id: "5",
    task_id: "TASK_005",
    user_message: "I want to learn Python but I only have 30 minutes a day.",
    expected_intent: {
      primary: "learning_strategy",
      secondary: ["time_management", "skill_development"],
    },
    constraints: ["Respect time constraint", "Provide structured path"],
    domain: "education",
    response:
      "With 30 minutes daily, focus on consistent micro-learning. Week 1-2: Cover basics (variables, data types) using interactive platforms like Codecademy. Week 3-4: Practice with small coding challenges on HackerRank. Week 5-6: Build a simple project like a calculator. Use spaced repetition and review previous concepts every few days. Track progress in a learning journal.",
    evaluation: {
      score: 0.95,
      intent_match: true,
      explanation: "Excellent structured learning path respecting the 30-minute constraint.",
    },
    created_at: "2024-01-16T11:30:00Z",
    updated_at: "2024-01-16T11:35:00Z",
  },
  {
    id: "6",
    task_id: "TASK_006",
    user_message: "My code review process takes forever and blocks the whole team.",
    expected_intent: {
      primary: "code_review_optimization",
      secondary: ["workflow_improvement", "collaboration"],
    },
    constraints: ["Maintain code quality", "Don't skip reviews entirely"],
    domain: "engineering",
    response:
      "Implement tiered reviews: small changes (<50 lines) need one reviewer, larger changes need two. Set SLAs (e.g., 24h for initial review). Use automated linting and tests as gatekeepers before human review. Create a review checklist to standardize the process. Consider pair programming for complex features to reduce post-implementation review time.",
    evaluation: {
      score: 0.65,
      intent_match: true,
      explanation: "Good suggestions but could be more specific about implementation details.",
    },
    created_at: "2024-01-17T10:00:00Z",
    updated_at: "2024-01-17T10:05:00Z",
  },
  {
    id: "7",
    task_id: "TASK_007",
    user_message: "How do I negotiate a raise when my company is doing cost-cutting?",
    expected_intent: {
      primary: "salary_negotiation",
      secondary: ["career_strategy", "value_demonstration"],
    },
    constraints: ["Be realistic about context", "Focus on value proposition"],
    domain: "career",
    response:
      "During cost-cutting, frame your request around ROI. Document your contributions with specific metrics (revenue generated, costs saved, efficiency improvements). Propose alternatives: title change, additional responsibilities, performance bonus tied to measurable goals, or deferred raise commitment. Time your conversation after a visible win. Be prepared for 'no' and have a backup plan.",
    evaluation: {
      score: 0.78,
      intent_match: true,
      explanation: "Response addresses negotiation strategies appropriate for cost-cutting context.",
    },
    created_at: "2024-01-17T14:00:00Z",
    updated_at: "2024-01-17T14:05:00Z",
  },
  {
    id: "8",
    task_id: "TASK_008",
    user_message: "Our API documentation is outdated and developers keep asking the same questions.",
    expected_intent: {
      primary: "documentation_improvement",
      secondary: ["developer_experience", "knowledge_management"],
    },
    constraints: ["Sustainable solution", "Minimize maintenance burden"],
    domain: "engineering",
    response:
      "Implement documentation-as-code: store docs alongside API code, use OpenAPI/Swagger for auto-generation, and integrate doc updates into PR requirements. Create a FAQ section from common Slack questions. Set up a quarterly doc review cycle. Consider tools like ReadMe or GitBook for better developer experience. Add code examples for every endpoint.",
    evaluation: {
      score: 0.91,
      intent_match: true,
      explanation: "Comprehensive approach to sustainable documentation improvement.",
    },
    created_at: "2024-01-18T09:30:00Z",
    updated_at: "2024-01-18T09:35:00Z",
  },
];

// =============================================================================
// API Functions
// =============================================================================

/**
 * Fetch all tasks from the API with mock fallback
 */
export async function fetchTasks(): Promise<Task[]> {
  try {
    const response = await apiClient.get<ApiResponse<Task[]>>("/tasks");
    return response.data.data;
  } catch (error) {
    console.warn("API unavailable, using mock data:", error);
    return MOCK_TASKS;
  }
}

/**
 * Fetch a single task by ID
 */
export async function fetchTaskById(taskId: string): Promise<Task | null> {
  try {
    const response = await apiClient.get<ApiResponse<Task>>(`/tasks/${taskId}`);
    return response.data.data;
  } catch (error) {
    console.warn("API unavailable, using mock data:", error);
    // Fallback to mock data
    const mockTask = MOCK_TASKS.find(
      (t) => t.task_id === taskId || t.id === taskId
    );
    return mockTask || null;
  }
}

/**
 * Fetch task list items for table display
 */
export async function fetchTaskList(): Promise<TaskListItem[]> {
  const tasks = await fetchTasks();
  return tasks.map((task) => ({
    id: task.id,
    task_id: task.task_id,
    domain: task.domain,
    score: task.evaluation?.score ?? 0,
    intent_match: task.evaluation?.intent_match ?? false,
    status: getTaskStatus(
      task.evaluation?.score ?? 0,
      task.evaluation?.intent_match ?? false
    ),
  }));
}

/**
 * Fetch dashboard statistics
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await apiClient.get<ApiResponse<DashboardStats>>("/stats");
    return response.data.data;
  } catch (error) {
    console.warn("API unavailable, calculating from mock data:", error);
    // Calculate stats from mock data
    const tasks = MOCK_TASKS;
    const totalTasks = tasks.length;
    const scores = tasks.map((t) => t.evaluation?.score ?? 0);
    const averageScore = scores.reduce((a, b) => a + b, 0) / totalTasks;
    const passCount = tasks.filter(
      (t) => t.evaluation?.intent_match && (t.evaluation?.score ?? 0) >= 0.8
    ).length;

    return {
      totalTasks,
      averageScore,
      passRate: (passCount / totalTasks) * 100,
      failRate: ((totalTasks - passCount) / totalTasks) * 100,
      activeModel: "gpt-4.1-mini",
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Fetch score data for charts
 */
export async function fetchScoreData(): Promise<ScoreDataPoint[]> {
  const tasks = await fetchTasks();
  return tasks.map((task) => ({
    taskId: task.task_id,
    score: task.evaluation?.score ?? 0,
    timestamp: task.created_at,
    domain: task.domain,
  }));
}

/**
 * Fetch YAML configuration
 */
export async function fetchYamlConfig(configType: string): Promise<string> {
  try {
    const response = await apiClient.get<ApiResponse<string>>(`/config/${configType}`);
    return response.data.data;
  } catch (error) {
    console.warn("API unavailable, using sample YAML:", error);
    // Return sample YAML based on type
    const sampleYaml: Record<string, string> = {
      tasks: `tasks:
  - id: TASK_001
    user_message: >
      I'll be away next week and my inbox is already chaos.
    expected_intent:
      primary: email_prioritization
    constraints:
      - No travel advice
      - Focus on actionable steps

  - id: TASK_002
    user_message: >
      My team keeps missing deadlines and I don't know how to address it.
    expected_intent:
      primary: team_management
    constraints:
      - Maintain positive tone
      - No punitive measures`,
      agents: `agents:
  - id: intent_analyst
    role: You infer implied human intent accurately.
    model: gpt-4.1-mini
    temperature: 0.2

  - id: response_generator
    role: Generate helpful responses based on intent.
    model: gpt-4.1-mini
    temperature: 0.7`,
    };
    return sampleYaml[configType] || "# No configuration available";
  }
}

/**
 * Run evaluation (placeholder for future implementation)
 */
export async function runEvaluation(taskId: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiClient.post<ApiResponse<{ success: boolean; message: string }>>(
      `/evaluate/${taskId}`
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      success: false,
      message: axiosError.message || "Evaluation failed",
    };
  }
}

/**
 * Health check for API
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    await apiClient.get("/health");
    return true;
  } catch {
    return false;
  }
}
