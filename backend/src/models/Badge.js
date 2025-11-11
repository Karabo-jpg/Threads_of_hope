const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Badge = sequelize.define('Badge', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
  category: {
    type: DataTypes.ENUM('training', 'achievement', 'milestone', 'special'),
    defaultValue: 'achievement',
  },
  icon: {
    type: DataTypes.STRING,
  },
  criteria: {
    type: DataTypes.TEXT,
    comment: 'Criteria for earning this badge',
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'badges',
  timestamps: true,
});

module.exports = Badge;


