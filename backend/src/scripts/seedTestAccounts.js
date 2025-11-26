require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const { User } = require('../models');

const seedTestAccounts = async () => {
  try {
    console.log('🌱 Seeding test accounts...');
    
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Define test accounts with PLAIN TEXT passwords
    // The User model will hash them automatically via beforeCreate hook
    const testAccounts = [
      {
        email: 'admin@threadsofhope.org',
        password: 'Admin@2024', // Plain text - will be hashed by User model
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
        isApproved: true,
        emailVerified: true,
      },
      {
        email: 'ngo@example.org',
        password: 'NGO@2024', // Plain text - will be hashed by User model
        role: 'ngo',
        firstName: 'Hope',
        lastName: 'Foundation',
        isActive: true,
        isApproved: true,
        emailVerified: true,
      },
      {
        email: 'woman@example.com',
        password: 'Woman@2024', // Plain text - will be hashed by User model
        role: 'woman',
        firstName: 'Jane',
        lastName: 'Doe',
        isActive: true,
        isApproved: true,
        emailVerified: true,
      },
      {
        email: 'donor@example.com',
        password: 'Donor@2024', // Plain text - will be hashed by User model
        role: 'donor',
        firstName: 'John',
        lastName: 'Smith',
        isActive: true,
        isApproved: true,
        emailVerified: true,
      },
    ];

    for (const account of testAccounts) {
      const existingUser = await User.findOne({ where: { email: account.email } });
      
      if (existingUser) {
        // Update existing user - pass plain text password, beforeUpdate hook will hash it
        // We need to set the password first, then update other fields to trigger the hook
        existingUser.password = account.password; // Plain text - hook will hash
        existingUser.isActive = true;
        existingUser.isApproved = true;
        existingUser.emailVerified = true;
        await existingUser.save(); // This will trigger beforeUpdate hook
        console.log(`✅ Updated: ${account.email} (${account.role}) - password reset`);
      } else {
        // Create new user - pass plain text, beforeCreate hook will hash it
        await User.create(account);
        console.log(`✅ Created: ${account.email} (${account.role})`);
      }
    }

    console.log('\n🎉 Test accounts seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:  admin@threadsofhope.org / Admin@2024');
    console.log('NGO:    ngo@example.org / NGO@2024');
    console.log('Woman:  woman@example.com / Woman@2024');
    console.log('Donor:  donor@example.com / Donor@2024');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding test accounts:', error);
    process.exit(1);
  }
};

seedTestAccounts();

