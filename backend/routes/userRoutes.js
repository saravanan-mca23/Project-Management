const express = require("express");
const { getAllUsers, deleteUser } = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/all", verifyToken, getAllUsers);
router.delete("/:id", verifyToken, deleteUser);

module.exports = router;
