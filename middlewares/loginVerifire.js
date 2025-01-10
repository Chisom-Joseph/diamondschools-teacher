const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.tToken;
    const authRoutes = ["/auth/sign-in"];

    if (!token && !authRoutes.includes(req.originalUrl)) {
      res.clearCookie("tToken");
      return res.redirect("/auth/sign-in");
    }

    if (!token && authRoutes.includes(req.originalUrl)) {
      next();
    }

    const tokenVerified = jwt.verify(token, process.env.T_TOKEN_SECRET);

    if (!tokenVerified && authRoutes.includes(req.originalUrl)) {
      return res.redirect("/auth/sign-in");
    }

    if (tokenVerified && authRoutes.includes(req.originalUrl)) {
      return res.redirect("/dashboard");
    }

    if (!tokenVerified && !authRoutes.includes(req.originalUrl)) {
      return res.redirect("/auth/sign-in");
    }

    const teacher = await require("../utils/getTeacher")(tokenVerified.id);

    if (Object.keys(teacher).length === 0) {
      res.clearCookie("tToken");
      return res.redirect("/auth/sign-in");
    }

    req.teacher = teacher;
    res.locals.teacher = teacher;
    res.locals.isLoggedin = true;
    return next();
  } catch (error) {
    console.error("ERROR VERIFING LOGIN");
    console.error(error);
  }
};
