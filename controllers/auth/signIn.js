const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const signInScema = require("../../validation/auth/signIn");
const { Teacher } = require("../../models");

module.exports = async (req, res) => {
  try {
    // Validate the teacher
    const teacherValid = signInScema.validate(req.body);
    if (teacherValid.error) {
      req.flash("alert", {
        status: "error",
        message: teacherValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect("/auth/sign-in");
    }

    // Check if user exsists
    const teacherExsits = await Teacher.findOne({
      where: { email: req.body.username },
    });
    if (!teacherExsits) {
      req.flash("alert", {
        status: "error",
        message: "Username, Email, or Password incorrect",
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect("/auth/sign-in");
    }

    const teacher = teacherExsits.dataValues;

    // Check if Password is correct
    const passwordsCorrect = await bcrypt.compare(
      req.body.password,
      teacher.password
    );
    if (!passwordsCorrect) {
      req.flash("alert", {
        status: "error",
        message: "Username, Email, or Password incorrect",
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect("/auth/sign-in");
    }

    // Set expiry date for cookie and token
    let expiresIn = "2h";
    let expires = new Date(Date.now() + 2 * 60 * 60 * 1000);

    if (req.body.rememberMe && req.body.rememberMe === "on") {
      expiresIn = "3d";
      expires = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    }

    // Generate login token
    const token = jwt.sign({ id: teacher.id }, process.env.T_TOKEN_SECRET, {
      expiresIn,
    });
    res.cookie("tToken", token, { expires, path: "/" });

    return res.redirect("/dashboard");
  } catch (error) {
    console.error(`ERROR LOGGING IN TEACHER: ${error}`);
    req.flash("alert", {
      status: "error",
      message: "An unexpected error occured",
    });
    req.flash("form", req.body);
    req.flash("status", 400);
    return res.redirect("/auth/sign-in");
  }
};
