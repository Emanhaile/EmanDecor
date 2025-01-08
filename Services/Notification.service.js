const db = require('../DBconfig/Dbconfig');
// Create a new notification
const createNotification = async (notification) => {
    try {
        const { customer_id, phone_number, message } = notification;
        const insertNotificationQuery = 'INSERT INTO notifications (customer_id, phone_number, message) VALUES (?, ?, ?)';
        const result = await db.query(insertNotificationQuery, [customer_id, phone_number, message]);
        return { message: 'Notification created successfully', id: result.insertId };
    } catch (error) {
        throw new Error(`Failed to create notification: ${error.message}`);
    }
};
// Get all notifications
const getAllNotifications = async () => {
    try {
        const getAllNotificationsQuery = 'SELECT * FROM notifications';
        const rows = await db.query(getAllNotificationsQuery);
        return rows;
    } catch (error) {
        throw new Error(`Failed to get notifications: ${error.message}`);
    }
};
// Get notification by ID
const getNotificationById = async (id) => {
    if (!id) throw new Error('Notification ID is required');

    try {
        const getNotificationByIdQuery = 'SELECT * FROM notifications WHERE notification_id = ?';
        const rows= await db.query(getNotificationByIdQuery, [id]);
        if (rows.length === 0) throw new Error('Notification not found');
        return rows[0];
    } catch (error) {
        throw new Error(`Failed to get notification by ID: ${error.message}`);
    }
};
// Update notification by ID
const updateNotification = async (id, updates) => {
    if (!id) throw new Error('Notification ID is required');

    try {
        const updateNotificationQuery = 'UPDATE notifications SET customer_id = ?, phone_number = ?, message = ? WHERE notification_id = ?';
        const result = await db.query(updateNotificationQuery, [updates.customer_id, updates.phone_number, updates.message, id]);
        if (result.affectedRows === 0) throw new Error('Notification not found');
        return { message: 'Notification updated successfully' };
    } catch (error) {
        throw new Error(`Failed to update notification: ${error.message}`);
    }
};

// Delete notification by ID
const deleteNotification = async (id) => {
    if (!id) throw new Error('Notification ID is required');

    try {
        const deleteNotificationQuery = 'DELETE FROM notifications WHERE notification_id = ?';
        const result = await db.query(deleteNotificationQuery, [id]);
        if (result.affectedRows === 0) throw new Error('Notification not found');
        return { message: 'Notification deleted successfully' };
    } catch (error) {
        throw new Error(`Failed to delete notification: ${error.message}`);
    }
};

module.exports = {
    createNotification,
    getAllNotifications,
    getNotificationById,
    updateNotification,
    deleteNotification
};
