require('dotenv').config();
const { sequelize } = require('../config/database');
const models = require('../models');

const syncDatabase = async () => {
  try {
    console.log('🔄 Connecting to Supabase database...');
    
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    console.log('\n🔄 Creating tables...');
    
    // Sync all models (creates tables if they don't exist)
    await sequelize.sync({ force: false, alter: true });
    
    console.log('✅ All tables created successfully!');
    console.log('\n📊 Database schema synchronized with Supabase!');
    console.log('\n✨ Your database is ready!');
    console.log('\n📋 Tables created:');
    console.log('  ✅ users');
    console.log('  ✅ ngo_profiles');
    console.log('  ✅ children');
    console.log('  ✅ child_events');
    console.log('  ✅ training_programs');
    console.log('  ✅ enrollments');
    console.log('  ✅ donations');
    console.log('  ✅ impact_reports');
    console.log('  ✅ resources');
    console.log('  ✅ collaboration_requests');
    console.log('  ✅ messages');
    console.log('  ✅ notifications');
    console.log('  ✅ audit_logs');
    console.log('  ✅ badges');
    console.log('  ✅ user_badges');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error syncing database:', error);
    process.exit(1);
  }
};

syncDatabase();

