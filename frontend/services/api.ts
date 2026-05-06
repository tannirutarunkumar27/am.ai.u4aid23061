import { Notification, NotificationFormData } from '@/types/notification';

const API_BASE_URL = 'http://localhost:5000/api';

export const apiService = {
  // Fetch all notifications
  fetchNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const result = await response.json();
      // Handle both array and object with data property
      return Array.isArray(result) ? result : (result.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Create a new notification
  createNotification: async (data: NotificationFormData): Promise<Notification> => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create notification');
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (id: number): Promise<Notification> => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to mark as read');
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Error marking as read:', error);
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete notification');
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },
};
