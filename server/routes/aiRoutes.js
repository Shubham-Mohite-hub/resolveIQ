const express = require("express");

const {
    analyzeTicketWithAI
} = require("../controllers/aiController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/analyze/:ticketId",
    protect,
    analyzeTicketWithAI
);

module.exports = router;