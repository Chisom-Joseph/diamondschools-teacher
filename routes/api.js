const router = require("express").Router();

// Aspirants
router.get("/get-aspirants", require("../controllers/api/getAspirants"));

// Students
router.get("/get-students", require("../controllers/api/getStudents"));

// Guardians
router.get("/get-guardians", require("../controllers/api/getGuardians"));

// Subject and classes
router.get(
  "/get-subject-and-classes/:id",
  require(`../controllers/api/getSubjectAndClass`)
);

// Subject and classes
router.get("/get-subjects", require(`../controllers/api/getSubjects`));

module.exports = router;
