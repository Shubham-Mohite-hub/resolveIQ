const express = require("express");

const {
    createMessage,
    getMessages
} = require("../controllers/messageController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:ticketId", protect, createMessage);

router.get("/:ticketId", protect, getMessages);

module.exports = router;