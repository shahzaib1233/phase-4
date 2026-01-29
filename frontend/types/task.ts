export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string;
  userId: string;
  dueDate?: Date | string | null;
}

export interface TaskFormData {
  title: string;
  description?: string;
  completed?: boolean;
  dueDate?: Date | string | null;
}

export interface TaskFilter {
  status: 'all' | 'active' | 'completed';
  searchQuery?: string;
  sortBy?: 'createdAt' | 'dueDate' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface TaskResponse {
  data: Task[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}