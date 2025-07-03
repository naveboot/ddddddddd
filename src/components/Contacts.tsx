import React, { useState } from 'react';
import { Plus, Mail, Phone, Building, MapPin, Star, Edit, Trash2, Users, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  location: string;
  status: 'hot' | 'warm' | 'cold';
  lastContact: string;
  avatar: string;
  isPinned: boolean;
}

interface ContactsProps {
  searchTerm: string;
}

const Contacts: React.FC<ContactsProps> = ({ searchTerm }) => {
  const { t } = useLanguage();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@techcorp.com',
      phone: '+33 1 23 45 67 89',
      company: 'TechCorp Solutions',
      position: 'Directrice Technique',
      location: 'Paris, France',
      status: 'hot',
      lastContact: '2024-01-15',
      avatar: 'SJ',
      isPinned: true,
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@innovate.io',
      phone: '+33 1 34 56 78 90',
      company: 'Innovate.io',
      position: 'VP Ingénierie',
      location: 'Lyon, France',
      status: 'warm',
      lastContact: '2024-01-12',
      avatar: 'MC',
      isPinned: false,
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.r@digitalfuture.com',
      phone: '+33 1 45 67 89 01',
      company: 'Digital Future Inc',
      position: 'Chef de Produit',
      location: 'Marseille, France',
      status: 'cold',
      lastContact: '2024-01-08',
      avatar: 'ER',
      isPinned: false,
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david.kim@startupx.com',
      phone: '+33 1 56 78 90 12',
      company: 'StartupX',
      position: 'Fondateur & PDG',
      location: 'Toulouse, France',
      status: 'hot',
      lastContact: '2024-01-14',
      avatar: 'DK',
      isPinned: false,
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    location: '',
    status: 'warm' as 'hot' | 'warm' | 'cold',
  });

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort contacts: pinned first, then by name
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return a.name.localeCompare(b.name);
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot':
        return 'bg-red-100 text-red-800';
      case 'warm':
        return 'bg-yellow-100 text-yellow-800';
      case 'cold':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'hot':
        return 'Chaud';
      case 'warm':
        return 'Tiède';
      case 'cold':
        return 'Froid';
      default:
        return status;
    }
  };

  const generateAvatar = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleAddContact = () => {
    if (!formData.name || !formData.email) return;

    const newContact: Contact = {
      id: Math.max(...contacts.map(c => c.id)) + 1,
      ...formData,
      avatar: generateAvatar(formData.name),
      lastContact: new Date().toISOString().split('T')[0],
      isPinned: false,
    };

    setContacts([...contacts, newContact]);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      location: '',
      status: 'warm',
    });
    setShowAddModal(false);
  };

  const handleEditContact = () => {
    if (!selectedContact || !formData.name || !formData.email) return;

    setContacts(contacts.map(contact =>
      contact.id === selectedContact.id
        ? {
            ...contact,
            ...formData,
            avatar: generateAvatar(formData.name),
          }
        : contact
    ));
    setShowEditModal(false);
    setSelectedContact(null);
  };

  const handleDeleteContact = () => {
    if (!selectedContact) return;

    setContacts(contacts.filter(contact => contact.id !== selectedContact.id));
    setShowDeleteModal(false);
    setSelectedContact(null);
  };

  const togglePinContact = (contactId: number) => {
    setContacts(contacts.map(contact =>
      contact.id === contactId
        ? { ...contact, isPinned: !contact.isPinned }
        : contact
    ));
  };

  const openEditModal = (contact: Contact) => {
    setSelectedContact(contact);
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      position: contact.position,
      location: contact.location,
      status: contact.status,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (contact: Contact) => {
    setSelectedContact(contact);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      location: '',
      status: 'warm',
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t('allContacts')}</h3>
          <p className="text-sm text-gray-600">{t('manageContacts')}</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>{t('addContact')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedContacts.map((contact) => (
          <div key={contact.id} className={`bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow ${
            contact.isPinned ? 'border-blue-300 ring-1 ring-blue-100' : 'border-gray-100'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-semibold">
                  {contact.avatar}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                    {contact.isPinned && (
                      <Star size={16} className="text-yellow-500 fill-current" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{contact.position}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => togglePinContact(contact.id)}
                  className={`p-1 transition-colors ${
                    contact.isPinned 
                      ? 'text-yellow-500 hover:text-yellow-600' 
                      : 'text-gray-400 hover:text-yellow-500'
                  }`}
                >
                  <Star size={16} className={contact.isPinned ? 'fill-current' : ''} />
                </button>
                <button 
                  onClick={() => openEditModal(contact)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => openDeleteModal(contact)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Building size={14} />
                <span>{contact.company}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail size={14} />
                <span>{contact.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone size={14} />
                <span>{contact.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin size={14} />
                <span>{contact.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                {getStatusLabel(contact.status)}
              </span>
              <span className="text-xs text-gray-500">
                Dernier contact: {new Date(contact.lastContact).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {sortedContacts.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun contact trouvé</h3>
          <p className="text-gray-600">Essayez d'ajuster vos termes de recherche ou ajoutez un nouveau contact.</p>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{t('addNewContact')}</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')} *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le nom complet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')} *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez l'adresse email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le numéro de téléphone"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('company')}</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le nom de l'entreprise"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('position')}</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le titre du poste"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('location')}</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez la localisation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('status')}</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'hot' | 'warm' | 'cold' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="hot">Chaud</option>
                  <option value="warm">Tiède</option>
                  <option value="cold">Froid</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleAddContact}
                disabled={!formData.name || !formData.email}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('addContact')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contact Modal */}
      {showEditModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{t('editContact')}</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')} *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le nom complet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')} *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez l'adresse email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le numéro de téléphone"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('company')}</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le nom de l'entreprise"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('position')}</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le titre du poste"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('location')}</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez la localisation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('status')}</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'hot' | 'warm' | 'cold' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="hot">Chaud</option>
                  <option value="warm">Tiède</option>
                  <option value="cold">Froid</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleEditContact}
                disabled={!formData.name || !formData.email}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('update')} Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{t('deleteContact')}</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600">
                Êtes-vous sûr de vouloir supprimer <strong>{selectedContact.name}</strong> ? 
                Cette action ne peut pas être annulée.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleDeleteContact}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;