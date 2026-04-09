const router = require("express").Router();

const loginVerifier = require("../middlewares/loginVerifire");
const setUnreadNotificationCount = require("../middlewares/setUnreadNotificationCount");

router.use(require("../middlewares/setCurrentPath"));
router.use(require("../middlewares/setSiteSettings"));
router.use("/dashboard", loginVerifier, setUnreadNotificationCount, require("./dashboard"));
router.use("/auth", loginVerifier, require("./auth"));
router.use("/api", loginVerifier, require("./api"));

router.get("/", (req, res) => {
  res.redirect("/dashboard/dashboard");
});

router.get("*", (req, res) => {
  res.render("error.ejs");
});

module.exports = router;
