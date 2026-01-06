import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  FileText,
  Wallet,
  Building2,
  Download,
  Copy,
  CheckCircle2,
  Clock,
  XCircle,
  Bitcoin,
  DollarSign
} from 'lucide-react';

const UserPayment = () => {
  const [activeTab, setActiveTab] = useState('invoices');
  const [invoices, setInvoices] = useState([]);
  const [cryptoWallets, setCryptoWallets] = useState([]);
  const [bankingInstructions, setBankingInstructions] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [copiedAddress, setCopiedAddress] = useState(null);

  // Fetch data (placeholder - will connect to Supabase)
  useEffect(() => {
    // Mock data - replace with Supabase fetch
    setInvoices([
      {
        id: 1,
        invoice_number: 'INV-2024-001',
        amount: 500.00,
        currency: 'USD',
        status: 'paid',
        description: 'Monthly Management Fee',
        due_date: '2024-01-15',
        paid_date: '2024-01-14',
        created_at: '2024-01-01'
      },
      {
        id: 2,
        invoice_number: 'INV-2024-002',
        amount: 500.00,
        currency: 'USD',
        status: 'pending',
        description: 'Monthly Management Fee',
        due_date: '2024-02-15',
        created_at: '2024-02-01'
      }
    ]);

    setCryptoWallets([
      {
        id: 1,
        wallet_type: 'BTC',
        wallet_address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        wallet_name: 'Primary Bitcoin Wallet',
        network: 'Bitcoin Mainnet'
      },
      {
        id: 2,
        wallet_type: 'ETH',
        wallet_address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        wallet_name: 'Primary Ethereum Wallet',
        network: 'Ethereum Mainnet'
      }
    ]);

    setBankingInstructions([
      {
        id: 1,
        bank_name: 'JPMorgan Chase Bank',
        account_holder_name: 'Eurizon Investment Portal LLC',
        account_number: '****1234',
        routing_number: '021000021',
        swift_code: 'CHASUS33',
        currency: 'USD',
        instruction_type: 'Wire Transfer',
        additional_info: 'For wire transfers, please include your account number in the reference field.'
      }
    ]);

    setDocuments([
      {
        id: 1,
        document_name: 'Investment Agreement 2024.pdf',
        document_type: 'contract',
        status: 'pending',
        requires_signature: true,
        created_at: '2024-01-15'
      }
    ]);
  }, []);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(type);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'paid': return <CheckCircle2 className="text-green-400" size={20} />;
      case 'pending': return <Clock className="text-yellow-400" size={20} />;
      case 'overdue': return <XCircle className="text-red-400" size={20} />;
      default: return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      paid: 'bg-green-500/20 text-green-400 border-green-500/50',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      overdue: 'bg-red-500/20 text-red-400 border-red-500/50'
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <CreditCard size={28} />
          Payment Management
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'invoices'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <FileText size={18} className="inline mr-2" />
          Invoices
        </button>
        <button
          onClick={() => setActiveTab('crypto')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'crypto'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Wallet size={18} className="inline mr-2" />
          Crypto Wallets
        </button>
        <button
          onClick={() => setActiveTab('banking')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'banking'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Building2 size={18} className="inline mr-2" />
          Bank Transfer
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'documents'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <FileText size={18} className="inline mr-2" />
          Documents
        </button>
      </div>

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Your Invoices</h2>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(invoice.status)}
                      <div>
                        <div className="font-semibold">{invoice.invoice_number}</div>
                        <div className="text-sm text-gray-400">{invoice.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">
                        ${invoice.amount.toFixed(2)} {invoice.currency}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full border inline-block mt-1 ${getStatusBadge(invoice.status)}`}>
                        {invoice.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between text-sm text-gray-400">
                    <div>Due: {invoice.due_date}</div>
                    {invoice.paid_date && <div>Paid: {invoice.paid_date}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Crypto Wallets Tab */}
      {activeTab === 'crypto' && (
        <div className="space-y-4">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Cryptocurrency Payment Addresses</h2>
            <p className="text-sm text-gray-400 mb-6">
              Send payments to the addresses below. Always verify the address before sending.
            </p>
            <div className="space-y-4">
              {cryptoWallets.map((wallet) => (
                <div key={wallet.id} className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      wallet.wallet_type === 'BTC' ? 'bg-orange-500/20' : 'bg-blue-500/20'
                    }`}>
                      {wallet.wallet_type === 'BTC' ? (
                        <Bitcoin className={wallet.wallet_type === 'BTC' ? 'text-orange-400' : 'text-blue-400'} size={24} />
                      ) : (
                        <Wallet className="text-blue-400" size={24} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{wallet.wallet_type}</h3>
                      <p className="text-sm text-gray-400">{wallet.network}</p>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 p-4 rounded-lg mb-4">
                    <div className="text-xs text-gray-400 mb-2">Wallet Address</div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono flex-1 break-all">{wallet.wallet_address}</code>
                      <button
                        onClick={() => copyToClipboard(wallet.wallet_address, wallet.wallet_type)}
                        className="btn-secondary p-2"
                        title="Copy address"
                      >
                        {copiedAddress === wallet.wallet_type ? (
                          <CheckCircle2 size={18} className="text-green-400" />
                        ) : (
                          <Copy size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm text-yellow-200">
                    ⚠️ Only send {wallet.wallet_type} to this address. Sending other cryptocurrencies may result in permanent loss.
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Banking Instructions Tab */}
      {activeTab === 'banking' && (
        <div className="space-y-4">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Bank Transfer Instructions</h2>
            <p className="text-sm text-gray-400 mb-6">
              Use the following banking details for wire transfers and ACH payments.
            </p>
            {bankingInstructions.map((banking) => (
              <div key={banking.id} className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Bank Name</div>
                    <div className="font-semibold">{banking.bank_name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Account Holder</div>
                    <div className="font-semibold">{banking.account_holder_name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Account Number</div>
                    <div className="font-mono">{banking.account_number}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Routing Number</div>
                    <div className="font-mono">{banking.routing_number}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">SWIFT Code</div>
                    <div className="font-mono">{banking.swift_code}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Currency</div>
                    <div className="font-semibold">{banking.currency}</div>
                  </div>
                </div>

                {banking.additional_info && (
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <div className="text-xs text-gray-400 mb-2">Important Information</div>
                    <div className="text-sm text-gray-300">{banking.additional_info}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Payment Documents</h2>
            <p className="text-sm text-gray-400 mb-6">
              View and sign required documents. You'll be notified when new documents are available.
            </p>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <FileText className="text-blue-400" size={24} />
                      <div>
                        <div className="font-semibold">{doc.document_name}</div>
                        <div className="text-sm text-gray-400">
                          {doc.document_type} • {new Date(doc.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.requires_signature && doc.status === 'pending' && (
                        <button className="btn-primary">
                          Sign Document
                        </button>
                      )}
                      <button className="btn-secondary">
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                  {doc.requires_signature && (
                    <div className={`mt-3 text-xs px-3 py-1 rounded-full border inline-block ${
                      doc.status === 'signed'
                        ? 'bg-green-500/20 text-green-400 border-green-500/50'
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                    }`}>
                      {doc.status === 'signed' ? '✓ Signed' : '⚠ Signature Required'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPayment;
