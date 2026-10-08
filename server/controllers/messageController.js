const Message = require("../models/Message");
const Ticket = require("../models/Ticket");

const createMessage = async (req, res) => {
    try {
        const { content } = req.body;
        const { ticketId } = req.params;

        // Check whether the ticket exists
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        // Create message using authenticated user
        const message = await Message.create({
            ticket: ticketId,
            sender: req.user.userId,
            senderRole: req.user.role,
            content
        });

        const populatedMessage = await Message.findById(message._id)
            .populate("sender", "name email role");

        res.status(201).json({
            message: "Message added successfully",
            data: populatedMessage
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add message",
            error: error.message
        });
    }
};

const getMessages = async (req, res) => {
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
        })
            .populate("sender", "name email role")
            .sort({ createdAt: 1 });

        res.status(200).json({
            count: messages.length,
            messages
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch messages",
            error: error.message
        });
    }
};

module.exports = {
    createMessage,
    getMessages
};