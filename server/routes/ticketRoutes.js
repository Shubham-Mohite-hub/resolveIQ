const express = require("express");

const {
    createTicket,
    getTickets,
    getTicketById,
    updateTicket,
    assignTicket
} = require("../controllers/ticketController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, createTicket);

router.get("/", protect, getTickets);

router.get("/:id", protect, getTicketById);

router.patch("/:id", protect, updateTicket);

router.patch(
    "/:id/assign",
    protect,
    authorizeRoles("admin"),
    assignTicket
);
module.exports = router;