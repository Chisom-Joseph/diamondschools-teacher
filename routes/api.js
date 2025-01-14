const router = require("express").Router();

// Aspirants
router.get("/get-aspirants", require("../controllers/api/getAspirants"));

// Students
router.get("/get-students", require("../controllers/api/getStudents"));

// Guardians
router.get("/get-guardians", require("../controllers/api/getGuardians"));

module.exports = router;
