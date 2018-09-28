const express = require('express');
const router = express.Router();
const controller = require('../controllers/user-controller');
const authService = require('../services/auth-service');

router.get("/", authService.authorize, controller.get);
router.get("/:email", authService.authorize, controller.getByEmail);
router.post("/", authService.authorize, controller.post);
router.put("/:id", authService.authorize, controller.put);
router.delete("/", authService.authorize, controller.delete);
router.post('/authenticate', controller.authenticate);

module.exports = router;