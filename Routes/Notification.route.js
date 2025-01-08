// route.js
const express = require('express');
const router = express.Router();
const notificationController = require('../Controller/Notification.controller');
// Create a new notification
router.post('/api/notifications', notificationController.createNotification);

// Get all notifications
router.get('/api/notifications', notificationController.getNotifications);

// Get a single notification by ID
router.get('/api/notifications/:id', notificationController.getNotificationById);

// Update a notification
router.put('/api/notifications/:id', notificationController.updateNotification);

// Delete a notification
router.delete('/api/notifications/:id', notificationController.deleteNotification);

module.exports = router;
