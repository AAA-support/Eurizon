import React, { useState } from 'react';
import { Users, UserPlus, Search, Edit, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AdminDashboard = () => {
  const { addNotification } = useApp();
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
    addNotification('info', 'User deleted successfully');
  };

  return (
    <div className="page-container">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Users size={28} />
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Manage users and system settings</p>
        </div>
        <button className="btn btn-primary">
          <UserPlus size={20} />
          Add User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <p className="text-sm text-gray-400 mb-1">Total Users</p>
          <p className="text-3xl font-bold">{users.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-400 mb-1">Active Sessions</p>
          <p className="text-3xl font-bold">{users.filter(u => u.status === 'active').length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-400 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold">$2.4M</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h2 className="card-title">User Management</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="form-input pl-10"
                style={{ minWidth: '300px' }}
              />
            </div>
          </div>
        </div>
        <div className="card-content">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td className="font-medium">{user.name}</td>
                  <td>{user.email}</td>
                  <td><span className="px-2 py-1 bg-blue-900 rounded text-sm">{user.role}</span></td>
                  <td><span className="px-2 py-1 bg-green-900 rounded text-sm">{user.status}</span></td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-secondary btn-sm"><Edit size={16} /></button>
                      <button onClick={() => handleDeleteUser(user.id)} className="btn btn-danger btn-sm"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
