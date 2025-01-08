const eventService = require("../Services/eventBooking.service"); // Assuming a service to handle DB logic for event bookings

// Handle event booking creation
const createEventBooking = async (req, res) => {
  try {
    const result = await eventService.createEventBooking(req.body);
    // res.status(201).json(result);
    if (!result) {
      res.status(400).json({
        error: "Failed to create customers",
      });
    } else {
      res.status(200).json({
        status: "true",
        customer_id: result.customer_id,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Handle getting all event bookings
const getAllEventBookings = async (req, res) => {
  try {
    const eventBookings = await eventService.getAllEventBookings();
    res.status(200).json({ success: true, data: eventBookings });
  } catch (error) {
    console.error("Error retrieving event bookings:", error);
    res.status(500).json({
      error: "An error occurred while retrieving event bookings.",
    });
  }
};

// Handle getting event booking by ID
const getEventBookingById = async (req, res) => {
  const { id } = req.params;
  try {
    const eventBooking = await eventService.getEventBookingById(id);
    if (!eventBooking) {
      return res.status(404).json({ error: "Event booking not found." });
    }
    res.status(200).json(eventBooking);
  } catch (error) {
    console.error("Error retrieving event booking:", error);
    res.status(500).json({
      error: "An error occurred while retrieving the event booking.",
    });
  }
};

// Handle updating event booking by ID
const updateEventBooking = async (req, res) => {
  const { id } = req.params;
  const { event_date, event_type, event_details } = req.body;

  try {
    // Check if event booking exists before updating
    const existingEventBooking = await eventService.getEventBookingById(id);
    if (!existingEventBooking) {
      return res.status(404).json({ error: "Event booking not found." });
    }

    // Prepare updated data
    const updatedData = {
      event_date,
      event_type,
      event_details: event_details || existingEventBooking.event_details, // Keep old details if not updated
    };

    const result = await eventService.updateEventBooking(id, updatedData);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating event booking:", error);
    res.status(500).json({
      error: "An error occurred while updating the event booking.",
    });
  }
};

// Handle deleting event booking by ID
const deleteEventBooking = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if event booking exists before deleting
    const existingEventBooking = await eventService.getEventBookingById(id);
    if (!existingEventBooking) {
      return res.status(404).json({ error: "Event booking not found." });
    }

    const result = await eventService.deleteEventBooking(id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting event booking:", error);
    res.status(500).json({
      error: "An error occurred while deleting the event booking.",
    });
  }
};

// Handle getting event status by ID (if there's a status field or similar concept)
const getEventBookingStatusById = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch event status (assuming an "event_status" field exists or similar)
    const status = await eventService.getEventBookingStatusById(id);
    res.status(200).json({ status });
  } catch (error) {
    console.error("Error fetching event booking status:", error);
    res.status(500).json({
      error: "An error occurred while fetching the event booking status.",
    });
  }
};

module.exports = {
  createEventBooking,
  getAllEventBookings,
  getEventBookingById,
  updateEventBooking,
  deleteEventBooking,
  getEventBookingStatusById,
};
