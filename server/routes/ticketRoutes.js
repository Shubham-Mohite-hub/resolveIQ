const express = require("express");

const {
    createTicket,
    getTickets,
    getTicketById,
    updateTicket
} = require("../controllers/ticketController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createTicket);
router.get("/", protect, getTickets);
router.get("/:id", protect, getTicketById);
router.patch("/:id", protect, updateTicket);

module.exports = router;