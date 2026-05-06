'use client';

import { useState, useEffect } from 'react';
import { Notification, NotificationFormData } from '@/types/notification';
import { apiService } from '@/services/api';

export default function Home() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [formData, setFormData] = useState<NotificationFormData>({
    title: '',
    message: '',
    type: 'info',
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.fetchNotifications();
      setNotifications(data);
    } catch (err) {
      setError('Failed to load notifications. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.message.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setError(null);
    
    try {
      await apiService.createNotification(formData);
      setFormData({ title: '', message: '', type: 'info' });
      await fetchNotifications();
    } catch (err) {
      setError('Failed to create notification');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await apiService.markAsRead(id);
      await fetchNotifications();
    } catch (err) {
      setError('Failed to mark as read');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await apiService.deleteNotification(id);
        await fetchNotifications();
      } catch (err) {
        setError('Failed to delete notification');
        console.error(err);
      }
    }
  };

  // Filter and search notifications
  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterType || notif.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      info: 'bg-blue-900 text-blue-200 border-l-blue-500',
      success: 'bg-emerald-900 text-emerald-200 border-l-emerald-500',
      warning: 'bg-yellow-900 text-yellow-200 border-l-yellow-500',
      error: 'bg-red-900 text-red-200 border-l-red-500',
    };
    return colors[type] || colors.info;
  };

  const getNotificationTypes = () => {
    const types = new Set(notifications.map(n => n.type));
    return Array.from(types);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navbar */}
      <header className="bg-slate-800 shadow-2xl sticky top-0 z-50 border-b border-purple-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              📢 Notification Dashboard
            </h1>
            <p className="text-slate-400 text-sm">Stay updated with real-time notifications</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
              {unreadCount} new
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border-l-4 border-red-400 text-red-100 p-4 mb-6 rounded-lg animate-pulse">
            <p className="font-semibold">⚠️ {error}</p>
          </div>
        )}

        {/* Notification Form */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 mb-8 border-l-8 border-cyan-500 border border-slate-700">
          <h2 className="text-2xl font-bold text-cyan-400 mb-6">Create Notification</h2>
          <form onSubmit={handleSubmitNotification} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Notification Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="px-4 py-3 border-2 border-purple-500 rounded-lg focus:outline-none focus:border-cyan-400 transition bg-slate-700 text-white placeholder-slate-400"
                disabled={submitting}
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="px-4 py-3 border-2 border-purple-500 rounded-lg focus:outline-none focus:border-cyan-400 transition bg-slate-700 text-white"
                disabled={submitting}
              >
                <option value="info">📌 Info</option>
                <option value="success">✅ Success</option>
                <option value="warning">⚠️ Warning</option>
                <option value="error">❌ Error</option>
              </select>
            </div>
            <textarea
              placeholder="Notification Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border-2 border-purple-500 rounded-lg focus:outline-none focus:border-cyan-400 transition bg-slate-700 text-white placeholder-slate-400"
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 active:scale-95 shadow-lg"
            >
              {submitting ? '🔄 Sending...' : '📤 Send Notification'}
            </button>
          </form>
        </div>

        {/* Search and Filter */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 mb-8 border-l-8 border-purple-500 border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="🔍 Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-3 border-2 border-purple-500 rounded-lg focus:outline-none focus:border-cyan-400 transition bg-slate-700 text-white placeholder-slate-400"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border-2 border-purple-500 rounded-lg focus:outline-none focus:border-cyan-400 transition bg-slate-700 text-white"
            >
              <option value="">All Types</option>
              {getNotificationTypes().map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div>
          <h2 className="text-2xl font-bold text-cyan-400 mb-6">
            Notifications ({filteredNotifications.length})
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin">
                <div className="h-12 w-12 border-4 border-cyan-500 border-t-purple-500 rounded-full"></div>
              </div>
              <p className="ml-4 text-cyan-300 font-semibold">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12 bg-slate-800 rounded-2xl shadow-2xl border-l-8 border-slate-600 border border-slate-700">
              <p className="text-4xl mb-4">📭</p>
              <p className="text-slate-300 text-lg font-semibold">
                {notifications.length === 0 ? 'No notifications yet' : 'No notifications match your filters'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`rounded-2xl shadow-xl p-6 border-l-8 transition transform hover:scale-102 hover:shadow-2xl border border-slate-700 ${getTypeColor(notification.type)} ${
                    !notification.isRead ? 'ring-2 ring-offset-2 ring-offset-slate-900' : ''
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-white">{notification.title}</h3>
                        {!notification.isRead && (
                          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-base mb-3 text-slate-200">{notification.message}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span>📅 {formatDate(notification.createdAt)}</span>
                        <span>•</span>
                        <span className="capitalize font-semibold text-cyan-300">{notification.type}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-2 px-4 rounded-lg transition transform hover:scale-105 active:scale-95 shadow-lg"
                          title="Mark as read"
                        >
                          ✓ Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg transition transform hover:scale-105 active:scale-95 shadow-lg"
                        title="Delete notification"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}