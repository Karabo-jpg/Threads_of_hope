const twilio = require('twilio');

// Initialize Twilio only if credentials are provided
const isSMSEnabled = process.env.TWILIO_ACCOUNT_SID && 
                      process.env.TWILIO_AUTH_TOKEN && 
                      process.env.TWILIO_ACCOUNT_SID.length > 0 &&
                      process.env.TWILIO_AUTH_TOKEN.length > 0;

let client = null;

if (isSMSEnabled) {
  client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  console.log('✅ Twilio SMS service enabled');
} else {
  console.log('⚠️  Twilio SMS service disabled (no credentials provided)');
}

const sendSMS = async (to, message) => {
  if (!isSMSEnabled) {
    console.log(`📱 SMS would be sent to ${to} (message: ${message.substring(0, 50)}...) - SMS service disabled`);
    return { success: true, disabled: true };
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    console.log(`✅ SMS sent to ${to}`);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('❌ SMS sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send verification code
const sendVerificationSMS = async (phoneNumber, code) => {
  const message = `Your Threads of Hope verification code is: ${code}. Valid for 10 minutes.`;
  return await sendSMS(phoneNumber, message);
};

// Send notification SMS
const sendNotificationSMS = async (phoneNumber, notification) => {
  const message = `Threads of Hope: ${notification.title} - ${notification.message}`;
  return await sendSMS(phoneNumber, message);
};

module.exports = {
  sendSMS,
  sendVerificationSMS,
  sendNotificationSMS,
};


