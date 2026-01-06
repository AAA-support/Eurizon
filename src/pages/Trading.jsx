import React from 'react';
import { TrendingUp } from 'lucide-react';

const Trading = () => (
  <div className="page-container">
    <h1 className="text-2xl font-bold mb-4 flex items-center gap-3">
      <TrendingUp size={28} />
      Live Trading
    </h1>
    <div className="card">
      <p className="text-gray-400">Live trading functionality will be available here...</p>
    </div>
  </div>
);

export default Trading;
