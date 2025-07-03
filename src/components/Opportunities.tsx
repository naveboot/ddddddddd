import React, { useState } from 'react';
import { Plus, DollarSign, Calendar, User, Building, TrendingUp, Edit, Trash2, X } from 'lucide-react';

interface Opportunity {
  id: number;
  title: string;
  company: string;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  closeDate: string;
  contact: string;
  description: string;
}

interface OpportunitiesProps {
  searchTerm: string;
}

const Opportunities: React.FC<OpportunitiesProps> = ({ searchTerm }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: 1,
      title: 'Enterprise Software License',
      company: 'TechCorp Solutions',
      value: 50000,
      stage: 'negotiation',
      probability: 80,
      closeDate: '2024-02-15',
      contact: 'Sarah Johnson',
      description: 'Annual software license renewal with potential for expansion',
    },
    {
      id: 2,
      title: 'Cloud Migration Services',
      company: 'Innovate.io',
      value: 120000,
      stage: 'proposal',
      probability: 60,
      closeDate: '2024-02-28',
      contact: 'Michael Chen',
      description: 'Complete cloud infrastructure migration and optimization',
    },
    {
      id: 3,
      title: 'Digital Transformation Consulting',
      company: 'Digital Future Inc',
      value: 75000,
      stage: 'qualification',
      probability: 40,
      closeDate: '2024-03-10',
      contact: 'Emily Rodriguez',
      description: 'Strategic consulting for digital transformation initiative',
    },
    {
      id: 4,
      title: 'Custom Development Project',
      company: 'StartupX',
      value: 95000,
      stage: 'prospecting',
      probability: 25,
      closeDate: '2024-03-20',
      contact: 'David Kim',
      description: 'Custom application development with ongoing support',
    },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    value: '',
    stage: 'prospecting' as Opportunity['stage'],
    probability: '',
    closeDate: '',
    contact: '',
    description: '',
  });

  const stages = [
    { id: 'prospecting', name: 'Prospecting', color: 'bg-gray-100' },
    { id: 'qualification', name: 'Qualification', color: 'bg-blue-100' },
    { id: 'proposal', name: 'Proposal', color: 'bg-yellow-100' },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-100' },
    { id: 'closed-won', name: 'Closed Won', color: 'bg-green-100' },
    { id: 'closed-lost', name: 'Closed Lost', color: 'bg-red-100' },
  ];

  const filteredOpportunities = opportunities.filter(opp =>
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'prospecting':
        return 'bg-gray-100 text-gray-800';
      case 'qualification':
        return 'bg-blue-100 text-blue-800';
      case 'proposal':
        return 'bg-yellow-100 text-yellow-800';
      case 'negotiation':
        return 'bg-orange-100 text-orange-800';
      case 'closed-won':
        return 'bg-green-100 text-green-800';
      case 'closed-lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'text-green-600';
    if (probability >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      value: '',
      stage: 'prospecting',
      probability: '',
      closeDate: '',
      contact: '',
      description: '',
    });
  };

  const handleAddOpportunity = () => {
    if (!formData.title || !formData.company || !formData.value) return;

    const newOpportunity: Opportunity = {
      id: Math.max(...opportunities.map(o => o.id)) + 1,
      title: formData.title,
      company: formData.company,
      value: parseInt(formData.value),
      stage: formData.stage,
      probability: parseInt(formData.probability) || 0,
      closeDate: formData.closeDate,
      contact: formData.contact,
      description: formData.description,
    };

    setOpportunities([...opportunities, newOpportunity]);
    resetForm();
    setShowAddModal(false);
  };

  const handleEditOpportunity = () => {
    if (!selectedOpportunity || !formData.title || !formData.company || !formData.value) return;

    setOpportunities(opportunities.map(opp =>
      opp.id === selectedOpportunity.id
        ? {
            ...opp,
            title: formData.title,
            company: formData.company,
            value: parseInt(formData.value),
            stage: formData.stage,
            probability: parseInt(formData.probability) || 0,
            closeDate: formData.closeDate,
            contact: formData.contact,
            description: formData.description,
          }
        : opp
    ));
    setShowEditModal(false);
    setSelectedOpportunity(null);
    resetForm();
  };

  const handleDeleteOpportunity = () => {
    if (!selectedOpportunity) return;

    setOpportunities(opportunities.filter(opp => opp.id !== selectedOpportunity.id));
    setShowDeleteModal(false);
    setSelectedOpportunity(null);
  };

  const openEditModal = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setFormData({
      title: opportunity.title,
      company: opportunity.company,
      value: opportunity.value.toString(),
      stage: opportunity.stage,
      probability: opportunity.probability.toString(),
      closeDate: opportunity.closeDate,
      contact: opportunity.contact,
      description: opportunity.description,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowDeleteModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Sales Pipeline</h3>
          <p className="text-sm text-gray-600">Track and manage your sales opportunities</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Opportunity</span>
        </button>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stages.map((stage) => {
          const stageOpps = filteredOpportunities.filter(opp => opp.stage === stage.id);
          const stageValue = stageOpps.reduce((sum, opp) => sum + opp.value, 0);
          
          return (
            <div key={stage.id} className={`${stage.color} rounded-lg p-4`}>
              <h4 className="font-medium text-gray-900 text-sm mb-2">{stage.name}</h4>
              <p className="text-2xl font-bold text-gray-900">{stageOpps.length}</p>
              <p className="text-sm text-gray-600">${(stageValue / 1000).toFixed(0)}k</p>
            </div>
          );
        })}
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOpportunities.map((opportunity) => (
          <div key={opportunity.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{opportunity.title}</h4>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Building size={14} />
                  <span>{opportunity.company}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(opportunity.stage)}`}>
                  {opportunity.stage.charAt(0).toUpperCase() + opportunity.stage.slice(1).replace('-', ' ')}
                </span>
                <button 
                  onClick={() => openEditModal(opportunity)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => openDeleteModal(opportunity)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{opportunity.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <DollarSign size={16} className="text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Value</p>
                  <p className="font-semibold">${opportunity.value.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp size={16} className={getProbabilityColor(opportunity.probability)} />
                <div>
                  <p className="text-sm text-gray-600">Probability</p>
                  <p className={`font-semibold ${getProbabilityColor(opportunity.probability)}`}>
                    {opportunity.probability}%
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Close Date</p>
                  <p className="font-semibold">{new Date(opportunity.closeDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <User size={16} className="text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-semibold">{opportunity.contact}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${opportunity.probability}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 ml-2">{opportunity.probability}%</span>
            </div>
          </div>
        ))}
      </div>

      {filteredOpportunities.length === 0 && (
        <div className="text-center py-12">
          <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
          <p className="text-gray-600">Try adjusting your search terms or add a new opportunity.</p>
        </div>
      )}

      {/* Add Opportunity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add New Opportunity</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter opportunity title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter opportunity value"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value as Opportunity['stage'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="prospecting">Prospecting</option>
                  <option value="qualification">Qualification</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="closed-won">Closed Won</option>
                  <option value="closed-lost">Closed Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Probability (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter probability (0-100)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Close Date</label>
                <input
                  type="date"
                  value={formData.closeDate}
                  onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter contact name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter opportunity description"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOpportunity}
                disabled={!formData.title || !formData.company || !formData.value}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Opportunity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Opportunity Modal */}
      {showEditModal && selectedOpportunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Edit Opportunity</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter opportunity title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter opportunity value"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value as Opportunity['stage'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="prospecting">Prospecting</option>
                  <option value="qualification">Qualification</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="closed-won">Closed Won</option>
                  <option value="closed-lost">Closed Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Probability (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter probability (0-100)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Close Date</label>
                <input
                  type="date"
                  value={formData.closeDate}
                  onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter contact name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter opportunity description"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditOpportunity}
                disabled={!formData.title || !formData.company || !formData.value}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Opportunity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedOpportunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Delete Opportunity</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600">
                Are you sure you want to delete <strong>{selectedOpportunity.title}</strong>? 
                This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOpportunity}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Opportunity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Opportunities;