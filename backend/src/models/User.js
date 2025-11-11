const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // Can be null for OAuth users
  },
  role: {
    type: DataTypes.ENUM('admin', 'ngo', 'woman', 'donor'),
    allowNull: false,
    defaultValue: 'woman',
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    unique: true,
  },
  profilePicture: {
    type: DataTypes.STRING,
  },
  dateOfBirth: {
    type: DataTypes.DATE,
  },
  country: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.TEXT,
  },
  preferredLanguage: {
    type: DataTypes.ENUM('en', 'sw', 'fr'),
    defaultValue: 'en',
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  phoneVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Admin must approve new users
  },
  twoFactorEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  twoFactorSecret: {
    type: DataTypes.STRING,
  },
  oauthProvider: {
    type: DataTypes.STRING, // 'google', 'local', etc.
  },
  oauthProviderId: {
    type: DataTypes.STRING,
  },
  lastLoginAt: {
    type: DataTypes.DATE,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
  },
  emailVerificationToken: {
    type: DataTypes.STRING,
  },
  emailVerificationExpires: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'users',
  timestamps: true,
  indexes: [
    { fields: ['email'] },
    { fields: ['role'] },
    { fields: ['isActive'] },
    { fields: ['isApproved'] },
  ],
});

// Hash password before creating user
User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Hash password before updating if changed
User.beforeUpdate(async (user) => {
  if (user.changed('password') && user.password) {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Instance method to verify password
User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Instance method to get public profile
User.prototype.getPublicProfile = function() {
  const { password, twoFactorSecret, resetPasswordToken, ...publicProfile } = this.toJSON();
  return publicProfile;
};

module.exports = User;


