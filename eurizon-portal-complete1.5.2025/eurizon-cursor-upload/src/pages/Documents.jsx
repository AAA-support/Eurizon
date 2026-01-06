import React from 'react';
import { FolderOpen } from 'lucide-react';

const Documents = () => (
  <div className="page-container">
    <h1 className="text-2xl font-bold mb-4 flex items-center gap-3">
      <FolderOpen size={28} />
      Documents
    </h1>
    <div className="card">
      <p className="text-gray-400">Document management will be available here...</p>
    </div>
  </div>
);

export default Documents;
