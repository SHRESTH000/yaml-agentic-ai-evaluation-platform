// =============================================================================
// AI Evaluation Platform - TypeScript Types
// =============================================================================

/**
 * Represents the expected intent structure from the YAML configuration
 */
export interface ExpectedIntent {
  primary: string;
  secondary?: string[];
}

/**
 * Constraint that the AI response must adhere to
 */
export type Constraint = string;

/**
 * Evaluation result from the backend AI system
 */
export interface Evaluation {
  score: number;
  intent_match: boolean;
  explanation?: string;
  constraint_violations?: string[];
}

/**
 * Complete task structure combining YAML config and evaluation output
 */
export interface Task {
  id: string;
  task_id: string;
  user_message: string;
  expected_intent: ExpectedIntent;
  constraints: Constraint[];
  domain?: string;
  response?: string;
  evaluation?: Evaluation;
  created_at?: string;
  updated_at?: string;
}

/**
 * Task list item for the table view (subset of Task)
 */
export interface TaskListItem {
  id: string;
  task_id: string;
  domain?: string;
  score: number;
  intent_match: boolean;
  status: TaskStatus;
}

/**
 * Task status enumeration
 */
export type TaskStatus = 'pass' | 'fail' | 'partial' | 'pending';

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalTasks: number;
  averageScore: number;
  passRate: number;
  failRate: number;
  activeModel: string;
  lastUpdated: string;
}

/**
 * Chart data point for score visualization
 */
export interface ScoreDataPoint {
  taskId: string;
  score: number;
  timestamp?: string;
  domain?: string;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  timestamp: string;
}

/**
 * YAML configuration structure
 */
export interface YamlConfig {
  tasks?: Task[];
  agents?: Agent[];
  tools?: Tool[];
  evaluation?: EvaluationConfig;
}

/**
 * Agent configuration from agents.yaml
 */
export interface Agent {
  id: string;
  role: string;
  model: string;
  temperature: number;
}

/**
 * Tool configuration from tools.yaml
 */
export interface Tool {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

/**
 * Evaluation configuration
 */
export interface EvaluationConfig {
  threshold: number;
  metrics: string[];
}

/**
 * Navigation item for sidebar/header
 */
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  active?: boolean;
}

/**
 * Filter options for task list
 */
export interface TaskFilters {
  status?: TaskStatus;
  domain?: string;
  scoreRange?: [number, number];
  search?: string;
}

/**
 * Pagination state
 */
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

/**
 * Sort configuration
 */
export interface SortConfig {
  field: keyof TaskListItem;
  direction: 'asc' | 'desc';
}
