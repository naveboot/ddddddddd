import { httpClient, ApiResponse, PaginatedResponse, apiUtils } from './api';

// Contact related types
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  location?: string;
  status: 'hot' | 'warm' | 'cold';
  avatar?: string;
  isPinned: boolean;
  tags: string[];
  notes?: string;
  lastContactDate?: string;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
}

export interface CreateContactData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  location?: string;
  status?: 'hot' | 'warm' | 'cold';
  tags?: string[];
  notes?: string;
}

export interface UpdateContactData extends Partial<CreateContactData> {
  isPinned?: boolean;
}

export interface ContactFilters {
  status?: 'hot' | 'warm' | 'cold';
  company?: string;
  tags?: string[];
  isPinned?: boolean;
  search?: string;
}

export interface ContactStats {
  total: number;
  hot: number;
  warm: number;
  cold: number;
  pinned: number;
  recentlyAdded: number;
}

// Contact service class
class ContactService {
  /**
   * Get all contacts with pagination and filters
   */
  async getContacts(
    page: number = 1,
    limit: number = 20,
    filters?: ContactFilters
  ): Promise<PaginatedResponse<Contact>> {
    try {
      const params = apiUtils.createPaginationParams(page, limit, filters?.search);
      
      // Add filter parameters
      if (filters) {
        if (filters.status) params.status = filters.status;
        if (filters.company) params.company = filters.company;
        if (filters.tags?.length) params.tags = filters.tags.join(',');
        if (filters.isPinned !== undefined) params.isPinned = filters.isPinned;
      }

      const response = await httpClient.get<Contact[]>('/contacts', apiUtils.formatParams(params));
      
      if (response.success) {
        return response as PaginatedResponse<Contact>;
      }
      
      throw new Error(response.message || 'Failed to fetch contacts');
    } catch (error) {
      console.error('Get contacts error:', error);
      throw error;
    }
  }

  /**
   * Get contact by ID
   */
  async getContact(id: string): Promise<Contact> {
    try {
      const response = await httpClient.get<Contact>(`/contacts/${id}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch contact');
    } catch (error) {
      console.error('Get contact error:', error);
      throw error;
    }
  }

  /**
   * Create new contact
   */
  async createContact(contactData: CreateContactData): Promise<Contact> {
    try {
      const response = await httpClient.post<Contact>('/contacts', contactData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to create contact');
    } catch (error) {
      console.error('Create contact error:', error);
      throw error;
    }
  }

  /**
   * Update contact
   */
  async updateContact(id: string, contactData: UpdateContactData): Promise<Contact> {
    try {
      const response = await httpClient.put<Contact>(`/contacts/${id}`, contactData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update contact');
    } catch (error) {
      console.error('Update contact error:', error);
      throw error;
    }
  }

  /**
   * Delete contact
   */
  async deleteContact(id: string): Promise<void> {
    try {
      const response = await httpClient.delete(`/contacts/${id}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete contact');
      }
    } catch (error) {
      console.error('Delete contact error:', error);
      throw error;
    }
  }

  /**
   * Toggle contact pin status
   */
  async togglePin(id: string): Promise<Contact> {
    try {
      const response = await httpClient.patch<Contact>(`/contacts/${id}/pin`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to toggle pin status');
    } catch (error) {
      console.error('Toggle pin error:', error);
      throw error;
    }
  }

  /**
   * Update contact status
   */
  async updateStatus(id: string, status: 'hot' | 'warm' | 'cold'): Promise<Contact> {
    try {
      const response = await httpClient.patch<Contact>(`/contacts/${id}/status`, { status });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update contact status');
    } catch (error) {
      console.error('Update status error:', error);
      throw error;
    }
  }

  /**
   * Add tags to contact
   */
  async addTags(id: string, tags: string[]): Promise<Contact> {
    try {
      const response = await httpClient.patch<Contact>(`/contacts/${id}/tags`, { tags });
      
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
   * Remove tags from contact
   */
  async removeTags(id: string, tags: string[]): Promise<Contact> {
    try {
      const response = await httpClient.patch<Contact>(`/contacts/${id}/tags/remove`, { tags });
      
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
   * Get contact statistics
   */
  async getContactStats(): Promise<ContactStats> {
    try {
      const response = await httpClient.get<ContactStats>('/contacts/stats');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch contact statistics');
    } catch (error) {
      console.error('Get contact stats error:', error);
      throw error;
    }
  }

  /**
   * Search contacts
   */
  async searchContacts(query: string, limit: number = 10): Promise<Contact[]> {
    try {
      const response = await httpClient.get<Contact[]>('/contacts/search', {
        q: query,
        limit: limit.toString(),
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to search contacts');
    } catch (error) {
      console.error('Search contacts error:', error);
      throw error;
    }
  }

  /**
   * Import contacts from CSV
   */
  async importContacts(file: File): Promise<{ imported: number; errors: string[] }> {
    try {
      const response = await httpClient.upload<{ imported: number; errors: string[] }>(
        '/contacts/import',
        file
      );
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to import contacts');
    } catch (error) {
      console.error('Import contacts error:', error);
      throw error;
    }
  }

  /**
   * Export contacts to CSV
   */
  async exportContacts(filters?: ContactFilters): Promise<Blob> {
    try {
      const params: Record<string, string> = {};
      
      if (filters) {
        if (filters.status) params.status = filters.status;
        if (filters.company) params.company = filters.company;
        if (filters.tags?.length) params.tags = filters.tags.join(',');
        if (filters.isPinned !== undefined) params.isPinned = filters.isPinned.toString();
        if (filters.search) params.search = filters.search;
      }

      const queryString = new URLSearchParams(params).toString();
      const url = `${httpClient['baseURL']}/contacts/export${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${httpClient['getToken']()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to export contacts');
      }
      
      return await response.blob();
    } catch (error) {
      console.error('Export contacts error:', error);
      throw error;
    }
  }

  /**
   * Get all available tags
   */
  async getTags(): Promise<string[]> {
    try {
      const response = await httpClient.get<string[]>('/contacts/tags');
      
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
   * Get recent contacts
   */
  async getRecentContacts(limit: number = 5): Promise<Contact[]> {
    try {
      const response = await httpClient.get<Contact[]>('/contacts/recent', {
        limit: limit.toString(),
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch recent contacts');
    } catch (error) {
      console.error('Get recent contacts error:', error);
      throw error;
    }
  }
}

// Create and export service instance
export const contactService = new ContactService();

// Export for convenience
export default contactService;