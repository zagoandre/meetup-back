const express = require('express');
const router = express.Router();
const controller = require('../controllers/professional-controller');
const authService = require('../services/auth-service');

router.get("/all", authService.authorize, controller.get);
router.get("/email/:email", authService.authorize, controller.getByEmail);
// router.get("/id/:id/", authService.authorize, controller.getById);
router.get("/find/:obj", authService.authorize, controller.getByObj);
router.post("/", controller.post);
router.put("/:id", authService.authorize, controller.put);
router.delete("/", authService.authorize, controller.delete);

module.exports = router;