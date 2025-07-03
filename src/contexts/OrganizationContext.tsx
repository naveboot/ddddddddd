import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Organization {
  id: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
  avatar: string;
  memberCount: number;
  plan: 'starter' | 'professional' | 'enterprise';
}

interface OrganizationContextType {
  currentOrganization: Organization | null;
  organizations: Organization[];
  setCurrentOrganization: (org: Organization) => void;
  addOrganization: (org: Organization) => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

const defaultOrganizations: Organization[] = [
  {
    id: '1',
    name: 'GDP Technologies',
    role: 'owner',
    avatar: 'GT',
    memberCount: 12,
    plan: 'enterprise',
  },
  {
    id: '2',
    name: 'Startup Incubator',
    role: 'admin',
    avatar: 'SI',
    memberCount: 8,
    plan: 'professional',
  },
  {
    id: '3',
    name: 'Consulting Group',
    role: 'member',
    avatar: 'CG',
    memberCount: 25,
    plan: 'enterprise',
  },
];

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    const saved = localStorage.getItem('gdpilia-organizations');
    return saved ? JSON.parse(saved) : defaultOrganizations;
  });

  const [currentOrganization, setCurrentOrganizationState] = useState<Organization | null>(() => {
    const saved = localStorage.getItem('gdpilia-current-organization');
    if (saved) {
      const savedOrg = JSON.parse(saved);
      return organizations.find(org => org.id === savedOrg.id) || organizations[0];
    }
    return organizations[0];
  });

  const setCurrentOrganization = (org: Organization) => {
    setCurrentOrganizationState(org);
    localStorage.setItem('gdpilia-current-organization', JSON.stringify(org));
  };

  const addOrganization = (org: Organization) => {
    const newOrganizations = [...organizations, org];
    setOrganizations(newOrganizations);
    localStorage.setItem('gdpilia-organizations', JSON.stringify(newOrganizations));
  };

  useEffect(() => {
    localStorage.setItem('gdpilia-organizations', JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    if (currentOrganization) {
      localStorage.setItem('gdpilia-current-organization', JSON.stringify(currentOrganization));
    }
  }, [currentOrganization]);

  return (
    <OrganizationContext.Provider value={{
      currentOrganization,
      organizations,
      setCurrentOrganization,
      addOrganization,
    }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};