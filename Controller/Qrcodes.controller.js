const QRCode = require('qrcode');
const db = require('../DBconfig/Dbconfig');  // Import the promise-based connection
const moment = require('moment'); // For date handling

const generateQRCode = async (req, res) => {
  const {
    company_name,
    ceo_name,
    phone_number,
    email,
    service,
    expire_date,
    updated_expire_date,
    telegram,
    facebook,
    linkedin,
    youtube,
    tiktok,
    instagram
  } = req.body;

  const photo_url = req.file ? `/uploads/${req.file.filename}` : '';  // Store file URL if uploaded

  console.log("Received data:", req.body);
  console.log("File URL:", photo_url);

  try {
    // Insert company data into the database
    const query = 'INSERT INTO qr_codes (company_name, ceo_name, phone_number, email, service, expire_date, updated_expire_date, telegram, facebook, linkedin, youtube, tiktok, instagram, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const result = await db.query(query, [
      company_name,
      ceo_name,
      phone_number,
      email,
      service,
      expire_date,
      updated_expire_date,
      telegram,
      facebook,
      linkedin,
      youtube,
      tiktok,
      instagram,
      photo_url
    ]);

    const companyId = result.insertId;
    const profileUrl = `http://localhost:3003/profile/${companyId}`;

    console.log("Profile URL generated:", profileUrl);

    // Check if QR code is expired
    const now = moment();
    const expirationDate = moment(expire_date);
    if (now.isAfter(expirationDate)) {
      return res.status(400).json({ error: 'This QR code has expired.' });
    }

    // Generate QR code with a customized design (color and logo)
    const qrOptions = {
      color: {
        dark: '#000000',  // Black color for the QR code
        light: '#ffffff'  // White background for the QR code
      },
      margin: 2,
      width: 200, // You can adjust the size of the QR code here
      height: 200
    };

    // Add a company logo in the center of the QR code if needed
    QRCode.toDataURL(profileUrl, qrOptions, async (err, qrImageUrl) => {
      if (err) {
        console.error('Error generating QR code:', err);
        return res.status(500).json({ error: 'Error generating QR code' });
      }

      console.log("QR Code Image URL:", qrImageUrl);

      // Update the QR code image URL in the database
      await db.query('UPDATE qr_codes SET qr_code_image = ? WHERE id = ?', [qrImageUrl, companyId]);

      res.json({
        qrCodeImage: qrImageUrl,
        profileUrl
      });
    });
  } catch (err) {
    console.error('Error saving to DB:', err);
    return res.status(500).json({ error: 'Error saving to database' });
  }
};

const getCompanyProfile = async (req, res) => {
  const companyId = req.params.company_id;

  try {
    const rows = await db.query('SELECT * FROM qr_codes WHERE id = ?', [companyId]);

    if (rows.length === 0) {
      return res.status(404).send('Company not found');
    }

    const company = rows[0];

    // Ensure company.photo_url is correctly referenced in the HTML
    const fullPhotoUrl = company.photo_url ? `http://localhost:3003${company.photo_url}` : '';
    let qrCodeImageUrl = company.qr_code_image ? company.qr_code_image : '';

    // Check expiration before showing QR code
    const now = moment();
    const expirationDate = moment(company.expire_date);
    if (now.isAfter(expirationDate)) {
      qrCodeImageUrl = ''; // If expired, don't show the QR code
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${company.company_name} - Profile</title>
          <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
          <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet" />
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Open Sans', sans-serif;
              background: #f3f4f6;
              min-height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .card {
              background: linear-gradient(135deg, #267FA1 50%, #001A47 50%);
              border-radius: 10px;
              box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
              padding: 30px;
              width: 100%;
              max-width: 600px;
              color: white;
              text-align: center;
            }
            .card .company-info {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-bottom: 20px;
            }
            .card img {
              width: 80px;
              height: 80px;
              object-fit: cover;
              border-radius: 50%;
              margin-right: 20px;
            }
            .card h2 {
              font-size: 2rem;
              font-weight: 600;
            }
            .card p {
              font-size: 1rem;
              color: #fff;
              margin-bottom: 8px;
            }
            .card .social-icons a {
              font-size: 1.5rem;
              margin: 0 12px;
              color: #fff;
              transition: color 0.3s;
            }
            .card .social-icons a:hover {
              color: #3498db;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
            }
            .footer .qr-code {
              max-width: 100px;
              max-height: 100px;
            }
            footer {
              font-size: 0.875rem;
              color: #fff;
              text-align: center;
            }
            .print-btn {
              display: inline-block;
              padding: 10px 20px;
              background-color: #3498db;
              color: #fff;
              text-decoration: none;
              font-weight: bold;
              margin-top: 20px;
              border-radius: 5px;
              cursor: pointer;
            }
            .print-btn:hover {
              background-color: #2980b9;
            }

            @media print {
              body {
                background-color: white;
              }
              .card {
                background: white;
                color: black;
                box-shadow: none;
                padding: 0;
              }
              footer {
                display: none;
              }
            }
          </style>
          <script>
            function printCard() {
              window.print();
            }
          </script>
        </head>
        <body>
          <div class="card">
            <div class="company-info">
              <img src="${fullPhotoUrl}" alt="Company Logo" />
              <h2>${company.company_name}</h2>
            </div>
            <p><strong>CEO:</strong> ${company.ceo_name}</p>
            <p><strong>Email:</strong> <a href="mailto:${company.email}" class="text-blue-500">${company.email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${company.phone_number}" class="text-blue-500">${company.phone_number}</a></p>
            <p><strong>Services:</strong> ${company.service}</p>

            <div class="social-icons mt-6">
              ${company.telegram ? `<a href="${company.telegram}" class="text-blue-500"><i class="fab fa-telegram-plane"></i></a>` : ''}
              ${company.facebook ? `<a href="${company.facebook}" class="text-blue-600"><i class="fab fa-facebook"></i></a>` : ''}
              ${company.linkedin ? `<a href="${company.linkedin}" class="text-blue-700"><i class="fab fa-linkedin"></i></a>` : ''}
              ${company.youtube ? `<a href="${company.youtube}" class="text-red-500"><i class="fab fa-youtube"></i></a>` : ''}
              ${company.tiktok ? `<a href="${company.tiktok}" class="text-black"><i class="fab fa-tiktok"></i></a>` : ''}
              ${company.instagram ? `<a href="${company.instagram}" class="text-pink-500"><i class="fab fa-instagram"></i></a>` : ''}
            </div>

            <div class="footer">
              ${qrCodeImageUrl ? `<img src="${qrCodeImageUrl}" alt="QR Code" class="qr-code" />` : ''}
              <p>&copy; ${new Date().getFullYear()} ${company.company_name}. All rights reserved.</p>
              <a href="javascript:void(0);" class="print-btn" onclick="printCard()">Print Card</a>
            </div>
          </div>
        </body>
        </html>
      `);
    } catch (err) {
      console.error('Error fetching company details:', err);
      res.status(500).json({ error: 'Error fetching company details' });
    }
  };

module.exports = { generateQRCode, getCompanyProfile };
