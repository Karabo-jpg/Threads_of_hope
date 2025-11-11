const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (to, message) => {
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


