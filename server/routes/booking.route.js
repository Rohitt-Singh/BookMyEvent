const express = require("express");
const router = express.Router();
const { bookEvent, sendBookingOtp, getMyBookings, confirmBooking, cancelBooking, getAllBookings } = require("../controllers/booking.controller");


const { protect, admin } = require("../middlewares/auth.middleware");


router.post("/", protect, bookEvent);
router.post("/send-otp", protect, sendBookingOtp);
router.get("/my", protect, getMyBookings);
router.put("/:id/confirm", protect, confirmBooking);
router.delete("/:id", protect, cancelBooking);
router.get("/all", protect, admin, getAllBookings);


module.exports = router;