import React, { useState } from 'react';
import { FileText, Download, Eye, Search, Filter, Calendar, Tag, File } from 'lucide-react';

const ClientDocuments = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const documents = [
    {
      id: 1,
      title: 'Investment Policy Statement 2024',
      description: 'Comprehensive overview of our investment strategies and policies for 2024',
      category: 'Policy',
      type: 'PDF',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      downloadCount: 245,
      isNew: true,
      tags: ['Investment', 'Policy', '2024']
    },
    {
      id: 2,
      title: 'Q1 2024 Market Analysis Report',
      description: 'Detailed analysis of market performance and trends for Q1 2024',
      category: 'Report',
      type: 'PDF',
      size: '5.1 MB',
      uploadDate: '2024-03-01',
      downloadCount: 189,
      isNew: false,
      tags: ['Market', 'Analysis', 'Q1', '2024']
    },
    {
      id: 3,
      title: 'Risk Assessment Guidelines',
      description: 'Guidelines for understanding and managing investment risks',
      category: 'Guide',
      type: 'PDF',
      size: '1.8 MB',
      uploadDate: '2024-02-10',
      downloadCount: 156,
      isNew: false,
      tags: ['Risk', 'Guidelines', 'Education']
    },
    {
      id: 4,
      title: 'Account Terms & Conditions',
      description: 'Complete terms and conditions for your Eurizon investment account',
      category: 'Legal',
      type: 'PDF',
      size: '3.2 MB',
      uploadDate: '2024-01-20',
      downloadCount: 312,
      isNew: false,
      tags: ['Legal', 'Terms', 'Account']
    },
    {
      id: 5,
      title: 'Tax Optimization Strategies 2024',
      description: 'Learn how to optimize your investment portfolio for tax efficiency',
      category: 'Guide',
      type: 'PDF',
      size: '2.7 MB',
      uploadDate: '2024-02-28',
      downloadCount: 98,
      isNew: true,
      tags: ['Tax', 'Optimization', 'Strategy']
    },
    {
      id: 6,
      title: 'ESG Investment Framework',
      description: 'Environmental, Social, and Governance investment criteria and framework',
      category: 'Policy',
      type: 'PDF',
      size: '4.1 MB',
      uploadDate: '2024-03-15',
      downloadCount: 78,
      isNew: true,
      tags: ['ESG', 'Sustainability', 'Framework']
    },
    {
      id: 7,
      title: 'Portfolio Performance Summary - February 2024',
      description: 'Monthly performance summary and key metrics for your portfolio',
      category: 'Report',
      type: 'PDF',
      size: '1.5 MB',
      uploadDate: '2024-03-01',
      downloadCount: 145,
      isNew: false,
      tags: ['Portfolio', 'Performance', 'February']
    },
    {
      id: 8,
      title: 'Digital Security Best Practices',
      description: 'Guidelines for maintaining security of your online investment accounts',
      category: 'Guide',
      type: 'PDF',
      size: '2.1 MB',
      uploadDate: '2024-01-30',
      downloadCount: 203,
      isNew: false,
      tags: ['Security', 'Digital', 'Best Practices']
    }
  ];

  const categories = ['all', 'Policy', 'Report', 'Guide', 'Legal'];

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (docId, title) => {
    // Simulate download
    console.log(`Downloading document: ${title}`);
    // In real implementation, this would trigger actual download
  };

  const handlePreview = (docId, title) => {
    // Simulate preview
    console.log(`Previewing document: ${title}`);
    // In real implementation, this would open document in modal or new tab
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Policy': 'bg-blue-600',
      'Report': 'bg-green-600',
      'Guide': 'bg-purple-600',
      'Legal': 'bg-red-600'
    };
    return colors[category] || 'bg-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-blue-600 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Document Center</h1>
          <p className="text-blue-100">Access your investment documents, reports, and resources</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Search and Filter Section */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search documents, descriptions, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-3 rounded-lg capitalize transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Documents</p>
                <p className="text-2xl font-bold text-white">{documents.length}</p>
              </div>
              <FileText className="text-blue-400" size={24} />
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">New This Month</p>
                <p className="text-2xl font-bold text-green-400">{documents.filter(d => d.isNew).length}</p>
              </div>
              <Calendar className="text-green-400" size={24} />
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Categories</p>
                <p className="text-2xl font-bold text-yellow-400">{categories.length - 1}</p>
              </div>
              <Tag className="text-yellow-400" size={24} />
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Downloads</p>
                <p className="text-2xl font-bold text-purple-400">
                  {documents.reduce((sum, doc) => sum + doc.downloadCount, 0)}
                </p>
              </div>
              <Download className="text-purple-400" size={24} />
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDocuments.map(doc => (
            <div key={doc.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <File className="text-blue-400" size={20} />
                  <span className={`px-2 py-1 rounded text-xs text-white ${getCategoryColor(doc.category)}`}>
                    {doc.category}
                  </span>
                </div>
                {doc.isNew && (
                  <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                    NEW
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold mb-2 text-white">{doc.title}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{doc.description}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {doc.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                <span>{doc.type} • {doc.size}</span>
                <span>{doc.uploadDate}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  {doc.downloadCount} downloads
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePreview(doc.id, doc.title)}
                    className="bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded flex items-center space-x-1 text-sm"
                  >
                    <Eye size={16} />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => handleDownload(doc.id, doc.title)}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded flex items-center space-x-1 text-sm"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto text-gray-600 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No documents found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or category filter.</p>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Document Types</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li><strong>Policy:</strong> Investment policies and guidelines</li>
                <li><strong>Report:</strong> Market analysis and performance reports</li>
                <li><strong>Guide:</strong> Educational materials and how-to guides</li>
                <li><strong>Legal:</strong> Terms, conditions, and legal documents</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Having Trouble?</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• All documents are in PDF format</li>
                <li>• Use the search bar to find specific content</li>
                <li>• Preview documents before downloading</li>
                <li>• Contact support if you need additional documents</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDocuments;