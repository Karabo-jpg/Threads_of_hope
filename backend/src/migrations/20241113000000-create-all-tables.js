'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Users table
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      role: {
        type: Sequelize.ENUM('admin', 'ngo', 'woman', 'donor'),
        allowNull: false,
        defaultValue: 'woman',
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        unique: true,
      },
      profilePicture: {
        type: Sequelize.STRING,
      },
      dateOfBirth: {
        type: Sequelize.DATE,
      },
      country: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.TEXT,
      },
      preferredLanguage: {
        type: Sequelize.ENUM('en', 'sw', 'fr'),
        defaultValue: 'en',
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      phoneVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      isApproved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      twoFactorEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      twoFactorSecret: {
        type: Sequelize.STRING,
      },
      oauthProvider: {
        type: Sequelize.STRING,
      },
      oauthProviderId: {
        type: Sequelize.STRING,
      },
      lastLoginAt: {
        type: Sequelize.DATE,
      },
      resetPasswordToken: {
        type: Sequelize.STRING,
      },
      resetPasswordExpires: {
        type: Sequelize.DATE,
      },
      emailVerificationToken: {
        type: Sequelize.STRING,
      },
      emailVerificationExpires: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Create indexes for users
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['role']);
    await queryInterface.addIndex('users', ['isActive']);
    await queryInterface.addIndex('users', ['isApproved']);

    // Create NGO Profiles table
    await queryInterface.createTable('ngo_profiles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      organizationName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      registrationNumber: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      organizationType: {
        type: Sequelize.ENUM('ngo', 'charity', 'foundation', 'community_org', 'other'),
        defaultValue: 'ngo',
      },
      website: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      foundedYear: {
        type: Sequelize.INTEGER,
      },
      logo: {
        type: Sequelize.STRING,
      },
      certificationDocuments: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
      focusAreas: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
      numberOfStaff: {
        type: Sequelize.INTEGER,
      },
      numberOfVolunteers: {
        type: Sequelize.INTEGER,
      },
      annualBudget: {
        type: Sequelize.DECIMAL(15, 2),
      },
      bankAccountName: {
        type: Sequelize.STRING,
      },
      bankAccountNumber: {
        type: Sequelize.STRING,
      },
      bankName: {
        type: Sequelize.STRING,
      },
      bankSwiftCode: {
        type: Sequelize.STRING,
      },
      verificationStatus: {
        type: Sequelize.ENUM('pending', 'verified', 'rejected'),
        defaultValue: 'pending',
      },
      verifiedAt: {
        type: Sequelize.DATE,
      },
      verifiedBy: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex('ngo_profiles', ['userId']);
    await queryInterface.addIndex('ngo_profiles', ['registrationNumber']);

    // Create Children table
    await queryInterface.createTable('children', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      registeredBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      middleName: {
        type: Sequelize.STRING,
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other'),
        allowNull: false,
      },
      profilePhoto: {
        type: Sequelize.STRING,
      },
      birthCertificateNumber: {
        type: Sequelize.STRING,
      },
      nationality: {
        type: Sequelize.STRING,
      },
      ethnicity: {
        type: Sequelize.STRING,
      },
      bloodType: {
        type: Sequelize.STRING,
      },
      currentStatus: {
        type: Sequelize.ENUM('orphan', 'vulnerable', 'rescued', 'in_care', 'adopted', 'reunited', 'independent'),
        allowNull: false,
        defaultValue: 'vulnerable',
      },
      currentLocation: {
        type: Sequelize.STRING,
      },
      currentPlacement: {
        type: Sequelize.STRING,
      },
      guardianName: {
        type: Sequelize.STRING,
      },
      guardianRelationship: {
        type: Sequelize.STRING,
      },
      guardianPhone: {
        type: Sequelize.STRING,
      },
      guardianAddress: {
        type: Sequelize.TEXT,
      },
      medicalConditions: {
        type: Sequelize.TEXT,
      },
      allergies: {
        type: Sequelize.TEXT,
      },
      disabilities: {
        type: Sequelize.TEXT,
      },
      vaccinations: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      lastMedicalCheckup: {
        type: Sequelize.DATE,
      },
      educationLevel: {
        type: Sequelize.STRING,
      },
      schoolName: {
        type: Sequelize.STRING,
      },
      grade: {
        type: Sequelize.STRING,
      },
      academicPerformance: {
        type: Sequelize.TEXT,
      },
      specialNeeds: {
        type: Sequelize.TEXT,
      },
      familyBackground: {
        type: Sequelize.TEXT,
      },
      circumstancesLeadingToRescue: {
        type: Sequelize.TEXT,
      },
      traumaHistory: {
        type: Sequelize.TEXT,
      },
      psychologicalSupport: {
        type: Sequelize.TEXT,
      },
      caseNumber: {
        type: Sequelize.STRING,
        unique: true,
      },
      rescueDate: {
        type: Sequelize.DATE,
      },
      rescueLocation: {
        type: Sequelize.STRING,
      },
      legalStatus: {
        type: Sequelize.STRING,
      },
      courtCaseReference: {
        type: Sequelize.STRING,
      },
      notes: {
        type: Sequelize.TEXT,
      },
      documents: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      archivedAt: {
        type: Sequelize.DATE,
      },
      archivedReason: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex('children', ['registeredBy']);
    await queryInterface.addIndex('children', ['currentStatus']);
    await queryInterface.addIndex('children', ['caseNumber']);
    await queryInterface.addIndex('children', ['isActive']);

    // Continue with remaining tables...
    console.log('✅ Core tables created successfully');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('children');
    await queryInterface.dropTable('ngo_profiles');
    await queryInterface.dropTable('users');
  }
};

