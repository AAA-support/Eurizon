import React, { useState } from 'react';
import { Users, FileText, CreditCard, Plus, Trash2, Edit, Download, Upload, DollarSign, Settings, UserPlus, Search, Filter } from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([
    { id: 1, name: 'John Smith', email: 'john@example.com', role: 'Client', status: 'Active', balance: 15000, joined: '2024-01-15' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Client', status: 'Active', balance: 25000, joined: '2024-02-20' },
    { id: 3, name: 'Mike Wilson', email: 'mike@example.com', role: 'Premium', status: 'Active', balance: 50000, joined: '2024-01-08' },
    { id: 4, name: 'Emma Davis', email: 'emma@example.com', role: 'Client', status: 'Inactive', balance: 5000, joined: '2024-03-10' }
  ]);

  const [documents, setDocuments] = useState([
    { id: 1, title: 'Investment Policy 2024', type: 'Policy', category: 'General', uploadDate: '2024-01-15', size: '2.4 MB', status: 'Published' },
    { id: 2, title: 'Q1 Market Report', type: 'Report', category: 'Analytics', uploadDate: '2024-03-01', size: '5.1 MB', status: 'Published' },
    { id: 3, title: 'Risk Assessment Guide', type: 'Guide', category: 'Education', uploadDate: '2024-02-10', size: '1.8 MB', status: 'Draft' },
    { id: 4, title: 'Account Terms & Conditions', type: 'Legal', category: 'Legal', uploadDate: '2024-01-20', size: '3.2 MB', status: 'Published' }
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, name: 'Credit Card', type: 'Visa/Mastercard', fees: '2.9% + $0.30', status: 'Active', limits: 'Min: $10, Max: $50,000' },
    { id: 2, name: 'Bank Transfer', type: 'ACH', fees: '$5 flat fee', status: 'Active', limits: 'Min: $100, Max: $100,000' },
    { id: 3, name: 'PayPal', type: 'Digital Wallet', fees: '3.5%', status: 'Active', limits: 'Min: $10, Max: $25,000' },
    { id: 4, name: 'Wire Transfer', type: 'International', fees: '$25 flat fee', status: 'Active', limits: 'Min: $1,000, No Max' }
  ]);

  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleDeleteDocument = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleDeletePayment = (id) => {
    setPaymentMethods(paymentMethods.filter(payment => payment.id !== id));
  };

  const AddUserModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h3 className="text-xl font-bold mb-4 text-white">Add New User</h3>
        <div className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full p-2 rounded bg-gray-700 text-white" />
          <input type="email" placeholder="Email Address" className="w-full p-2 rounded bg-gray-700 text-white" />
          <select className="w-full p-2 rounded bg-gray-700 text-white">
            <option>Client</option>
            <option>Premium</option>
            <option>Admin</option>
          </select>
          <input type="number" placeholder="Initial Balance" className="w-full p-2 rounded bg-gray-700 text-white" />
          <div className="flex gap-2 mt-6">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Add User
            </button>
            <button 
              onClick={() => setShowAddUser(false)}
              className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const AddDocumentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h3 className="text-xl font-bold mb-4 text-white">Add New Document</h3>
        <div className="space-y-4">
          <input type="text" placeholder="Document Title" className="w-full p-2 rounded bg-gray-700 text-white" />
          <select className="w-full p-2 rounded bg-gray-700 text-white">
            <option>Policy</option>
            <option>Report</option>
            <option>Guide</option>
            <option>Legal</option>
          </select>
          <select className="w-full p-2 rounded bg-gray-700 text-white">
            <option>General</option>
            <option>Analytics</option>
            <option>Education</option>
            <option>Legal</option>
          </select>
          <div className="border-2 border-dashed border-gray-600 p-4 text-center rounded">
            <Upload className="mx-auto mb-2" size={24} />
            <span className="text-gray-400">Drop file here or click to upload</span>
          </div>
          <div className="flex gap-2 mt-6">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Upload Document
            </button>
            <button 
              onClick={() => setShowAddDocument(false)}
              className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const AddPaymentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h3 className="text-xl font-bold mb-4 text-white">Add Payment Method</h3>
        <div className="space-y-4">
          <input type="text" placeholder="Payment Method Name" className="w-full p-2 rounded bg-gray-700 text-white" />
          <select className="w-full p-2 rounded bg-gray-700 text-white">
            <option>Credit/Debit Card</option>
            <option>Bank Transfer</option>
            <option>Digital Wallet</option>
            <option>Cryptocurrency</option>
            <option>Wire Transfer</option>
          </select>
          <input type="text" placeholder="Fee Structure" className="w-full p-2 rounded bg-gray-700 text-white" />
          <input type="text" placeholder="Transaction Limits" className="w-full p-2 rounded bg-gray-700 text-white" />
          <div className="flex gap-2 mt-6">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Add Payment Method
            </button>
            <button 
              onClick={() => setShowAddPayment(false)}
              className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-400">Manage users, documents, and payment options</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex space-x-6">
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${activeTab === 'users' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            <Users size={20} />
            <span>Users</span>
          </button>
          <button 
            onClick={() => setActiveTab('documents')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${activeTab === 'documents' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            <FileText size={20} />
            <span>Documents</span>
          </button>
          <button 
            onClick={() => setActiveTab('payments')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${activeTab === 'payments' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            <CreditCard size={20} />
            <span>Payment Methods</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Users Management */}
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">User Management</h2>
              <button 
                onClick={() => setShowAddUser(true)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <UserPlus size={20} />
                <span>Add User</span>
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-700 flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg text-white"
                    />
                  </div>
                </div>
                <button className="bg-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Filter size={20} />
                  <span>Filter</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="text-left p-4">Name</th>
                      <th className="text-left p-4">Email</th>
                      <th className="text-left p-4">Role</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Balance</th>
                      <th className="text-left p-4">Joined</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="p-4">{user.name}</td>
                        <td className="p-4 text-gray-400">{user.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            user.role === 'Premium' ? 'bg-yellow-600' : 'bg-blue-600'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            user.status === 'Active' ? 'bg-green-600' : 'bg-red-600'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4 text-green-400">${user.balance.toLocaleString()}</td>
                        <td className="p-4 text-gray-400">{user.joined}</td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button className="text-blue-400 hover:text-blue-300">
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Documents Management */}
        {activeTab === 'documents' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Document Management</h2>
              <button 
                onClick={() => setShowAddDocument(true)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add Document</span>
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="text-left p-4">Title</th>
                      <th className="text-left p-4">Type</th>
                      <th className="text-left p-4">Category</th>
                      <th className="text-left p-4">Upload Date</th>
                      <th className="text-left p-4">Size</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map(doc => (
                      <tr key={doc.id} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="p-4">{doc.title}</td>
                        <td className="p-4 text-gray-400">{doc.type}</td>
                        <td className="p-4">{doc.category}</td>
                        <td className="p-4 text-gray-400">{doc.uploadDate}</td>
                        <td className="p-4 text-gray-400">{doc.size}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            doc.status === 'Published' ? 'bg-green-600' : 'bg-yellow-600'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button className="text-blue-400 hover:text-blue-300">
                              <Download size={16} />
                            </button>
                            <button className="text-blue-400 hover:text-blue-300">
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods Management */}
        {activeTab === 'payments' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Payment Methods</h2>
              <button 
                onClick={() => setShowAddPayment(true)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add Payment Method</span>
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paymentMethods.map(method => (
                <div key={method.id} className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{method.name}</h3>
                      <p className="text-gray-400 text-sm">{method.type}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      method.status === 'Active' ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      {method.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div>
                      <span className="text-gray-400 text-sm">Fees:</span>
                      <p className="text-sm">{method.fees}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Limits:</span>
                      <p className="text-sm">{method.limits}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm">
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeletePayment(method.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddUser && <AddUserModal />}
      {showAddDocument && <AddDocumentModal />}
      {showAddPayment && <AddPaymentModal />}
    </div>
  );
};

export default AdminPanel;