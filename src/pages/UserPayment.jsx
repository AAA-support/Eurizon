import React from 'react';
import { CreditCard } from 'lucide-react';

const UserPayment = () => (
  <div className="page-container">
    <h1 className="text-2xl font-bold mb-4 flex items-center gap-3">
      <CreditCard size={28} />
      Payment Management
    </h1>
    <div className="card">
      <p className="text-gray-400">Payment processing will be available here...</p>
    </div>
  </div>
);

export default UserPayment;
