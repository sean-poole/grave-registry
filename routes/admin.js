const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");

// Admin Routes
router.post("/login", adminController.login);
router.get("/logout", adminController.logout);
router.get("/updatePage", adminController.getUpdatePage);
router.get("/getUpdateRecord", adminController.getUpdateRecord);
router.post("/updateRecord", adminController.updateRecord);

module.exports = router;
