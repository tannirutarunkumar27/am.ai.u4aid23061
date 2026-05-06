const prisma = require("../db/prisma");

const getNotifications = async (req, res) => {

  try {

    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json({
      success: true,
      data: notifications
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications"
    });

  }

};

const createNotification = async (req, res) => {

  try {

    const { title, message, type } = req.body;

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type
      }
    });

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: notification
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to create notification"
    });

  }

};

const markAsRead = async (req, res) => {

  try {

    const id = parseInt(req.params.id);

    await prisma.notification.update({
      where: {
        id: id
      },
      data: {
        isRead: true
      }
    });

    res.json({
      success: true,
      message: "Notification marked as read"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to update notification"
    });

  }

};

const deleteNotification = async (req, res) => {

  try {

    const id = parseInt(req.params.id);

    await prisma.notification.delete({
      where: {
        id: id
      }
    });

    res.json({
      success: true,
      message: "Notification deleted successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete notification"
    });

  }

};

module.exports = {
  getNotifications,
  createNotification,
 markAsRead,
  deleteNotification
};