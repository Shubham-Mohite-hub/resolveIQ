const analyzeTicket = async (ticket, messages) => {
    const conversation = messages.map((message) => ({
        sender: message.senderRole,
        content: message.content,
        createdAt: message.createdAt
    }));

    console.log("Ticket:", ticket.subject);
    console.log("Conversation:", conversation);

    return {
        summary: "AI analysis pending",
        category: ticket.category,
        intent: "unknown",
        priority: ticket.priority,
        sentiment: "unknown",
        keyInformation: []
    };
};

module.exports = {
    analyzeTicket
};