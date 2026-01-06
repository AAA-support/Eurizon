import React, { useState, useEffect } from 'react';
import { Bell, X, FileText, DollarSign, AlertCircle } from 'lucide-react';

const NotificationBell = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Mock notifications - replace with Supabase fetch
    const mockNotifications = [
      {
        id: 1,
        type: 'document_uploaded',
        title: 'New Document Available',
        message: 'A new document "Investment Agreement 2024.pdf" has been uploaded for your review.',
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        id: 2,
        type: 'invoice_pending',
        title: 'Invoice Due Soon',
        message: 'Invoice INV-2024-002 is due on February 15, 2024.',
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString()
      },
      {
        id: 3,
        type: 'payment_received',
        title: 'Payment Received',
        message: 'Your payment for invoice INV-2024-001 has been confirmed.',
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.is_read).length);
  }, []);

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'document_uploaded':
      case 'document_signed':
        return <FileText className="text-blue-400" size={20} />;
      case 'invoice_pending':
      case 'payment_received':
        return <DollarSign className="text-green-400" size={20} />;
      default:
        return <AlertCircle className="text-gray-400" size={20} />;
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const formatTimeAgo = (dateString) => {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 hover:bg-gray-700 rounded-lg transition-colors"
      >
        <Bell size={20} className="text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 max-h-96 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setShowDropdown(false)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <Bell size={48} className="mx-auto mb-3 opacity-30" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`p-4 border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer transition-colors ${
                        !notification.is_read ? 'bg-blue-900/10' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm">{notification.title}</h4>
                            {!notification.is_read && (
                              <span className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatTimeAgo(notification.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
