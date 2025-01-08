-- Create Users table if it does not already exist
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    user_firstName VARCHAR(50) NOT NULL,
    user_lastName VARCHAR(50) NOT NULL,
    user_password VARCHAR(255) NOT NULL,  
    user_email VARCHAR(100) UNIQUE NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Password reset token table
CREATE TABLE IF NOT EXISTS password_resets (
    reset_id INT PRIMARY KEY AUTO_INCREMENT,
    user_email VARCHAR(100) NOT NULL,
    reset_token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create Roles table if it does not already exist
CREATE TABLE IF NOT EXISTS roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    Company_role VARCHAR(50) UNIQUE NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create user_role table if it does not already exist
CREATE TABLE IF NOT EXISTS user_role (
    user_role_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id) ON DELETE CASCADE
) ENGINE=InnoDB;
-- Create the event_bookings table
CREATE TABLE event_bookings (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    event_date DATETIME NOT NULL,
    event_type ENUM('Wedding', 'Anniversary', 'Birthday Party', 'Graduation Party', 'Baby Shower', 'Other') NOT NULL,
    event_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
-- Create Notifications table if it does not already exist
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    image VARCHAR(255)
);
-- Create the comment table
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL,
     comment TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cart JSON,
  user_id INT,
  total_amount DECIMAL(10, 2),
  total_days INT,
  mileage INT, 
  final_total DECIMAL(10, 2),
  stripe_session_id VARCHAR(255),
  status VARCHAR(50),
  street_address VARCHAR(255),
 city VARCHAR(255),
 rental_date DATE,
 rental_time TIME,
 return_date Date,
 return_time TIME,
 taxAmount INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE TABLE qr_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(255),
  ceo_name VARCHAR(255),
  phone_number VARCHAR(255),
  email VARCHAR(255),
  photo_url VARCHAR(255),
  service TEXT,
  expire_date DATE,
  updated_expire_date DATE,
  telegram VARCHAR(255),
  facebook VARCHAR(255),
  linkedin VARCHAR(255),
  youtube VARCHAR(255),
  tiktok VARCHAR(255),
  instagram VARCHAR(255),
  qr_code_image TEXT
);





CREATE TABLE IF NOT EXISTS notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    phone_number VARCHAR(20),
    message TEXT NOT NULL,
    sent_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
)  ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Contact (
    contact_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,  
    message VARCHAR(100)  NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
-- Insert initial roles into Roles Table
INSERT INTO Roles (company_role) VALUES ('user'), ('employee'), ('Manager'), ('Admin');

-- Insert admin user
INSERT INTO users (user_firstName, user_lastName, user_email, user_password) VALUES ('abebe', 'kebede', 'admin@admin.com', '1234567890@Bc');
-- Assign admin role to the admin user
INSERT INTO user_role (user_id, role_id)
VALUES (
  (SELECT user_id FROM users WHERE user_email = 'admin@admin.com'),
  (SELECT role_id FROM Roles WHERE company_role = 'admin')
);