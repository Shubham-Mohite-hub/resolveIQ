const Ticket = require("../models/Ticket");
const User = require("../models/User");

const createTicket = async (req, res) => {
    try {
        const {
            customerName,
            customerEmail,
            subject,
            description,
            priority,
            category
        } = req.body;

        const ticket = await Ticket.create({
            customerName,
            customerEmail,
            subject,
            description,
            priority,
            category
        });

        res.status(201).json({
            message: "Ticket created successfully",
            ticket
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create ticket",
            error: error.message
        });
    }
};

const getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: tickets.length,
            tickets
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch tickets",
            error: error.message
        });
    }
};

const getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        res.status(200).json({
            ticket
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch ticket",
            error: error.message
        });
    }
};

const updateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        res.status(200).json({
            message: "Ticket updated successfully",
            ticket
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update ticket",
            error: error.message
        });
    }
};

const assignTicket = async (req, res) => {
    try {
        const { agentId } = req.body;

        // Check whether the user exists
        const agent = await User.findById(agentId);

        if (!agent) {
            return res.status(404).json({
                message: "Agent not found"
            });
        }

        // Make sure the user is actually an agent
        if (agent.role !== "agent") {
            return res.status(400).json({
                message: "Ticket can only be assigned to an agent"
            });
        }

        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            {
                assignedAgent: agentId
            },
            {
                new: true,
                runValidators: true
            }
        ).populate(
            "assignedAgent",
            "name email role"
        );

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        res.status(200).json({
            message: "Ticket assigned successfully",
            ticket
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to assign ticket",
            error: error.message
        });
    }
};

module.exports = {
    createTicket,
    getTickets,
    getTicketById,
    updateTicket,
    assignTicket
};