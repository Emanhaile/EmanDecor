const db = require("../DBconfig/Dbconfig"); // Adjust the path as needed

// Create a new event booking
const nodemailer = require('nodemailer');


// Set up the email transport using Nodemailer (Gmail example, but you can replace with another service)
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Or you can use another email service
  auth: {
    user: 'gmnetwork21@gmail.com', // Replace with your email
    pass: 'qrvx tcob xbbr fdti',   // Replace with your email password or app password
  },
});

// Function to send an email notification
const sendEmailNotification = async (to, subject, text) => {
  const mailOptions = {
    from: 'gmnetwork21@gmail.com',   // Your email address
    to: to,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Function to create an event booking and send notifications
const createEventBooking = async (customerData) => {
  try {
    // SQL query to insert a new event booking
    const insertCustomerQuery = `
      INSERT INTO event_bookings 
      (user_id, name, phone, email, event_type, event_date, event_details) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    // Execute the query
    const result = await db.query(insertCustomerQuery, [
      customerData.user_id,
      customerData.name,
      customerData.phone,
      customerData.email,
      customerData.event_type,
      customerData.event_date,
      customerData.event_details,
    ]);
    
    const eventId = result.insertId;
    
    // Send confirmation email to the customer
    const customerEmailSubject = `Your Event Booking Confirmation (#${eventId})`;
    const customerEmailText = `
      Hello ${customerData.name},

      Your booking for the ${customerData.event_type} on ${customerData.event_date} has been successfully created. Here are the details:
      Customer Email: ${customerData.email}
      customer phone: ${customerData.phone}
      Event Type: ${customerData.event_type}
      Event Date: ${customerData.event_date}
      Event Details: ${customerData.event_details}

      Thank you for booking with us!
    `;
    await sendEmailNotification(customerData.email, customerEmailSubject, customerEmailText);
    
    // Optionally, send an email notification to the admin
    const adminEmailSubject = `New Event Booking: ${customerData.event_type}`;
    const adminEmailText = `
      A new event booking has been made:
      
      Customer Name: ${customerData.name}
      Customer Email: ${customerData.email}
      customer phone: ${customerData.phone}
      Event Type: ${customerData.event_type}
      Event Date: ${customerData.event_date}
      Event Details: ${customerData.event_details}
      
      Please review the booking details.
    `;
    await sendEmailNotification('gmnetwork21@gmail.com', adminEmailSubject, adminEmailText);
    
    return {
      event_id: eventId,
    };
  } catch (error) {
    console.error('Error during event booking:', error);
    
    // Send error notification to admin in case of failure
    const errorEmailSubject = 'Event Booking Failed';
    const errorEmailText = `
      Dear Admin,
      
      An error occurred while processing the event booking for:
      
      Customer Name: ${customerData.name}
      Error Message: ${error.message}
      
      Please check the system logs for more details.
    `;
    await sendEmailNotification('gmnetwork21@gmail.com', errorEmailSubject, errorEmailText);
    
    throw new Error(error.message);
  }
};

// Export the function for use in other parts of your application
module.exports = {
  createEventBooking,
};



// Get all event bookings
  const getAllEventBookings= async () => {
    
  
    const getAllCustomersQuery =
      "SELECT * FROM event_bookings ORDER BY name ASC";
    const rows = await db.query(getAllCustomersQuery);
    return rows;
  };


// Get event booking by ID

  const getEventBookingById = async (id) => {
    if (!id) throw new Error("Customer ID is required");
  
    try {
      // SQL query to get customer by ID
      const getCustomerByIdQuery =
        "SELECT * FROM event_bookings WHERE event_id = ?";
      const rows = await db.query(getCustomerByIdQuery, [id]);
      if (rows.length === 0) throw new Error("Customer not found");
      return rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  };


// Update event booking by ID
const updateEventBooking = async (id, eventData) => {
  if (!id) throw new Error("Event ID is required");

  try {
    const { name, phone, email, event_date, event_type, event_details } = eventData;

    // Update query
    const updateQuery = `
      UPDATE event_bookings
      SET name = ?, phone = ?, email = ?, event_date = ?, event_type = ?, event_details = ?
      WHERE event_id = ?
    `;

    const result = await db.query(updateQuery, [
      name,
      phone,
      email,
      event_date,
      event_type,
      event_details,
      id,
    ]);

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      throw new Error("No event found with the specified ID.");
    }

    return { message: "Event booking updated successfully" };
  } catch (error) {
    console.error("Error updating event booking:", error.message);
    throw new Error("An error occurred while updating the event booking.");
  }
};

// Delete event booking by ID
const deleteEventBooking = async (id) => {
  if (!id) throw new Error("Event ID is required");

  try {
    const query = "DELETE FROM event_bookings WHERE event_id = ?";
    const result = await db.query(query, [id]);

    if (result.affectedRows === 0) {
      throw new Error("No event found with the specified ID.");
    }

    return { message: "Event booking deleted successfully" };
  } catch (error) {
    console.error("Error deleting event booking:", error.message);
    throw new Error("An error occurred while deleting the event booking.");
  }
};

// Get event status by ID (if needed, based on event type or other parameters)
const getEventBookingStatusById = async (id) => {
  if (!id) throw new Error("Event ID is required");

  try {
    const query = "SELECT event_type FROM event_bookings WHERE event_id = ?";
    const result = await db.query(query, [id]);

    if (result.length === 0) {
      throw new Error("Event booking not found.");
    }

    return result[0].event_type;
  } catch (error) {
    console.error("Error fetching event booking status:", error.message);
    throw new Error("An error occurred while fetching the event booking status.");
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
