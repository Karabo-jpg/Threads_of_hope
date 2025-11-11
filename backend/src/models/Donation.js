const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Donation = sequelize.define('Donation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  donorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  recipientType: {
    type: DataTypes.ENUM('child', 'woman', 'ngo', 'program', 'general'),
    allowNull: false,
  },
  recipientId: {
    type: DataTypes.UUID,
    comment: 'ID of child, user, or training program',
  },
  ngoId: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
    comment: 'NGO managing this donation',
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD',
  },
  paymentMethod: {
    type: DataTypes.ENUM('credit_card', 'debit_card', 'bank_transfer', 'mobile_money', 'paypal', 'other'),
  },
  transactionId: {
    type: DataTypes.STRING,
    unique: true,
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending',
  },
  donationDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  recurringFrequency: {
    type: DataTypes.ENUM('weekly', 'monthly', 'quarterly', 'annually'),
  },
  nextRecurringDate: {
    type: DataTypes.DATE,
  },
  purpose: {
    type: DataTypes.STRING,
  },
  message: {
    type: DataTypes.TEXT,
  },
  isAnonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  taxDeductible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  receiptIssued: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  receiptUrl: {
    type: DataTypes.STRING,
  },
  allocatedAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    comment: 'Amount that has been allocated/used',
  },
  remainingAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    comment: 'Amount remaining to be used',
  },
  impactReported: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lastImpactReportDate: {
    type: DataTypes.DATE,
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  tableName: 'donations',
  timestamps: true,
  indexes: [
    { fields: ['donorId'] },
    { fields: ['recipientType'] },
    { fields: ['recipientId'] },
    { fields: ['ngoId'] },
    { fields: ['paymentStatus'] },
    { fields: ['donationDate'] },
    { fields: ['transactionId'] },
  ],
});

// Hook to calculate remaining amount after create/update
Donation.beforeSave((donation) => {
  donation.remainingAmount = donation.amount - (donation.allocatedAmount || 0);
});

module.exports = Donation;


