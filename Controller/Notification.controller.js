const notificationService = require('../Services/Notification.service');

// Create a new notification
async function createNotification(req, res) {
  try {
    const notification = req.body;
    const result = await notificationService.createNotification(notification);
    res.status(201).json({ message: result.message, id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get all notifications
async function getNotifications(req, res) {
  try {
    const notifications = await notificationService.getAllNotifications();
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get a single notification by ID
async function getNotificationById(req, res) {
  try {
    const { id } = req.params;
    const notification = await notificationService.getNotificationById(id);
    res.status(200).json(notification);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

// Update a notification
async function updateNotification(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const result = await notificationService.updateNotification(id, updates);
    res.status(200).json({ message: result.message });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

// Delete a notification
async function deleteNotification(req, res) {
  try {
    const { id } = req.params;
    const result = await notificationService.deleteNotification(id);
    res.status(200).json({ message: result.message });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification
};
