'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    language: string;
  };
}

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  items: number;
}

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max.mustermann@example.com',
    phone: '+49 123 456789',
    company: 'Mustermann GmbH',
    address: {
      street: 'Musterstraße 123',
      city: 'München',
      postalCode: '80331',
      country: 'Deutschland'
    },
    preferences: {
      newsletter: true,
      notifications: true,
      language: 'de'
    }
  });

  const [orders] = useState<Order[]>([
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 299.99,
      items: 3
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-20',
      status: 'processing',
      total: 149.50,
      items: 1
    }
  ]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Profile updated successfully:', data);
        setIsEditing(false);
        // Optional: Show success message
      } else {
        const error = await response.json();
        console.error('Failed to update profile:', error);
        // Optional: Show error message
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Ausstehend';
      case 'processing': return 'In Bearbeitung';
      case 'shipped': return 'Versandt';
      case 'delivered': return 'Zugestellt';
      default: return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mein Profil</h1>
        <p className="mt-2 text-gray-600">Verwalten Sie Ihre Kontoinformationen und Einstellungen</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'profile', label: 'Profil' },
            { id: 'orders', label: 'Bestellungen' },
            { id: 'settings', label: 'Einstellungen' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Persönliche Informationen</h2>
            <Button
              variant={isEditing ? 'secondary' : 'primary'}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? 'Speichern' : 'Bearbeiten'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vorname
              </label>
              <input
                type="text"
                value={userData.firstName}
                onChange={(e) => setUserData(prev => ({ ...prev, firstName: e.target.value }))}
                disabled={!isEditing}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nachname
              </label>
              <input
                type="text"
                value={userData.lastName}
                onChange={(e) => setUserData(prev => ({ ...prev, lastName: e.target.value }))}
                disabled={!isEditing}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-Mail
              </label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                disabled={!isEditing}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon
              </label>
              <input
                type="tel"
                value={userData.phone}
                onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                disabled={!isEditing}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unternehmen (optional)
              </label>
              <input
                type="text"
                value={userData.company}
                onChange={(e) => setUserData(prev => ({ ...prev, company: e.target.value }))}
                disabled={!isEditing}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Straße und Hausnummer
                </label>
                <input
                  type="text"
                  value={userData.address.street}
                  onChange={(e) => setUserData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, street: e.target.value }
                  }))}
                  disabled={!isEditing}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PLZ
                </label>
                <input
                  type="text"
                  value={userData.address.postalCode}
                  onChange={(e) => setUserData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, postalCode: e.target.value }
                  }))}
                  disabled={!isEditing}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stadt
                </label>
                <input
                  type="text"
                  value={userData.address.city}
                  onChange={(e) => setUserData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, city: e.target.value }
                  }))}
                  disabled={!isEditing}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Meine Bestellungen</h2>
          
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">Bestellung {order.id}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(order.date).toLocaleDateString('de-DE')} • {order.items} Artikel
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      getStatusColor(order.status)
                    }`}>
                      {getStatusText(order.status)}
                    </span>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {order.total.toLocaleString('de-DE', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-3">
                  <Button variant="secondary" size="sm">
                    Details anzeigen
                  </Button>
                  {order.status === 'delivered' && (
                    <Button variant="secondary" size="sm">
                      Erneut bestellen
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Einstellungen</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Benachrichtigungen</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Newsletter</label>
                    <p className="text-sm text-gray-600">Erhalten Sie Updates zu neuen Produkten und Angeboten</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={userData.preferences.newsletter}
                    onChange={(e) => setUserData(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, newsletter: e.target.checked }
                    }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Bestellbenachrichtigungen</label>
                    <p className="text-sm text-gray-600">Erhalten Sie Updates zu Ihren Bestellungen</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={userData.preferences.notifications}
                    onChange={(e) => setUserData(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, notifications: e.target.checked }
                    }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sprache</h3>
              <select
                value={userData.preferences.language}
                onChange={(e) => setUserData(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, language: e.target.value }
                }))}
                className="w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="de">Deutsch</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <Button variant="primary" onClick={handleSave}>
                Einstellungen speichern
              </Button>
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  );
}