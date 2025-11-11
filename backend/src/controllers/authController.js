const { User, NGOProfile } = require('../models');
const { generateToken, generateEmailVerificationToken, generatePasswordResetToken } = require('../utils/jwt');
const { sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');
const crypto = require('crypto');

// Register new user
exports.register = async (req, res, next) => {
  try {
    const {
      email,
      password,
      role,
      firstName,
      lastName,
      phoneNumber,
      country,
      preferredLanguage,
      organizationName,
      registrationNumber,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      role: role || 'woman',
      firstName,
      lastName,
      phoneNumber,
      country,
      preferredLanguage: preferredLanguage || 'en',
      isApproved: role === 'woman' || role === 'donor', // Auto-approve women and donors
    });

    // Create NGO profile if role is NGO
    if (role === 'ngo' && organizationName && registrationNumber) {
      await NGOProfile.create({
        userId: user.id,
        organizationName,
        registrationNumber,
      });
    }

    // Generate email verification token
    const verificationToken = generateEmailVerificationToken(email);
    await user.update({
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Send welcome and verification emails
    await sendWelcomeEmail(user);
    await sendVerificationEmail(user, verificationToken);

    // Generate JWT token
    const token = generateToken(user.id, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      data: {
        user: user.getPublicProfile(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated',
      });
    }

    // Check if account is approved
    if (!user.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval',
      });
    }

    // Update last login
    await user.update({ lastLoginAt: new Date() });

    // Generate token
    const token = generateToken(user.id, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.getPublicProfile(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Verify email
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({
      where: {
        emailVerificationToken: token,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    if (user.emailVerificationExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Verification token has expired',
      });
    }

    await user.update({
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    });

    res.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Request password reset
exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if user exists
      return res.json({
        success: true,
        message: 'If an account exists with this email, a password reset link will be sent.',
      });
    }

    // Generate reset token
    const resetToken = generatePasswordResetToken(user.id);
    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    // Send reset email
    await sendPasswordResetEmail(user, resetToken);

    res.json({
      success: true,
      message: 'If an account exists with this email, a password reset link will be sent.',
    });
  } catch (error) {
    next(error);
  }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    if (user.resetPasswordExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Reset token has expired',
      });
    }

    await user.update({
      password: newPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    res.json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: req.user.role === 'ngo' ? [{ model: NGOProfile, as: 'ngoProfile' }] : [],
    });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Update profile
exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'firstName',
      'lastName',
      'phoneNumber',
      'dateOfBirth',
      'country',
      'city',
      'address',
      'preferredLanguage',
      'profilePicture',
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await req.user.update(updateData);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: req.user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const isValidPassword = await req.user.validatePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    await req.user.update({ password: newPassword });

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};


