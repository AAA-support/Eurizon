import React from 'react';

const AdminDashboard = ({ userProfile }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          Admin Dashboard - {userProfile?.username}
        </h1>
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <p className="text-slate-300">Admin controls coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;