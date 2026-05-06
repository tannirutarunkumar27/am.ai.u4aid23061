export type Notification = {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

export type NotificationFormData = {
  title: string;
  message: string;
  type: string;
};
