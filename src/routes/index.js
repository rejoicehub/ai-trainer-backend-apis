const express = require("express");

const router = express.Router();

/** Normal user routes */
router.use("/auth", require("./auth.route"));
router.use("/docs",require("./docs.route"));
router.use("/persona", require("./persona.route"));
router.use("/conversation", require("./conversation.route"));
router.use("/category", require("./category.route"));


module.exports = router;
