const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);


const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.route");
const eventRoutes = require("./routes/events.route");
const bookingRoutes = require("./routes/booking.route");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Error connecting to DB:", err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = app;
