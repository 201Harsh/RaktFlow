const router = require("express").Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const userMiddleware = require("../middlewares/user.middleware");

router.post(
  "/register",
  [
    body("username").not().isEmpty().withMessage("Username is required"),
    body("password").not().isEmpty().withMessage("Password is required"),
  ],
  userController.RegisterUser
);

router.post(
  "/login",
  [
    body("username").not().isEmpty().withMessage("Username is required"),
    body("password").not().isEmpty().withMessage("Password is required"),
  ],
  userController.LoginUser
);

router.get("/all", userController.GetAllUsers);

router.get("/profile", userMiddleware.authUser, userController.getOneUser);

router.post('/logout', userMiddleware.authUser, userController.LogoutUser);

module.exports = router;
