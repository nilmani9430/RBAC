const express = require("express");
const userController = require("../controllers/userController");
const { auth, checkRole } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get(
  "/self",
  auth,
  checkRole(["superAdmin", "branchManager", "salesPerson"]),
  userController.getSelf
);
router.post(
  "/create",
  auth,
  checkRole(["superAdmin", "branchManager"]),
  userController.createUser
);
router.get(
  "/list",
  auth,
  checkRole(["superAdmin", "branchManager"]),
  userController.getUserList
);
router.delete(
  "/delete/:userId",
  auth,
  checkRole(["superAdmin", "branchManager"]),
  userController.deleteUser
);

module.exports = router;
