const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserBadge = sequelize.define('UserBadge', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  badgeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'badges',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  awardedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  awardedBy: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  reason: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'user_badges',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['badgeId'] },
    { unique: true, fields: ['userId', 'badgeId'] },
  ],
});

module.exports = UserBadge;


