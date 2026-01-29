import { Task } from '@/types/task';
import { api } from '@/lib/api';

// Helper function to extract user ID from JWT token
function getUserIdFromToken(): string | null {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        // Decode JWT token to extract user ID
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
        );

        const decoded = JSON.parse(jsonPayload);
        return decoded.sub; // 'sub' field contains the user ID in JWT
      } catch (error) {
        console.error('Error decoding JWT token:', error);
        return null;
      }
    }
  }
  return null;
}

class TaskService {
  private get basePath(): string {
    const userId = getUserIdFromToken();
    if (!userId) {
      throw new Error('User not authenticated. Cannot access tasks.');
    }
    return `/api/${userId}/tasks`;
  }

  async getTasks(): Promise<Task[]> {
    try {
      const tasks = await api.get<any[]>(this.basePath);
      // Convert backend response to match frontend types
      return tasks.map(task => ({
        ...task,
        id: task.id.toString(),
        userId: task.user_id ? task.user_id.toString() : task.userId
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async getTaskById(id: string): Promise<Task> {
    try {
      const task = await api.get<any>(`${this.basePath}/${id}`);
      // Convert backend response to match frontend types
      return {
        ...task,
        id: task.id.toString(),
        userId: task.user_id ? task.user_id.toString() : task.userId
      };
    } catch (error) {
      console.error(`Error fetching task with id ${id}:`, error);
      throw error;
    }
  }

  async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'userId'>): Promise<Task> {
    try {
      // Get user ID from token to include in the request body as expected by backend
      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error('User not authenticated. Cannot create task.');
      }

      // Include user_id in the request body as expected by the backend model
      const taskDataWithUserId = {
        ...taskData,
        user_id: userId
      };

      const newTask = await api.post<any>(this.basePath, taskDataWithUserId);
      // Convert backend response to match frontend types
      return {
        ...newTask,
        id: newTask.id.toString(),
        userId: newTask.user_id ? newTask.user_id.toString() : newTask.userId
      };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(id: string, taskData: Partial<Task>): Promise<Task> {
    try {
      // Prepare the update data, excluding user_id if present to avoid conflicts
      const updateData = { ...taskData };
      if (updateData.hasOwnProperty('user_id')) {
        delete updateData.user_id;
      }
      if (updateData.hasOwnProperty('userId')) {
        delete updateData.userId;
      }

      const updatedTask = await api.put<any>(`${this.basePath}/${id}`, updateData);
      // Convert backend response to match frontend types
      return {
        ...updatedTask,
        id: updatedTask.id.toString(),
        userId: updatedTask.user_id ? updatedTask.user_id.toString() : updatedTask.userId
      };
    } catch (error) {
      console.error(`Error updating task with id ${id}:`, error);
      throw error;
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await api.delete(`${this.basePath}/${id}`);
    } catch (error) {
      console.error(`Error deleting task with id ${id}:`, error);
      throw error;
    }
  }

  async toggleTaskCompletion(id: string): Promise<Task> {
    try {
      // Use the PATCH endpoint for toggling completion status
      const updatedTask = await api.request<Task>(`${this.basePath}/${id}/complete`, {
        method: 'PATCH'
      });
      // Ensure the ID remains as a string to match the frontend type
      return {
        ...updatedTask,
        id: updatedTask.id.toString()
      };
    } catch (error) {
      console.error(`Error toggling task completion for id ${id}:`, error);
      throw error;
    }
  }
}

export const taskService = new TaskService();