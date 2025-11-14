const sgMail = require('@sendgrid/mail');

// Initialize SendGrid only if API key is provided
const isEmailEnabled = process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.length > 0;

if (isEmailEnabled) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('✅ SendGrid email service enabled');
} else {
  console.log('⚠️  SendGrid email service disabled (no API key provided)');
}

const sendEmail = async (to, subject, text, html) => {
  if (!isEmailEnabled) {
    console.log(`📧 Email would be sent to ${to} (subject: ${subject}) - Email service disabled`);
    return { success: true, disabled: true };
  }

  try {
    const msg = {
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: process.env.SENDGRID_FROM_NAME || 'Threads of Hope',
      },
      subject,
      text,
      html,
    };

    await sgMail.send(msg);
    console.log(`✅ Email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Welcome email template
const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to Threads of Hope';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Threads of Hope, ${user.firstName}!</h2>
      <p>Thank you for joining our community.</p>
      <p>Your account as a <strong>${user.role.toUpperCase()}</strong> has been created successfully.</p>
      ${!user.isApproved ? '<p><strong>Note:</strong> Your account is pending approval from our admin team.</p>' : ''}
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Best regards,<br>Threads of Hope Team</p>
    </div>
  `;
  
  return await sendEmail(user.email, subject, '', html);
};

// Email verification
const sendVerificationEmail = async (user, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  const subject = 'Verify Your Email Address';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verify Your Email</h2>
      <p>Hello ${user.firstName},</p>
      <p>Please click the button below to verify your email address:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
      </div>
      <p>Or copy and paste this link: ${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, please ignore this email.</p>
    </div>
  `;
  
  return await sendEmail(user.email, subject, '', html);
};

// Password reset email
const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const subject = 'Reset Your Password';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset Your Password</h2>
      <p>Hello ${user.firstName},</p>
      <p>You requested to reset your password. Click the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
      </div>
      <p>Or copy and paste this link: ${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;
  
  return await sendEmail(user.email, subject, '', html);
};

// Donation receipt email
const sendDonationReceiptEmail = async (donor, donation) => {
  const subject = 'Thank You for Your Donation';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Thank You for Your Generous Donation!</h2>
      <p>Dear ${donor.firstName} ${donor.lastName},</p>
      <p>We are grateful for your donation to Threads of Hope.</p>
      <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
        <h3>Donation Details</h3>
        <p><strong>Amount:</strong> ${donation.currency} ${donation.amount}</p>
        <p><strong>Date:</strong> ${new Date(donation.donationDate).toLocaleDateString()}</p>
        <p><strong>Transaction ID:</strong> ${donation.transactionId}</p>
        <p><strong>Purpose:</strong> ${donation.purpose || 'General Support'}</p>
      </div>
      <p>Your contribution will make a real difference in the lives of children and women in our community.</p>
      <p>You can track the impact of your donation in your dashboard.</p>
      <p>With gratitude,<br>Threads of Hope Team</p>
    </div>
  `;
  
  return await sendEmail(donor.email, subject, '', html);
};

// Enrollment notification
const sendEnrollmentNotificationEmail = async (user, program, status) => {
  const subject = status === 'approved' ? 'Enrollment Approved' : 'Enrollment Update';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Training Program Enrollment ${status === 'approved' ? 'Approved' : 'Update'}</h2>
      <p>Dear ${user.firstName},</p>
      <p>Your enrollment in <strong>${program.title}</strong> has been ${status}.</p>
      ${status === 'approved' ? `
        <p>Congratulations! You can now start your training journey.</p>
        <p><strong>Program Details:</strong></p>
        <ul>
          <li>Duration: ${program.duration} days</li>
          <li>Location: ${program.location || 'Online'}</li>
          ${program.startDate ? `<li>Start Date: ${new Date(program.startDate).toLocaleDateString()}</li>` : ''}
        </ul>
        <p>Log in to your dashboard to get started!</p>
      ` : ''}
      <p>Best regards,<br>Threads of Hope Team</p>
    </div>
  `;
  
  return await sendEmail(user.email, subject, '', html);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendDonationReceiptEmail,
  sendEnrollmentNotificationEmail,
};


