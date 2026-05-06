const express = require("express");

const router = express.Router();

const {
  getNotifications,
  createNotification,
  markAsRead,
  deleteNotification
} = require("../controllers/notificationController");

router.get("/", getNotifications);

router.post("/", createNotification);

router.patch("/:id/read", markAsRead);

router.delete("/:id", deleteNotification);

module.exports = router;