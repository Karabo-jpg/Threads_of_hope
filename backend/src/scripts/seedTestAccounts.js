require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const { User } = require('../models');

const seedTestAccounts = async () => {
  try {
    console.log('🌱 Seeding test accounts...');
    
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Define test accounts with professional email domains
    const testAccounts = [
      {
        email: 'admin@threadsofhope.org',
        plainPassword: 'Admin@2024',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
        isApproved: true,
        emailVerified: true,
      },
      {
        email: 'ngo@threadsofhope.org',
        plainPassword: 'NGO@2024',
        role: 'ngo',
        firstName: 'Hope',
        lastName: 'Foundation',
        isActive: true,
        isApproved: true,
        emailVerified: true,
      },
      {
        email: 'woman@threadsofhope.org',
        plainPassword: 'Woman@2024',
        role: 'woman',
        firstName: 'Jane',
        lastName: 'Doe',
        isActive: true,
        isApproved: true,
        emailVerified: true,
      },
      {
        email: 'donor@threadsofhope.org',
        plainPassword: 'Donor@2024',
        role: 'donor',
        firstName: 'John',
        lastName: 'Smith',
        isActive: true,
        isApproved: true,
        emailVerified: true,
      },
    ];

    for (const accountData of testAccounts) {
      const { plainPassword, ...accountInfo } = accountData;
      
      const existingUser = await User.findOne({ where: { email: accountInfo.email } });
      
      if (existingUser) {
        // Update existing user - pass plain password, let model hooks hash it
        existingUser.set('password', plainPassword); // Set plain password - hook will hash it
        existingUser.set('isActive', true);
        existingUser.set('isApproved', true);
        existingUser.set('emailVerified', true);
        existingUser.set('role', accountInfo.role);
        existingUser.set('firstName', accountInfo.firstName);
        existingUser.set('lastName', accountInfo.lastName);
        await existingUser.save(); // Save triggers beforeUpdate hook
        console.log(`✅ Updated: ${accountInfo.email} (${accountInfo.role}) - Password reset`);
      } else {
        // Create new user - pass plain password, let model hooks hash it
        await User.create({
          ...accountInfo,
          password: plainPassword, // Plain password - hook will hash it
        });
        console.log(`✅ Created: ${accountInfo.email} (${accountInfo.role})`);
      }
    }

    // Verify accounts can be found
    console.log('\n🔍 Verifying accounts...');
    for (const accountData of testAccounts) {
      const user = await User.findOne({ where: { email: accountData.email } });
      if (user) {
        const passwordValid = await bcrypt.compare(accountData.plainPassword, user.password);
        console.log(`   ${accountData.email}: ${passwordValid ? '✅ Password valid' : '❌ Password invalid'} | Active: ${user.isActive} | Approved: ${user.isApproved}`);
      } else {
        console.log(`   ${accountData.email}: ❌ Not found`);
      }
    }

    console.log('\n🎉 Test accounts seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:  admin@threadsofhope.org / Admin@2024');
    console.log('NGO:    ngo@threadsofhope.org / NGO@2024');
    console.log('Woman:  woman@threadsofhope.org / Woman@2024');
    console.log('Donor:  donor@threadsofhope.org / Donor@2024');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding test accounts:', error);
    process.exit(1);
  }
};

seedTestAccounts();

