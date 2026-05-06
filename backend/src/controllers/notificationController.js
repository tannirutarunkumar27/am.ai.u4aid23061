let notifications = [
  {
    id: 1,
    title: "Placement Drive",
    message: "Amazon placement drive starts tomorrow",
    type: "placement",
    isRead: false
  },
  {
    id: 2,
    title: "Exam Result",
    message: "Semester results published",
    type: "result",
    isRead: false
  }
];

const getNotifications = (req, res) => {

  res.json({
    success: true,
    data: notifications
  });

};

const createNotification = (req, res) => {

  const { title, message, type } = req.body;

  const newNotification = {
    id: notifications.length + 1,
    title,
    message,
    type,
    isRead: false
  };

  notifications.push(newNotification);

  res.status(201).json({
    success: true,
    message: "Notification created successfully",
    data: newNotification
  });

};

const markAsRead = (req, res) => {

  const notificationId = parseInt(req.params.id);

  notifications = notifications.map((notification) => {

    if (notification.id === notificationId) {
      notification.isRead = true;
    }

    return notification;

  });

  res.json({
    success: true,
    message: "Notification marked as read"
  });

};

const deleteNotification = (req, res) => {

  const notificationId = parseInt(req.params.id);

  notifications = notifications.filter(
    (notification) => notification.id !== notificationId
  );

  res.json({
    success: true,
    message: "Notification deleted successfully"
  });

};

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
  deleteNotification
};