const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/authController");

const router = express.Router();

router.get("/", getUsers); // GET all users
router.get("/:id", getUserById); // GET user by ID
router.post("/", createUser); // POST create a new user
router.put("/:id", updateUser); // PUT update user by ID
router.delete("/:id", deleteUser); // DELETE user by ID

module.exports = router;
