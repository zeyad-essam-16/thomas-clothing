import { Router } from "express";
import passport from "passport";
import { body } from "express-validator";
import User from "../models/User.js";

import dotenv from "dotenv";

import * as authController from "../controllers/auth.js";

dotenv.config();

const router = Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("email address already exists");
          }
        });
      }),
    body("password").trim().isLength({ min: 8, max: 24 }),
    body("username").trim().isLength({ min: 6 }).not().isEmpty(),
  ],
  authController.putSignup
);

router.post("/login", authController.postLogin);

router.get("/google", (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    passReqToCallback: true,
    state: req.query.checkout === "true" ? "true" : "false",
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.REACT_APP_URL,
    session: true,
  }),
  function (req, res) {
    const state = req.query.state;
    const reactAppUrl = process.env.REACT_APP_URL;
    const redirectUrl = state === "true" ? `${reactAppUrl}/cart` : reactAppUrl;
    res.redirect(redirectUrl);
  }
);

router.get("/getuser", authController.getUser);

router.post("/reset", authController.postReset);

router.post(
  "/new-password",
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),
  body("passwordConfirm")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("passwords have to match");
      }
      return true;
    }),
  authController.postNewPasword
);

router.get("/logout", authController.getLogout);

export default router;
