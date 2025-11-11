const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const NGOProfile = require('./NGOProfile');
const Child = require('./Child');
const ChildEvent = require('./ChildEvent');
const TrainingProgram = require('./TrainingProgram');
const Enrollment = require('./Enrollment');
const Donation = require('./Donation');
const ImpactReport = require('./ImpactReport');
const Resource = require('./Resource');
const CollaborationRequest = require('./CollaborationRequest');
const Message = require('./Message');
const Notification = require('./Notification');
const AuditLog = require('./AuditLog');
const Badge = require('./Badge');
const UserBadge = require('./UserBadge');

// Define relationships

// User relationships
User.hasOne(NGOProfile, { foreignKey: 'userId', as: 'ngoProfile' });
NGOProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Child, { foreignKey: 'registeredBy', as: 'registeredChildren' });
Child.belongsTo(User, { foreignKey: 'registeredBy', as: 'registrar' });

User.hasMany(ChildEvent, { foreignKey: 'recordedBy', as: 'recordedEvents' });
ChildEvent.belongsTo(User, { foreignKey: 'recordedBy', as: 'recorder' });

User.hasMany(TrainingProgram, { foreignKey: 'createdBy', as: 'createdPrograms' });
TrainingProgram.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(Enrollment, { foreignKey: 'userId', as: 'enrollments' });
Enrollment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Donation, { foreignKey: 'donorId', as: 'donations' });
Donation.belongsTo(User, { foreignKey: 'donorId', as: 'donor' });

User.hasMany(ImpactReport, { foreignKey: 'reportedBy', as: 'impactReports' });
ImpactReport.belongsTo(User, { foreignKey: 'reportedBy', as: 'reporter' });

User.hasMany(Resource, { foreignKey: 'createdBy', as: 'resources' });
Resource.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(CollaborationRequest, { foreignKey: 'requesterId', as: 'collaborationRequests' });
CollaborationRequest.belongsTo(User, { foreignKey: 'requesterId', as: 'requester' });

User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'recipientId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Child relationships
Child.hasMany(ChildEvent, { foreignKey: 'childId', as: 'events' });
ChildEvent.belongsTo(Child, { foreignKey: 'childId', as: 'child' });

// TrainingProgram relationships
TrainingProgram.hasMany(Enrollment, { foreignKey: 'programId', as: 'enrollments' });
Enrollment.belongsTo(TrainingProgram, { foreignKey: 'programId', as: 'program' });

// Donation relationships
Donation.hasMany(ImpactReport, { foreignKey: 'donationId', as: 'impactReports' });
ImpactReport.belongsTo(Donation, { foreignKey: 'donationId', as: 'donation' });

// Badge relationships
User.belongsToMany(Badge, { through: UserBadge, foreignKey: 'userId', as: 'badges' });
Badge.belongsToMany(User, { through: UserBadge, foreignKey: 'badgeId', as: 'users' });

// Export all models and sequelize instance
module.exports = {
  sequelize,
  User,
  NGOProfile,
  Child,
  ChildEvent,
  TrainingProgram,
  Enrollment,
  Donation,
  ImpactReport,
  Resource,
  CollaborationRequest,
  Message,
  Notification,
  AuditLog,
  Badge,
  UserBadge,
};


