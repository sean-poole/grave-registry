const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");

// Main Routes
router.get("/", homeController.getIndex);
router.get("/loginPage", homeController.getLogin);
router.get("/search", homeController.getSearch);

module.exports = router;
