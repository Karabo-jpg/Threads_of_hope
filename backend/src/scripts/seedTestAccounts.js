require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const { User } = require('../models');

const seedTestAccounts = async () => {
  try {
    console.log('🌱 Seeding test accounts...');
    
    await sequelize.authenticate();
    console.log('✅ Database connected');

    const hashedPassword = await bcrypt.hash('Test@2024', 10);

    const testAccounts = [
      {
        email: 'admin@threadsofhope.org',
        password: await bcrypt.hash('Admin@2024', 10),
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
        isApproved: true,
        emailVerified: true,
      },
      {
        email: 'ngo@example.org',
        password: await bcrypt.hash('NGO@2024', 10),
        role: 'ngo',
        firstName: 'Hope',
        lastName: 'Foundation',
        isActive: true,
        isApproved: true,
        emailVerified: true,
      },
      {
        email: 'woman@example.com',
        password: await bcrypt.hash('Woman@2024', 10),
        role: 'woman',
        firstName: 'Jane',
        lastName: 'Doe',
        isActive: true,
        isApproved: true,
        emailVerified: true,
      },
      {
        email: 'donor@example.com',
        password: await bcrypt.hash('Donor@2024', 10),
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
        // Update existing user to ensure they're approved
        await existingUser.update({
          isActive: true,
          isApproved: true,
          emailVerified: true,
        });
        console.log(`✅ Updated: ${account.email} (${account.role})`);
      } else {
        // Create new user
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

