const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("dashboard/dashboard.ejs", {
    siteSettings: req.siteSettings,
  });
});

// All aspirants
router.get("/all-aspirants", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/aspirant/allAspirants.ejs", {
    siteSettings: req.siteSettings,
  });
});
// Add aspirant
router.get("/add-aspirant", async (req, res) => {
  const { Country, State } = require("country-state-city");
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/aspirant/addAspirant.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    newAspirantId: req.flash("newAspirantId")[0] || "",
    classes: await require("../utils/getClasses")(),
    religions: await require("../utils/getReligions")(),
    examinationDate: await require("../utils/getExaminationDate")(),
    academicYears: await require("../utils/getAcademicYears")(),
    countries: Country.getAllCountries(),
    states: State.getAllStates(),
    siteSettings: req.siteSettings,
  });
});
router.post("/add-aspirant", require("../controllers/dashboard/aspirant"));
// Aspirant
router.get("/aspirant/:id", async (req, res) => {
  const aspirant = await require("../utils/getAspirant")(req.params.id);
  if (Object.keys(aspirant).length === 0) {
    return res.status(404).render("error.ejs");
  }

  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/aspirant/aspirant.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    newStudentId: req.flash("newStudentId")[0] || "",
    aspirant: await require("../utils/getAspirant")(req.params.id),
    user: "",
    siteSettings: req.siteSettings,
  });
});
router.post("/aspirant/:id", require("../controllers/dashboard/aspirant"));

// All students
router.get("/all-students", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/student/allStudents.ejs", {
    siteSettings: req.siteSettings,
  });
});
// Add student
router.get("/add-student", async (req, res) => {
  const { Country, State } = require("country-state-city");
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/student/addStudent.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    newStudentId: req.flash("newStudentId")[0] || "",
    classes: await require("../utils/getClasses")(),
    religions: await require("../utils/getReligions")(),
    examinationDate: await require("../utils/getExaminationDate")(),
    academicYears: await require("../utils/getAcademicYears")(),
    countries: Country.getAllCountries(),
    states: State.getAllStates(),
    siteSettings: req.siteSettings,
  });
});
router.post("/add-student", require("../controllers/dashboard/student"));
router.get("/student/:id", async (req, res) => {
  const student = await require("../utils/getStudent")(req.params.id);
  if (Object.keys(student).length === 0) {
    return res.status(404).render("error.ejs", {
      siteSettings: req.siteSettings,
    });
  }

  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/student/student.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    student: await require("../utils/getStudent")(req.params.id),
    user: "",
    siteSettings: req.siteSettings,
  });
});
router.post("/student/:id", require("../controllers/dashboard/student/"));

// Guardian
router.get("/all-guardians", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/guardian/allGuardians.ejs", {
    siteSettings: req.siteSettings,
  });
});
router.get("/guardian/:id", async (req, res) => {
  const guardian = await require("../utils/getGuardian")(req.params.id);
  if (Object.keys(guardian).length === 0) {
    return res.status(404).render("error.ejs", {
      siteSettings: req.siteSettings,
    });
  }

  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/guardian/guardian.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    newStudentId: req.flash("newStudentId")[0] || "",
    guardian: await require("../utils/getGuardian")(req.params.id),
    user: "",
    siteSettings: req.siteSettings,
  });
});

// Timetable
router.get("/timetable", async (req, res) => {
  const { Timetable } = require("../models");
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/timetable/timetable.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    days: (await require("../utils/getDays")()) || "",
    subjects: await require("../utils/getSubjects")(),
    timetables: await require("../utils/getTimetables")(),
    siteSettings: req.siteSettings,
  });
});
router.post("/timetable", require("../controllers/dashboard/timetable"));

// Subject
router.get("/all-subjects", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/subject/allSubjects.ejs", {
    siteSettings: req.siteSettings,
  });
});
router.get("/subject", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/subject/subject.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    classes: (await require("../utils/getClasses")()) || "",
    formSection: req.flash("formSection")[0] || "",
    subjects: await require("../utils/getSubjects")(),
    siteSettings: req.siteSettings,
  });
});
router.post("/subject", require("../controllers/dashboard/subject"));

// Notifications
router.get("/notifications", async (req, res) => {
  const {
    UserNotification,
    Notification,
    Teacher,
  } = require("../models");

  let notifications = [];
  let unseenBroadcasts = [];
  const teacherId = req.teacher.id;
  const teacherCreatedAt = req.teacher.createdAt;

  try {
    // 1. Get broadcast notifications targeted at all teachers created after teacher registration
    const broadcasts = await Notification.findAll({
      where: {
        targetAudience: 'all-teachers',
        createdAt: { [require("sequelize").Op.gte]: teacherCreatedAt },
      },
      order: [['createdAt', 'DESC']],
      raw: true,
    });

    // 2. Get notifications linked to this teacher via UserNotification
    //    (includes: legacy, specific, and previously-viewed broadcasts)
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

    // 3. Merge: broadcasts not yet in joined set are unseen
    unseenBroadcasts = broadcasts.filter(b => !joinedIds.has(b.id));
    notifications = [
      ...unseenBroadcasts.map(b => ({ ...b, seen: false })),
      ...joinedNotifications.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        targetAudience: n.targetAudience,
        createdAt: n.createdAt,
        seen: n.UserNotification?.seen ?? false,
      })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.log("Error fetching notifications:", error);
  }

  // Always render (even if fetching failed, show whatever we have)
  res.render("dashboard/notifications", {
    notifications,
    siteSettings: req.siteSettings,
  });

  // Track seen status after response is sent (errors here won't affect the user)
  try {
    for (const b of unseenBroadcasts) {
      const existing = await UserNotification.findOne({
        where: { TeacherId: teacherId, NotificationId: b.id },
      });
      if (!existing) {
        await UserNotification.create({
          TeacherId: teacherId,
          NotificationId: b.id,
          seen: true,
        });
      }
    }
    await UserNotification.update(
      { seen: true },
      { where: { TeacherId: teacherId, seen: false } }
    );
  } catch (trackingError) {
    console.log("Error tracking notification seen status:", trackingError);
  }
});

module.exports = router;
