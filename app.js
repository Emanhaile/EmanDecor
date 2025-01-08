const express = require("express");
const path = require("path");
require("dotenv").config(); // Load environment variables
const cors = require("cors");
const bodyParser = require("body-parser");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Stripe secret key
const { query } = require("./DBconfig/Dbconfig"); // Import the query function from db.js
const router = require('./Routes/index');
const QRCode = require('qrcode');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

// Tax rate (example: 10% tax)
const TAX_RATE = 0.06; // 10% tax rate

// Ensure environment variables are set
if (!process.env.STRIPE_SECRET_KEY || !process.env.FRONTEND_URL || !process.env.STRIPE_WEBHOOK_SECRET) {
  console.error('Critical environment variables missing!');
  process.exit(1);
}

// Setup CORS and body parsing
app.use(cors({ origin: process.env.FRONTEND_URL, optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gmnetwork21@gmail.com', // Your email address
    pass: 'qrvx tcob xbbr fdti', // Your email password or App password (if 2-factor auth is enabled)
  },
});

// Helper function to generate a unique order ID
const OrderId = () => `order_${Math.floor(Math.random() * 1000000)}`;

// Helper function to send order creation email notifications
const sendOrderEmailNotification = async (userEmail, orderDetails) => {
  const mailOptions = {
    from: 'gmnetwork21@gmail.com',
    to: userEmail, // Send to the user email
    subject: `Order Confirmation - ${orderDetails.orderId}`,
    text: `Dear Customer, \n\nThank you for your order! Here are the details:\n\n${JSON.stringify(orderDetails, null, 2)}\n\nWe will notify you once your order is processed.\n\nBest regards,\nYour Company`,
    html: `<p>Dear Customer,</p>
           <p>Thank you for your order! Here are the details:</p>
           <pre>${JSON.stringify(orderDetails, null, 2)}</pre>
           <p>We will notify you once your order is processed.</p>
           <p>Best regards,<br>Zed Wedding and Event Decor</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Helper function to send order completion email notifications
const sendCompletionEmailNotification = async (userEmail, orderDetails) => {
  const mailOptions = {
    from: 'gmnetwork21@gmail.com',
    to: userEmail, // Send to the user email
    subject: `Your Order ${orderDetails.orderId} is Complete!`,
    text: `Dear Customer, \n\nYour order has been completed successfully. Here are the details:\n\n${JSON.stringify(orderDetails, null, 2)}\n\nThank you for choosing us!\n\nBest regards,\nZed Wedding and Event Decor`,
    html: `<p>Dear Customer,</p>
           <p>Your order has been completed successfully. Here are the details:</p>
           <pre>${JSON.stringify(orderDetails, null, 2)}</pre>
           <p>Thank you for choosing us!</p>
           <p>Best regards,<br>Zed Wedding and Event Decor</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order completion email sent successfully!');
  } catch (error) {
    console.error('Error sending completion email:', error);
  }
};

// Route to create checkout session
app.post('/create-checkout-session', async (req, res) => {
  const {
    cart,
    totalAmount,
    totalDays,
    mileage,
    isDelivery,
    userId,
    streetAddress,
    city,
    rentalDate,
    rentalTime,
    returnDate,
    returnTime,
  } = req.body;

  console.log('Received data:', req.body);

  try {
    // Validate required fields
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty or missing' });
    }
    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ error: 'Invalid total amount' });
    }
    if (!totalDays || isNaN(totalDays) || totalDays <= 0) {
      return res.status(400).json({ error: 'Invalid rental days' });
    }
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    // Validate if the user exists in the 'users' table
    const [user] = await query('SELECT * FROM users WHERE user_id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate total cost including rental days and possible delivery fee
    const baseTotal = cart.reduce((total, item) => {
      const avgPrice = (item.priceRange[0] + item.priceRange[1]) / 2;
      return total + avgPrice * item.quantity;
    }, 0);

    const rentalTotal = baseTotal * totalDays; // Apply rental days
    const deliveryFee = isDelivery ? mileage * 1 : 0; // Example: $1 per mile for delivery
    const subtotal = rentalTotal + deliveryFee;

    // Calculate tax
    const taxAmount = subtotal * TAX_RATE;
    const finalTotal = subtotal + taxAmount;

    // Create Stripe Checkout session line items
    const lineItems = cart.map((item) => {
      const avgPrice = (item.priceRange[0] + item.priceRange[1]) / 2;
      const totalPrice = avgPrice * item.quantity * totalDays; // Price for this item for the rental days
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.description,
          },
          unit_amount: totalPrice * 100, // Stripe expects amount in cents
        },
        quantity: 1,
      };
    });

    // Add the delivery fee as a separate line item if delivery is enabled
    if (isDelivery) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Delivery Fee',
            description: `Delivery fee for ${mileage} miles`,
          },
          unit_amount: deliveryFee * 100, // Delivery fee in cents
        },
        quantity: 1,
      });
    }

    // Add the tax amount as a separate line item
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Tax',
          description: `Tax (6%)`,
        },
        unit_amount: taxAmount * 100, // Tax amount in cents
      },
      quantity: 1,
    });

    // Generate a unique order ID
    const orderId = OrderId();

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/order/${orderId}`, // Redirect to order page after success
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      client_reference_id: orderId, // Use orderId as client reference
    });

    // Insert the order into the database, including the address fields
    await query(
      `INSERT INTO orders (cart, user_id, total_amount, total_days, mileage, final_total, stripe_session_id, status, street_address, city, rental_date, rental_time, return_date, return_time, taxAmount) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?)`,
      [
        JSON.stringify(cart),
        userId,
        totalAmount,
        totalDays,
        mileage || null,
        finalTotal,
        session.id,
        'Pending', // Initial status
        streetAddress || null,
        city || null,
        rentalDate || null,
        rentalTime || null,
        returnDate || null,
        rentalTime || null,
        taxAmount, 
      ]
    );

    // Send an email to the user after order creation
    await sendOrderEmailNotification(user.user_email, {
      orderId,
      cart,
      totalAmount: finalTotal,
      rentalDays: totalDays,
      deliveryFee: isDelivery ? deliveryFee : 0,
      taxAmount: taxAmount,
    });

    // Respond with the session ID for the frontend to use
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Webhook endpoint to handle Stripe events
app.use(bodyParser.raw({ type: 'application/json' }));

app.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify the webhook signature to ensure the event is from Stripe
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    console.log('Received Stripe event:', event.type);

    // Handle the checkout session completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      console.log('Checkout session completed:', session);

      // Fetch the order from the database using the session ID
      const [order] = await query(
        'SELECT * FROM orders WHERE stripe_session_id = ?',
        [session.id]
      );

      // If the order exists, update the status and send completion email
      if (order) {
        console.log(`Order found with session ID ${session.id}. Updating status...`);
        
        // Ensure you're updating the status correctly in the database
        await query(
          'UPDATE orders SET status = ? WHERE stripe_session_id = ?',
          ['Completed', session.id]
        );
        console.log(`Order status updated to "Completed" for session ${session.id}`);

        // Send completion email to the user
        await sendCompletionEmailNotification(order.user_email, {
          orderId: order.order_id, // Assuming order_id is in the order
          cart: JSON.parse(order.cart),
          totalAmount: order.final_total,
          rentalDays: order.total_days,
          deliveryFee: order.mileage || 0,
          taxAmount: order.tax_amount,
        });
        console.log('Completion email sent.');
      } else {
        console.log('Order not found for session ID:', session.id);
      }
    }

    res.status(200).send('Webhook received successfully');
  } catch (err) {
    console.error('Error processing webhook:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Get all orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await query("SELECT o.*, u.user_firstName, u.user_lastName, u.user_email FROM orders o JOIN users u ON o.user_id = u.user_id");
    if (orders.length === 0) {
      return res.status(404).json({ error: "No orders found" });
    }
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Delete an order by ID
app.delete("/orders/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [order] = await query("SELECT * FROM orders WHERE id = ?", [id]);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Delete the order
    await query("DELETE FROM orders WHERE id = ?", [id]);

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Generate QR code route
// Endpoint to save company data and generate QR code
// app.post('/generate-qr', async (req, res) => {
//   const companyData = req.body;
//   const { company_name, email, phone_number, website_url, detailed_info, tiktok, telegram, facebook } = companyData;

//   // Insert company data into the database
//   try {
//     const result = await query(
//       'INSERT INTO qr_codes (company_name, email, phone_number, website_url, detailed_info, tiktok, telegram, facebook, qr_code_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
//       [company_name, email, phone_number, website_url, detailed_info, tiktok, telegram, facebook, '']
//     );

//     const companyId = result.insertId;
//     const profileUrl = `http://localhost:3003/profile/${companyId}`;

//     // Generate QR code for the company profile URL
//     QRCode.toDataURL(profileUrl, async (err, qrImageUrl) => {
//       if (err) {
//         console.error('Error generating QR code:', err);
//         return res.status(500).json({ error: 'Error generating QR code' });
//       }

//       // Update the QR code image in the database
//       try {
//         await query('UPDATE qr_codes SET qr_code_image = ? WHERE id = ?', [qrImageUrl, companyId]);

//         // Send back the QR code image URL and the profile URL
//         res.json({
//           qrCodeImage: qrImageUrl,
//           profileUrl
//         });
//       } catch (updateError) {
//         console.error('Error updating QR code in DB:', updateError);
//         return res.status(500).json({ error: 'Error updating QR code in database' });
//       }
//     });

//   } catch (err) {
//     console.error('Error saving to DB:', err);
//     return res.status(500).json({ error: 'Error saving to database' });
//   }
// });

// // Endpoint to fetch company details and render profile page with HTML
// // Endpoint to fetch company details and render profile page with HTML
// app.get('/profile/:company_id', async (req, res) => {
//   const companyId = req.params.company_id;  // Fetch the company ID from the URL

//   // Fetch company details from the database using company ID
//   try {
//     const result = await query('SELECT * FROM qr_codes WHERE id = ?', [companyId]);

//     if (result.length === 0) {
//       return res.status(404).send('Company not found');
//     }

//     const company = result[0];

//     // Send back the profile page HTML with company data
//     res.send(`
//       <!DOCTYPE html>
//       <html lang="en">
//         <head>
//           <meta charset="UTF-8" />
//           <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//           <title>${company.company_name} - Profile</title>
//           <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
//           <style>
//             /* Custom Body Background */
//             body {
//               background-color: #f4f7fc; /* Light, neutral background */
//               font-family: 'Arial', sans-serif;
//               display: flex;
//               justify-content: center;
//               align-items: center;
//               height: 100vh;
//               margin: 0;
//             }
    
//             /* Business Card Style Background for Profile Container */
//             .profile-container {
//               width: 600px; /* Width of a standard business card */
//               height: 351px; /* Height of a standard business card */
//               background-image: url('https://images.unsplash.com/photo-1533151203377-755ec2e58764'); /* Elegant and neutral professional background */
//               background-size: cover;
//               background-position: center;
//               backdrop-filter: blur(12px); /* Frosted-glass effect */
//               border-radius: 16px;
//               padding: 20px;
//               box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); /* Subtle shadow for a card-like feel */
//               display: flex;
//               flex-direction: column;
//               justify-content: space-between;
//             }
    
//             /* Profile Title Styling */
//             h1 {
//               color: #2c3e50;
//               font-size: 1.4rem;
//               font-weight: 700;
//               text-align: center;
//               text-transform: uppercase;
//               letter-spacing: 1px;
//             }
    
//             /* Section Titles */
//             .section-heading {
//               color: #2c3e50;
//               font-size: 1rem;
//               font-weight: 600;
//             }
    
//             /* Profile Info Text */
//             .profile-info {
//               color: #34495e;
//               font-size: 0.9rem;
//               line-height: 1.6;
//               margin-top: 8px;
//             }
    
//             /* Clean Links Styling */
//             a {
//               color: #3498db;
//               text-decoration: none;
//             }
    
//             a:hover {
//               text-decoration: underline;
//             }
    
//             /* Social Media Links Styling */
//             .social-links a {
//               color: #2980b9;
//               margin: 0 5px;
//               font-size: 0.9rem;
//               transition: color 0.3s ease;
//             }
    
//             .social-links a:hover {
//               color: #1abc9c;
//             }
    
//             /* QR Code Section */
//             .qr-code img {
//               border-radius: 12px;
//               width: 50px;
//               height: 50px;
//               border: 2px solid #fff;
//               box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
//             }
//           </style>
//         </head>
//         <body>
//           <div class="profile-container">
//             <!-- Company Title -->
//             <h1>${company.company_name}</h1>
    
//             <!-- Company Info Section -->
//             <div class="profile-info space-y-1">
//               <div><span class="section-heading">Email:</span> <a href="mailto:${company.email}">${company.email}</a></div>
//               <div><span class="section-heading">Phone:</span> ${company.phone_number}</div>
//               <div><span class="section-heading">Website:</span> <a href="${company.website_url}" target="_blank">${company.website_url}</a></div>
//               <div><span class="section-heading">Services:</span> ${company.detailed_info}</div>
//             </div>
    
//             <!-- Social Links Section -->
//             <div class="social-links flex justify-center mt-2">
//               ${company.tiktok ? `<a href="${company.tiktok}" target="_blank">TikTok</a>` : ''}
//               ${company.telegram ? `<a href="${company.telegram}" target="_blank">Telegram</a>` : ''}
//               ${company.facebook ? `<a href="${company.facebook}" target="_blank">Facebook</a>` : ''}
//             </div>
    
//             <!-- QR Code Section -->
//             <div class="qr-code text-center mt-2">
//               <img src="${company.qr_code_image}" alt="QR Code" />
//             </div>
//           </div>
//         </body>
//       </html>
//     `);
    
    
    
    
    
//   } catch (err) {
//     console.error('Error fetching company details:', err);
//     return res.status(500).send('Error fetching company details');
//   }
// });








// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
