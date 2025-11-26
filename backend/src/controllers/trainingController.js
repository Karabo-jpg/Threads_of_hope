const { TrainingProgram, Enrollment, User, Badge, UserBadge, Message } = require('../models');
const { Op } = require('sequelize');
const { createNotification } = require('../services/notificationService');
const { sendEnrollmentNotificationEmail } = require('../services/emailService');

// Create training program
exports.createProgram = async (req, res, next) => {
  try {
    const program = await TrainingProgram.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Training program created successfully',
      data: program,
    });
  } catch (error) {
    next(error);
  }
};

// Get all training programs
exports.getAllPrograms = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      status,
      search,
      skillLevel,
    } = req.query;

    const where = {};

    if (category) where.category = category;
    if (status) where.status = status;
    if (skillLevel) where.skillLevel = skillLevel;

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await TrainingProgram.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        programs: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single program
exports.getProgramById = async (req, res, next) => {
  try {
    const program = await TrainingProgram.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: Enrollment,
          as: 'enrollments',
          where: { status: { [Op.in]: ['active', 'completed'] } },
          required: false,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName'],
            },
          ],
        },
      ],
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Training program not found',
      });
    }

    res.json({
      success: true,
      data: program,
    });
  } catch (error) {
    next(error);
  }
};

// Update program
exports.updateProgram = async (req, res, next) => {
  try {
    const program = await TrainingProgram.findByPk(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Training program not found',
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && program.createdBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    await program.update(req.body);

    res.json({
      success: true,
      message: 'Program updated successfully',
      data: program,
    });
  } catch (error) {
    next(error);
  }
};

// Delete program
exports.deleteProgram = async (req, res, next) => {
  try {
    const program = await TrainingProgram.findByPk(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Training program not found',
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && program.createdBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    await program.destroy();

    res.json({
      success: true,
      message: 'Program deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Enroll in program
exports.enrollInProgram = async (req, res, next) => {
  try {
    const program = await TrainingProgram.findByPk(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Training program not found',
      });
    }

    if (program.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This program is not accepting enrollments',
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      where: {
        programId: program.id,
        userId: req.user.id,
      },
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this program',
      });
    }

    // Check capacity
    if (program.maxParticipants && program.currentParticipants >= program.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Program is full',
      });
    }

    const enrollment = await Enrollment.create({
      programId: program.id,
      userId: req.user.id,
      status: program.cost > 0 ? 'pending' : 'approved',
    });

    // Auto-approve free programs
    if (program.cost === 0) {
      await enrollment.update({
        status: 'approved',
        approvedBy: program.createdBy,
        approvedAt: new Date(),
        startDate: new Date(),
      });

      await program.increment('currentParticipants');

      // Get program creator for message sender
      const programCreator = await User.findByPk(program.createdBy);

      // Send message to woman
      await Message.create({
        senderId: program.createdBy,
        recipientId: req.user.id,
        subject: `Enrollment Approved: ${program.title}`,
        content: `Congratulations! Your enrollment in "${program.title}" has been approved. You can now start your training journey.\n\nProgram Details:\n- Duration: ${program.duration} days\n- Category: ${program.category}\n- Skill Level: ${program.skillLevel}\n\nLog in to your dashboard to get started!`,
        messageType: 'notification',
        relatedTo: enrollment.id,
        relatedType: 'enrollment',
        priority: 'normal',
      });

      // Send notification
      await createNotification(
        req.user.id,
        'enrollment_approved',
        'Enrollment Approved',
        `You have been enrolled in ${program.title}`,
        {
          relatedTo: enrollment.id,
          relatedType: 'enrollment',
          actionUrl: `/training/${program.id}`,
          deliveryChannels: ['in_app', 'email'],
        }
      );

      await sendEnrollmentNotificationEmail(req.user, program, 'approved');
    }

    res.status(201).json({
      success: true,
      message: enrollment.status === 'approved' ? 'Enrolled successfully' : 'Enrollment pending approval',
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// Get user enrollments
exports.getMyEnrollments = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = { userId: req.user.id };

    if (status) where.status = status;

    const enrollments = await Enrollment.findAll({
      where,
      include: [
        {
          model: TrainingProgram,
          as: 'program',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

// Update enrollment progress
exports.updateEnrollmentProgress = async (req, res, next) => {
  try {
    const { progress, proofOfProgress } = req.body;

    const enrollment = await Enrollment.findOne({
      where: {
        id: req.params.enrollmentId,
        userId: req.user.id,
      },
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    const updateData = {};
    if (progress !== undefined) updateData.progress = progress;
    if (proofOfProgress) {
      updateData.proofOfProgress = [
        ...enrollment.proofOfProgress,
        ...proofOfProgress,
      ];
    }

    await enrollment.update(updateData);

    // Auto-complete if progress reaches 100%
    if (progress >= 100 && enrollment.status !== 'completed') {
      await enrollment.update({
        status: 'completed',
        completionDate: new Date(),
      });

      // Get program details
      const program = await TrainingProgram.findByPk(enrollment.programId);
      
      if (program && program.certificationProvided) {
        await enrollment.update({
          certificateIssued: true,
          certificateIssuedDate: new Date(),
          certificateUrl: `/certificates/${enrollment.id}`, // Would generate actual certificate
        });

        // Award badge if available
        const badge = await Badge.findOne({
          where: { name: `${program.category}_completion` },
        });

        if (badge) {
          await UserBadge.create({
            userId: req.user.id,
            badgeId: badge.id,
            awardedBy: program.createdBy,
            reason: `Completed ${program.title}`,
          });
        }

        // Send message to woman
        await Message.create({
          senderId: program.createdBy || req.user.id,
          recipientId: req.user.id,
          subject: `Training Completed: ${program.title}`,
          content: `Congratulations! You have successfully completed "${program.title}" and earned a certificate.\n\nYour dedication and hard work have paid off. You can now download your certificate from your dashboard.\n\nKeep up the great work!`,
          messageType: 'notification',
          relatedTo: enrollment.id,
          relatedType: 'enrollment',
          priority: 'high',
        });

        // Send notification
        await createNotification(
          req.user.id,
          'training_completed',
          'Training Completed!',
          `Congratulations! You've completed ${program.title} and earned a certificate.`,
          {
            relatedTo: enrollment.id,
            relatedType: 'enrollment',
            actionUrl: `/training/certificate/${enrollment.id}`,
            deliveryChannels: ['in_app', 'email'],
          }
        );
      } else if (program) {
        // Training completed but no certificate - still send message
        await Message.create({
          senderId: program.createdBy || req.user.id,
          recipientId: req.user.id,
          subject: `Training Completed: ${program.title}`,
          content: `Congratulations! You have successfully completed "${program.title}".\n\nYour dedication and hard work have paid off. Keep up the great work!`,
          messageType: 'notification',
          relatedTo: enrollment.id,
          relatedType: 'enrollment',
          priority: 'high',
        });

        // Send notification
        await createNotification(
          req.user.id,
          'training_completed',
          'Training Completed!',
          `Congratulations! You've completed ${program.title}.`,
          {
            relatedTo: enrollment.id,
            relatedType: 'enrollment',
            actionUrl: `/training/${program.id}`,
            deliveryChannels: ['in_app', 'email'],
          }
        );
      }
    }

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// Approve/reject enrollment (NGO/Admin only)
exports.updateEnrollmentStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const enrollment = await Enrollment.findByPk(req.params.enrollmentId, {
      include: [
        {
          model: TrainingProgram,
          as: 'program',
        },
        {
          model: User,
          as: 'user',
        },
      ],
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && enrollment.program.createdBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    await enrollment.update({
      status,
      approvedBy: req.user.id,
      approvedAt: new Date(),
      notes: notes || enrollment.notes,
      startDate: status === 'approved' ? new Date() : enrollment.startDate,
    });

    if (status === 'approved') {
      await enrollment.program.increment('currentParticipants');
    }

    // Send message to woman
    if (status === 'approved') {
      await Message.create({
        senderId: req.user.id,
        recipientId: enrollment.userId,
        subject: `Enrollment Approved: ${enrollment.program.title}`,
        content: `Great news! Your enrollment in "${enrollment.program.title}" has been approved.\n\nProgram Details:\n- Duration: ${enrollment.program.duration} days\n- Category: ${enrollment.program.category}\n- Skill Level: ${enrollment.program.skillLevel}\n${enrollment.program.startDate ? `- Start Date: ${new Date(enrollment.program.startDate).toLocaleDateString()}\n` : ''}\nYou can now start your training journey. Log in to your dashboard to get started!${notes ? `\n\nNotes: ${notes}` : ''}`,
        messageType: 'notification',
        relatedTo: enrollment.id,
        relatedType: 'enrollment',
        priority: 'normal',
      });
    } else if (status === 'rejected') {
      await Message.create({
        senderId: req.user.id,
        recipientId: enrollment.userId,
        subject: `Enrollment Update: ${enrollment.program.title}`,
        content: `We regret to inform you that your enrollment in "${enrollment.program.title}" has been ${status}.\n\n${notes ? `Reason: ${notes}\n\n` : ''}If you have any questions or would like to discuss this decision, please feel free to contact us.`,
        messageType: 'notification',
        relatedTo: enrollment.id,
        relatedType: 'enrollment',
        priority: 'normal',
      });
    }

    // Send notification
    await createNotification(
      enrollment.userId,
      status === 'approved' ? 'enrollment_approved' : 'enrollment_rejected',
      `Enrollment ${status}`,
      `Your enrollment in ${enrollment.program.title} has been ${status}`,
      {
        relatedTo: enrollment.id,
        relatedType: 'enrollment',
        actionUrl: `/training/${enrollment.programId}`,
        deliveryChannels: ['in_app', 'email'],
      }
    );

    await sendEnrollmentNotificationEmail(enrollment.user, enrollment.program, status);

    res.json({
      success: true,
      message: `Enrollment ${status} successfully`,
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};


