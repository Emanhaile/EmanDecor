const express = require('express');
const router = express.Router();
const eventController = require('../Controller/eventBooking.controller'); // Adjust the path as needed

// Routes for event booking management

// Create new event booking
router.post('/api/bookus', eventController.createEventBooking);  

// Get all event bookings
router.get('/api/bookus', eventController.getAllEventBookings);   

// Get a single event booking by ID
router.get('/api/bookus/:id', eventController.getEventBookingById); 

// Update event booking by ID
router.put('/api/bookus/:id', eventController.updateEventBooking); 

// Delete event booking by ID
router.delete('/api/bookus/:id', eventController.deleteEventBooking); 

// Get event booking status by ID
router.get('/api/bookus/status/:id', eventController.getEventBookingStatusById); 

module.exports = router;
