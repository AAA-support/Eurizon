import React from 'react';
import { GraduationCap } from 'lucide-react';

const LearningCenter = () => (
  <div className="page-container">
    <h1 className="text-2xl font-bold mb-4 flex items-center gap-3">
      <GraduationCap size={28} />
      Learning Centre
    </h1>
    <div className="card">
      <p className="text-gray-400">Educational resources will be available here...</p>
    </div>
  </div>
);

export default LearningCenter;
