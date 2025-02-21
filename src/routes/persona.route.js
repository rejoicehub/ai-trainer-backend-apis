const express = require("express");
const personaController = require("../controllers/persona.controller");
const validate = require("../middlewares/validate");
const { personaValidation } = require("../validations");
const auth = require("../middlewares/auth");

const router = express.Router();

/**
 * Create persona
 */
router.post("/createPersona", validate(personaValidation.createPersona), personaController.createPersona);

/**
 * Get all persona
 */
router.get("/getPersona", personaController.getPersona);

router.delete("/deletePersona", personaController.deletePersona);

router.post("/webhook", personaController.webhook);


module.exports = router;