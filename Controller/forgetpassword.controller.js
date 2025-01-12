const userService= require('../Services/forgetpassword.service')
const nodemailer= require('nodemailer')
const bcrypt= require('bcryptjs')
const crypto= require('crypto')
const db=require('../DBconfig/Dbconfig')
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log('Received email for password reset:', email); // Log the email received

    try {
        // Check if the user exists
        const user = await userService.findUserByEmail(email);
        if (!user) {
            console.log(`User with email ${email} not found`);
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate a random reset token
        const token = crypto.randomBytes(20).toString('hex');
        console.log('Generated reset token:', token);

        // Save the reset token in the database
        await userService.saveResetToken(email, token);

        // Set up nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,  // Add your email user here
                pass: process.env.EMAIL_PASSWORD,  // Add your email password here
            },
        });

        // Create a password reset link
        const resetLink = `http://localhost:5173/reset-password/${token}`;

        // Email options
        const mailOptions = {
            to: email,
            subject: 'Password Reset Request',
            text: `Click the link to reset your password: ${resetLink}`,
        };

        // Send the reset email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error); // Log email sending error
                return res.status(500).json({ error: 'Failed to send reset email' });
            }
            console.log('Reset email sent successfully:', info); // Log successful email sending
            res.status(200).json({ message: 'Password reset email sent successfully' });
        });

    } catch (error) {
        console.error('Internal server error:', error); // Log the error
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    console.log('Received password reset request with token:', token);

    try {
        // Find the reset token in the password_resets table
        const query = 'SELECT * FROM password_resets WHERE reset_token = ?';
        const result = await db.query(query, [token]);

        if (result.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password in the database
        const updateQuery = 'UPDATE users SET user_password = ? WHERE user_email = ?';
        await db.query(updateQuery, [hashedPassword, result[0].user_email]);

        // Delete the reset token after the password has been reset
        const deleteQuery = 'DELETE FROM password_resets WHERE reset_token = ?';
        await db.query(deleteQuery, [token]);

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};