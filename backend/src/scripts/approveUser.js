require('dotenv').config();
const { sequelize } = require('../config/database');
const { User } = require('../models');

const approveUser = async () => {
  try {
    const email = process.argv[2];
    
    if (!email) {
      console.error('❌ Please provide an email address');
      console.log('Usage: node approveUser.js <email>');
      process.exit(1);
    }

    console.log(`🔍 Looking for user: ${email}`);
    
    await sequelize.authenticate();
    console.log('✅ Database connected');

    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.error(`❌ User not found: ${email}`);
      process.exit(1);
    }

    console.log(`\n📋 Current user status:`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.isActive}`);
    console.log(`   Approved: ${user.isApproved}`);
    console.log(`   Email Verified: ${user.emailVerified}`);

    // Update user to approved and active
    await user.update({
      isActive: true,
      isApproved: true,
      emailVerified: true,
    });

    console.log(`\n✅ User approved successfully!`);
    console.log(`\n📋 Updated user status:`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.isActive}`);
    console.log(`   Approved: ${user.isApproved}`);
    console.log(`   Email Verified: ${user.emailVerified}`);
    console.log(`\n🎉 ${email} can now login!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error approving user:', error);
    process.exit(1);
  }
};

approveUser();

