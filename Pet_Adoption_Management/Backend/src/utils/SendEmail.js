import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendResetEmail = async (to, resetLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Reset your password',
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Reset your password</h2>
        <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
        <a href="${resetLink}" style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:4px;">Reset Password</a>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `
  };
  await transporter.sendMail(mailOptions);
};
