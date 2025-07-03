import { httpClient, ApiResponse, PaginatedResponse, apiUtils } from './api';

// Task related types
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  assigneeId?: string;
  assignee?: string;
  relatedTo?: string;
  relatedType?: 'contact' | 'opportunity' | 'organization';
  relatedId?: string;
  type: 'call' | 'email' | 'meeting' | 'follow-up' | 'other';
  tags: string[];
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: Task['priority'];
  status?: Task['status'];
  dueDate: string;
  assigneeId?: string;
  relatedTo?: string;
  relatedType?: Task['relatedType'];
  relatedId?: string;
  type?: Task['type'];
  tags?: string[];
  notes?: string;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {}

export interface TaskFilters {
  status?: Task['status'];
  priority?: Task['priority'];
  type?: Task['type'];
  assigneeId?: string;
  relatedType?: Task['relatedType'];
  relatedId?: string;
  tags?: string[];
  search?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  overdue?: boolean;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  dueToday: number;
  dueTomorrow: number;
  dueThisWeek: number;
  byPriority: Record<Task['priority'], number>;
  byType: Record<Task['type'], number>;
  completionRate: number;
}

// Task service class
class TaskService {
  /**
   * Get all tasks with pagination and filters
   */
  async getTasks(
    page: number = 1,
    limit: number = 20,
    filters?: TaskFilters
  ): Promise<PaginatedResponse<Task>> {
    try {
      const params = apiUtils.createPaginationParams(page, limit, filters?.search);
      
      // Add filter parameters
      if (filters) {
        if (filters.status) params.status = filters.status;
        if (filters.priority) params.priority = filters.priority;
        if (filters.type) params.type = filters.type;
        if (filters.assigneeId) params.assigneeId = filters.assigneeId;
        if (filters.relatedType) params.relatedType = filters.relatedType;
        if (filters.relatedId) params.relatedId = filters.relatedId;
        if (filters.tags?.length) params.tags = filters.tags.join(',');
        if (filters.dueDateFrom) params.dueDateFrom = filters.dueDateFrom;
        if (filters.dueDateTo) params.dueDateTo = filters.dueDateTo;
        if (filters.overdue !== undefined) params.overdue = filters.overdue;
      }

      const response = await httpClient.get<Task[]>('/tasks', apiUtils.formatParams(params));
      
      if (response.success) {
        return response as PaginatedResponse<Task>;
      }
      
      throw new Error(response.message || 'Failed to fetch tasks');
    } catch (error) {
      console.error('Get tasks error:', error);
      throw error;
    }
  }

  /**
   * Get task by ID
   */
  async getTask(id: string): Promise<Task> {
    try {
      const response = await httpClient.get<Task>(`/tasks/${id}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch task');
    } catch (error) {
      console.error('Get task error:', error);
      throw error;
    }
  }

  /**
   * Create new task
   */
  async createTask(taskData: CreateTaskData): Promise<Task> {
    try {
      const response = await httpClient.post<Task>('/tasks', taskData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to create task');
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  }

  /**
   * Update task
   */
  async updateTask(id: string, taskData: UpdateTaskData): Promise<Task> {
    try {
      const response = await httpClient.put<Task>(`/tasks/${id}`, taskData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update task');
    } catch (error) {
      console.error('Update task error:', error);
      throw error;
    }
  }

  /**
   * Delete task
   */
  async deleteTask(id: string): Promise<void> {
    try {
      const response = await httpClient.delete(`/tasks/${id}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Delete task error:', error);
      throw error;
    }
  }

  /**
   * Update task status
   */
  async updateStatus(id: string, status: Task['status']): Promise<Task> {
    try {
      const response = await httpClient.patch<Task>(`/tasks/${id}/status`, { status });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update task status');
    } catch (error) {
      console.error('Update status error:', error);
      throw error;
    }
  }

  /**
   * Update task priority
   */
  async updatePriority(id: string, priority: Task['priority']): Promise<Task> {
    try {
      const response = await httpClient.patch<Task>(`/tasks/${id}/priority`, { priority });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update task priority');
    } catch (error) {
      console.error('Update priority error:', error);
      throw error;
    }
  }

  /**
   * Assign task to user
   */
  async assignTask(id: string, assigneeId: string): Promise<Task> {
    try {
      const response = await httpClient.patch<Task>(`/tasks/${id}/assign`, { assigneeId });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to assign task');
    } catch (error) {
      console.error('Assign task error:', error);
      throw error;
    }
  }

  /**
   * Complete task
   */
  async completeTask(id: string): Promise<Task> {
    try {
      const response = await httpClient.patch<Task>(`/tasks/${id}/complete`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to complete task');
    } catch (error) {
      console.error('Complete task error:', error);
      throw error;
    }
  }

  /**
   * Reopen task
   */
  async reopenTask(id: string): Promise<Task> {
    try {
      const response = await httpClient.patch<Task>(`/tasks/${id}/reopen`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to reopen task');
    } catch (error) {
      console.error('Reopen task error:', error);
      throw error;
    }
  }

  /**
   * Add tags to task
   */
  async addTags(id: string, tags: string[]): Promise<Task> {
    try {
      const response = await httpClient.patch<Task>(`/tasks/${id}/tags`, { tags });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to add tags');
    } catch (error) {
      console.error('Add tags error:', error);
      throw error;
    }
  }

  /**
   * Remove tags from task
   */
  async removeTags(id: string, tags: string[]): Promise<Task> {
    try {
      const response = await httpClient.patch<Task>(`/tasks/${id}/tags/remove`, { tags });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to remove tags');
    } catch (error) {
      console.error('Remove tags error:', error);
      throw error;
    }
  }

  /**
   * Get task statistics
   */
  async getTaskStats(filters?: TaskFilters): Promise<TaskStats> {
    try {
      const params: Record<string, string> = {};
      
      if (filters) {
        if (filters.assigneeId) params.assigneeId = filters.assigneeId;
        if (filters.relatedType) params.relatedType = filters.relatedType;
        if (filters.relatedId) params.relatedId = filters.relatedId;
        if (filters.dueDateFrom) params.dueDateFrom = filters.dueDateFrom;
        if (filters.dueDateTo) params.dueDateTo = filters.dueDateTo;
      }

      const response = await httpClient.get<TaskStats>('/tasks/stats', params);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch task statistics');
    } catch (error) {
      console.error('Get task stats error:', error);
      throw error;
    }
  }

  /**
   * Search tasks
   */
  async searchTasks(query: string, limit: number = 10): Promise<Task[]> {
    try {
      const response = await httpClient.get<Task[]>('/tasks/search', {
        q: query,
        limit: limit.toString(),
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to search tasks');
    } catch (error) {
      console.error('Search tasks error:', error);
      throw error;
    }
  }

  /**
   * Get tasks by assignee
   */
  async getTasksByAssignee(assigneeId: string): Promise<Task[]> {
    try {
      const response = await httpClient.get<Task[]>(`/tasks/assignee/${assigneeId}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch tasks by assignee');
    } catch (error) {
      console.error('Get tasks by assignee error:', error);
      throw error;
    }
  }

  /**
   * Get overdue tasks
   */
  async getOverdueTasks(): Promise<Task[]> {
    try {
      const response = await httpClient.get<Task[]>('/tasks/overdue');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch overdue tasks');
    } catch (error) {
      console.error('Get overdue tasks error:', error);
      throw error;
    }
  }

  /**
   * Get tasks due today
   */
  async getTasksDueToday(): Promise<Task[]> {
    try {
      const response = await httpClient.get<Task[]>('/tasks/due-today');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch tasks due today');
    } catch (error) {
      console.error('Get tasks due today error:', error);
      throw error;
    }
  }

  /**
   * Get recent tasks
   */
  async getRecentTasks(limit: number = 5): Promise<Task[]> {
    try {
      const response = await httpClient.get<Task[]>('/tasks/recent', {
        limit: limit.toString(),
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch recent tasks');
    } catch (error) {
      console.error('Get recent tasks error:', error);
      throw error;
    }
  }

  /**
   * Get all available tags
   */
  async getTags(): Promise<string[]> {
    try {
      const response = await httpClient.get<string[]>('/tasks/tags');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch tags');
    } catch (error) {
      console.error('Get tags error:', error);
      throw error;
    }
  }

  /**
   * Export tasks to CSV
   */
  async exportTasks(filters?: TaskFilters): Promise<Blob> {
    try {
      const params: Record<string, string> = {};
      
      if (filters) {
        if (filters.status) params.status = filters.status;
        if (filters.priority) params.priority = filters.priority;
        if (filters.type) params.type = filters.type;
        if (filters.assigneeId) params.assigneeId = filters.assigneeId;
        if (filters.relatedType) params.relatedType = filters.relatedType;
        if (filters.relatedId) params.relatedId = filters.relatedId;
        if (filters.tags?.length) params.tags = filters.tags.join(',');
        if (filters.dueDateFrom) params.dueDateFrom = filters.dueDateFrom;
        if (filters.dueDateTo) params.dueDateTo = filters.dueDateTo;
        if (filters.search) params.search = filters.search;
      }

      const queryString = new URLSearchParams(params).toString();
      const url = `${httpClient['baseURL']}/tasks/export${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${httpClient['getToken']()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to export tasks');
      }
      
      return await response.blob();
    } catch (error) {
      console.error('Export tasks error:', error);
      throw error;
    }
  }
}

// Create and export service instance
export const taskService = new TaskService();

// Export for convenience
export default taskService;