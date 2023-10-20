const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const getLoginPage = (req, res) => {
  if (!req.session.isLogged) {
    res.render("auth/login", {
      title: "Login",
      loginError: req.flash("loginError"),
      url: process.env.URL,
    });
  }
};

const getRegisterPage = (req, res) => {
  if (!req.session.isLogged) {
    res.render("auth/signup", {
      title: "Registratsiya",
      regError: req.flash("regError"),
      url: process.env.URL,
    });
  }
};

const registerNewUser = async (req, res) => {
  try {
    const { email, username, phone, password, password2 } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
      req.flash("regError", "Bunday foydalanuvchi bazada bor");
      return res.redirect("/auth/signup");
    }

    if (password !== password2) {
      req.flash("regError", "Parollar mos kelmadi");
      return res.redirect("/auth/signup");
    }

    await User.create({
      email,
      username,
      phone,
      password,
    });

    return res.redirect("/auth/login");
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      const matchPassword = await bcrypt.compare(
        req.body.password,
        userExist.password
      );
      if (matchPassword) {
        req.session.user = userExist;
        req.session.isLogged = true;
        req.session.save((err) => {
          if (err) throw err;
          res.redirect("/profile/" + req.session.user.username);
        });
      } else {
        req.flash("loginError", "Notogri malumot kiritildi");
        res.redirect("/auth/login");
      }
    } else {
      req.flash("loginError", "Bunday foydalanuvchi mavjud emas");
      res.redirect("/auth/login");
    }
  } catch (error) {
    console.log(error);
  }
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
module.exports = {
  getLoginPage,
  getRegisterPage,
  registerNewUser,
  loginUser,
  logout,
};
