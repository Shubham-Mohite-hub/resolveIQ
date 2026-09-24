const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

console.log("Mongo URI exists:", !!process.env.MONGO_URI);
console.log("Mongo username:", process.env.MONGO_URI?.split("://")[1]?.split(":")[0]);

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.json({
        message: "ResolveIQ API is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`ResolveIQ server running on port ${PORT}`);
});