const Ticket = require("../models/Ticket");
const Message = require("../models/Message");
const { analyzeTicket } = require("../services/aiService");

const analyzeTicketWithAI = async (req, res) => {
    try {
        const { ticketId } = req.params;

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        const messages = await Message.find({
            ticket: ticketId
        }).sort({ createdAt: 1 });

        const analysis = await analyzeTicket(
            ticket,
            messages
        );

        res.status(200).json({
            message: "Ticket analyzed successfully",
            analysis
        });

    } catch (error) {
        res.status(500).json({
            message: "AI analysis failed",
            error: error.message
        });
    }
};

module.exports = {
    analyzeTicketWithAI
};