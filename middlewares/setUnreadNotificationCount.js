const { UserNotification, Notification, Teacher } = require("../models");
const { Op } = require("sequelize");

module.exports = async (req, res, next) => {
  try {
    if (!req.teacher) {
      res.locals.unreadNotificationCount = 0;
      return next();
    }

    const teacherId = req.teacher.id;
    const teacherCreatedAt = req.teacher.createdAt;
    let unreadCount = 0;

    // 1. Get broadcast notifications targeted at all teachers created after teacher registration
    const broadcasts = await Notification.findAll({
      where: {
        targetAudience: 'all-teachers',
        createdAt: { [Op.gte]: teacherCreatedAt },
      },
      raw: true,
    });

    // 2. Get notifications linked to this teacher via UserNotification
    const [teacherWithNotifications] = await Teacher.findAll({
      where: { id: teacherId },
      include: [
        {
          model: Notification,
          through: {
            attributes: ["seen"],
          },
        },
      ],
    });

    const joinedNotifications = (teacherWithNotifications?.Notifications || []).filter(
      n => new Date(n.createdAt) >= new Date(teacherCreatedAt)
    );
    const joinedIds = new Set(joinedNotifications.map(n => n.id));

    // 3. Count unread broadcasts (not yet in joined set)
    const unseenBroadcasts = broadcasts.filter(b => !joinedIds.has(b.id));
    unreadCount += unseenBroadcasts.length;

    // 4. Count unread joined notifications (seen = false)
    const unreadJoined = joinedNotifications.filter(n => !n.UserNotification?.seen);
    unreadCount += unreadJoined.length;

    res.locals.unreadNotificationCount = unreadCount;
  } catch (error) {
    console.error("Error counting unread notifications:", error);
    res.locals.unreadNotificationCount = 0;
  }
  next();
};
