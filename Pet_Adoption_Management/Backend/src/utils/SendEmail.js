import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendResetEmail = async (to, resetLink, username) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Reset your password - Pet Adoption Management System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
          <p style="color: #666; line-height: 1.6;">Hello <strong>${username}</strong>,</p>
          <p style="color: #666; line-height: 1.6;">We received a request to reset your password for your Pet Adoption Management System account.</p>
          <p style="color: #666; line-height: 1.6;">Click the button below to reset your password. This link will expire in 1 hour for security reasons.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
          </div>
          
          <p style="color: #666; line-height: 1.6; font-size: 14px;">If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              <strong>Security Note:</strong> This link will expire in 1 hour. For your security, please do not share this email with anyone.
            </p>
          </div>
        </div>
      </div>
    `
  };
  await transporter.sendMail(mailOptions);
};
