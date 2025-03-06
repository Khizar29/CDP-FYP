const express = require("express");
const {
  registerFaculty,
  getAllFaculty,
  getPendingFaculty,
  verifyFaculty,
  unverifyFaculty,
  deleteFaculty,
  updateFaculty,
} = require("../controllers/faculty.controller.js");
const { verifyJWT, verifyAdmin } = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/register", registerFaculty);
router.get("/", verifyJWT, verifyAdmin, getAllFaculty);
router.get("/pending", verifyJWT, verifyAdmin, getPendingFaculty);
router.put("/verify/:facultyId", verifyJWT, verifyAdmin, verifyFaculty);
router.put("/unverify/:facultyId", verifyJWT, verifyAdmin, unverifyFaculty);
router.delete("/:facultyId", verifyJWT, verifyAdmin, deleteFaculty);
router.put("/:facultyId", verifyJWT, verifyAdmin, updateFaculty);

module.exports = router;
