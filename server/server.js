const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "ResolveIQ API is running"
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`ResolveIQ server running on port ${PORT}`);
});