const express = require("express");
const conversationController = require("../controllers/conversation.controller");
const validate = require("../middlewares/validate");
const { conversationValidation } = require("../validations");
const auth = require("../middlewares/auth");

const router = express.Router();

/**
 * Create conversation
 */
router.post(
  "/createConversation",
  validate(conversationValidation.createConversation),
  conversationController.createConversation
);

/**
 * Create conversation report
 */
router.get("/createReport", validate(conversationValidation.createReport), conversationController.createReport);

/**
 * Get conversation
 */
router.get(
  "/getConversation",
  validate(conversationValidation.getConversation),
  conversationController.getConversation
);

/**
 * Update conversation
 */
router.put(
  "/updateConversation",
  validate(conversationValidation.updateConversation),
  conversationController.updateConversation
);

/**
 * Delete conversation
 */
router.delete(
  "/deleteConversation",
  validate(conversationValidation.deleteConversation),
  conversationController.deleteConversation
);

module.exports = router;
