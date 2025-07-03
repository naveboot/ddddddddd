import { httpClient, ApiResponse, PaginatedResponse, apiUtils } from './api';

// Opportunity related types
export interface Opportunity {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  closeDate: string;
  contact?: string;
  contactId?: string;
  description?: string;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
}

export interface CreateOpportunityData {
  title: string;
  company: string;
  value: number;
  stage?: Opportunity['stage'];
  probability?: number;
  closeDate: string;
  contactId?: string;
  description?: string;
  tags?: string[];
  notes?: string;
}

export interface UpdateOpportunityData extends Partial<CreateOpportunityData> {}

export interface OpportunityFilters {
  stage?: Opportunity['stage'];
  company?: string;
  contactId?: string;
  minValue?: number;
  maxValue?: number;
  minProbability?: number;
  maxProbability?: number;
  tags?: string[];
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface OpportunityStats {
  total: number;
  totalValue: number;
  averageValue: number;
  averageProbability: number;
  byStage: Record<Opportunity['stage'], { count: number; value: number }>;
  conversionRate: number;
  wonDeals: number;
  lostDeals: number;
}

export interface PipelineData {
  stage: Opportunity['stage'];
  count: number;
  value: number;
  averageValue: number;
  averageProbability: number;
}

// Opportunity service class
class OpportunityService {
  /**
   * Get all opportunities with pagination and filters
   */
  async getOpportunities(
    page: number = 1,
    limit: number = 20,
    filters?: OpportunityFilters
  ): Promise<PaginatedResponse<Opportunity>> {
    try {
      const params = apiUtils.createPaginationParams(page, limit, filters?.search);
      
      // Add filter parameters
      if (filters) {
        if (filters.stage) params.stage = filters.stage;
        if (filters.company) params.company = filters.company;
        if (filters.contactId) params.contactId = filters.contactId;
        if (filters.minValue) params.minValue = filters.minValue;
        if (filters.maxValue) params.maxValue = filters.maxValue;
        if (filters.minProbability) params.minProbability = filters.minProbability;
        if (filters.maxProbability) params.maxProbability = filters.maxProbability;
        if (filters.tags?.length) params.tags = filters.tags.join(',');
        if (filters.dateFrom) params.dateFrom = filters.dateFrom;
        if (filters.dateTo) params.dateTo = filters.dateTo;
      }

      const response = await httpClient.get<Opportunity[]>('/opportunities', apiUtils.formatParams(params));
      
      if (response.success) {
        return response as PaginatedResponse<Opportunity>;
      }
      
      throw new Error(response.message || 'Failed to fetch opportunities');
    } catch (error) {
      console.error('Get opportunities error:', error);
      throw error;
    }
  }

  /**
   * Get opportunity by ID
   */
  async getOpportunity(id: string): Promise<Opportunity> {
    try {
      const response = await httpClient.get<Opportunity>(`/opportunities/${id}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch opportunity');
    } catch (error) {
      console.error('Get opportunity error:', error);
      throw error;
    }
  }

  /**
   * Create new opportunity
   */
  async createOpportunity(opportunityData: CreateOpportunityData): Promise<Opportunity> {
    try {
      const response = await httpClient.post<Opportunity>('/opportunities', opportunityData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to create opportunity');
    } catch (error) {
      console.error('Create opportunity error:', error);
      throw error;
    }
  }

  /**
   * Update opportunity
   */
  async updateOpportunity(id: string, opportunityData: UpdateOpportunityData): Promise<Opportunity> {
    try {
      const response = await httpClient.put<Opportunity>(`/opportunities/${id}`, opportunityData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update opportunity');
    } catch (error) {
      console.error('Update opportunity error:', error);
      throw error;
    }
  }

  /**
   * Delete opportunity
   */
  async deleteOpportunity(id: string): Promise<void> {
    try {
      const response = await httpClient.delete(`/opportunities/${id}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete opportunity');
      }
    } catch (error) {
      console.error('Delete opportunity error:', error);
      throw error;
    }
  }

  /**
   * Update opportunity stage
   */
  async updateStage(id: string, stage: Opportunity['stage']): Promise<Opportunity> {
    try {
      const response = await httpClient.patch<Opportunity>(`/opportunities/${id}/stage`, { stage });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update opportunity stage');
    } catch (error) {
      console.error('Update stage error:', error);
      throw error;
    }
  }

  /**
   * Update opportunity probability
   */
  async updateProbability(id: string, probability: number): Promise<Opportunity> {
    try {
      const response = await httpClient.patch<Opportunity>(`/opportunities/${id}/probability`, { probability });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update opportunity probability');
    } catch (error) {
      console.error('Update probability error:', error);
      throw error;
    }
  }

  /**
   * Add tags to opportunity
   */
  async addTags(id: string, tags: string[]): Promise<Opportunity> {
    try {
      const response = await httpClient.patch<Opportunity>(`/opportunities/${id}/tags`, { tags });
      
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
   * Remove tags from opportunity
   */
  async removeTags(id: string, tags: string[]): Promise<Opportunity> {
    try {
      const response = await httpClient.patch<Opportunity>(`/opportunities/${id}/tags/remove`, { tags });
      
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
   * Get opportunity statistics
   */
  async getOpportunityStats(filters?: OpportunityFilters): Promise<OpportunityStats> {
    try {
      const params: Record<string, string> = {};
      
      if (filters) {
        if (filters.stage) params.stage = filters.stage;
        if (filters.company) params.company = filters.company;
        if (filters.contactId) params.contactId = filters.contactId;
        if (filters.dateFrom) params.dateFrom = filters.dateFrom;
        if (filters.dateTo) params.dateTo = filters.dateTo;
      }

      const response = await httpClient.get<OpportunityStats>('/opportunities/stats', params);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch opportunity statistics');
    } catch (error) {
      console.error('Get opportunity stats error:', error);
      throw error;
    }
  }

  /**
   * Get pipeline data
   */
  async getPipelineData(filters?: OpportunityFilters): Promise<PipelineData[]> {
    try {
      const params: Record<string, string> = {};
      
      if (filters) {
        if (filters.company) params.company = filters.company;
        if (filters.contactId) params.contactId = filters.contactId;
        if (filters.dateFrom) params.dateFrom = filters.dateFrom;
        if (filters.dateTo) params.dateTo = filters.dateTo;
      }

      const response = await httpClient.get<PipelineData[]>('/opportunities/pipeline', params);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch pipeline data');
    } catch (error) {
      console.error('Get pipeline data error:', error);
      throw error;
    }
  }

  /**
   * Search opportunities
   */
  async searchOpportunities(query: string, limit: number = 10): Promise<Opportunity[]> {
    try {
      const response = await httpClient.get<Opportunity[]>('/opportunities/search', {
        q: query,
        limit: limit.toString(),
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to search opportunities');
    } catch (error) {
      console.error('Search opportunities error:', error);
      throw error;
    }
  }

  /**
   * Get opportunities by contact
   */
  async getOpportunitiesByContact(contactId: string): Promise<Opportunity[]> {
    try {
      const response = await httpClient.get<Opportunity[]>(`/opportunities/contact/${contactId}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch opportunities by contact');
    } catch (error) {
      console.error('Get opportunities by contact error:', error);
      throw error;
    }
  }

  /**
   * Get recent opportunities
   */
  async getRecentOpportunities(limit: number = 5): Promise<Opportunity[]> {
    try {
      const response = await httpClient.get<Opportunity[]>('/opportunities/recent', {
        limit: limit.toString(),
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch recent opportunities');
    } catch (error) {
      console.error('Get recent opportunities error:', error);
      throw error;
    }
  }

  /**
   * Get opportunities closing soon
   */
  async getOpportunitiesClosingSoon(days: number = 7): Promise<Opportunity[]> {
    try {
      const response = await httpClient.get<Opportunity[]>('/opportunities/closing-soon', {
        days: days.toString(),
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch opportunities closing soon');
    } catch (error) {
      console.error('Get opportunities closing soon error:', error);
      throw error;
    }
  }

  /**
   * Get all available tags
   */
  async getTags(): Promise<string[]> {
    try {
      const response = await httpClient.get<string[]>('/opportunities/tags');
      
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
   * Export opportunities to CSV
   */
  async exportOpportunities(filters?: OpportunityFilters): Promise<Blob> {
    try {
      const params: Record<string, string> = {};
      
      if (filters) {
        if (filters.stage) params.stage = filters.stage;
        if (filters.company) params.company = filters.company;
        if (filters.contactId) params.contactId = filters.contactId;
        if (filters.minValue) params.minValue = filters.minValue.toString();
        if (filters.maxValue) params.maxValue = filters.maxValue.toString();
        if (filters.tags?.length) params.tags = filters.tags.join(',');
        if (filters.dateFrom) params.dateFrom = filters.dateFrom;
        if (filters.dateTo) params.dateTo = filters.dateTo;
        if (filters.search) params.search = filters.search;
      }

      const queryString = new URLSearchParams(params).toString();
      const url = `${httpClient['baseURL']}/opportunities/export${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${httpClient['getToken']()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to export opportunities');
      }
      
      return await response.blob();
    } catch (error) {
      console.error('Export opportunities error:', error);
      throw error;
    }
  }
}

// Create and export service instance
export const opportunityService = new OpportunityService();

// Export for convenience
export default opportunityService;