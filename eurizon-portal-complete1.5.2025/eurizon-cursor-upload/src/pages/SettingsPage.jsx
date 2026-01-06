import React from 'react';
import { Settings } from 'lucide-react';

const SettingsPage = () => (
  <div className="page-container">
    <h1 className="text-2xl font-bold mb-4 flex items-center gap-3">
      <Settings size={28} />
      Settings
    </h1>
    <div className="card">
      <p className="text-gray-400">Account settings will be available here...</p>
    </div>
  </div>
);

export default SettingsPage;
