const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("dashboard/dashboard.ejs");
});

// All aspirants
router.get("/all-aspirants", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/aspirant/allAspirants.ejs");
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
  });
});
router.post("/aspirant/:id", require("../controllers/dashboard/aspirant"));

// All students
router.get("/all-students", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/student/allStudents.ejs");
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
  });
});
router.post("/add-student", require("../controllers/dashboard/student"));
router.get("/student/:id", async (req, res) => {
  const student = await require("../utils/getStudent")(req.params.id);
  if (Object.keys(student).length === 0) {
    return res.status(404).render("error.ejs");
  }

  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/student/student.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    student: await require("../utils/getStudent")(req.params.id),
    user: "",
  });
});
router.post("/student/:id", require("../controllers/dashboard/student/"));

// Guardian
router.get("/all-guardians", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/guardian/allGuardians.ejs");
});
router.get("/guardian/:id", async (req, res) => {
  const guardian = await require("../utils/getGuardian")(req.params.id);
  if (Object.keys(guardian).length === 0) {
    return res.status(404).render("error.ejs");
  }

  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/guardian/guardian.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    newStudentId: req.flash("newStudentId")[0] || "",
    guardian: await require("../utils/getGuardian")(req.params.id),
    user: "",
  });
});

// Timetable
router.get("/add-timetable", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/timetable/addTimetable.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    classes: (await require("../utils/getClasses")()) || "",
    days: (await require("../utils/getDays")()) || "",
    states: "",
  });
});

// Subject
router.get("/all-subjects", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/subject/allSubjects.ejs");
});
router.get("/subject", async (req, res) => {
  const status = req.flash("status")[0] || 200;
  res.status(status).render("dashboard/subject/subject.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    classes: (await require("../utils/getClasses")()) || "",
    formSection: req.flash("formSection")[0] || "",
    subjects: await require("../utils/getSubjects")(),
  });
});
router.post("/subject", require("../controllers/dashboard/subject"));

module.exports = router;
