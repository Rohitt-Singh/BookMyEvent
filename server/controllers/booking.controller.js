const bookingModel = require("../models/booking.model");
const eventModel = require("../models/event.model");
const otpModel = require("../models/otp.model");
const { sendBookingEmail, sendOtpEmail } = require("../utils/email.util");

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

async function sendBookingOtp(req, res) {
  const otp = generateOtp();
  await otpModel.findOneAndDelete({
    email: req.user.email,
    action: "event_booking",
  });
  await otpModel.create({
    email: req.user.email,
    otp,
    action: "event_booking",
  });
  await sendOtpEmail(req.user.email, otp, "event_booking");
  res.status(200).json({ message: "OTP sent successfully" });
}

async function bookEvent(req, res) {
  const { eventId, otp } = req.body;
  const otpRecord = await otpModel.findOne({
    email: req.user.email,
    otp,
    action: "event_booking",
  });
  if (!otpRecord) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const event = await eventModel.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  if (event.availableSeats <= 0) {
    return res
      .status(400)
      .json({ message: "No available seats for this event" });
  }

  const existingBooking = await bookingModel.findOne({
    user: req.user._id,
    event: eventId,
  });
  if (existingBooking) {
    return res
      .status(400)
      .json({ message: "You have already booked this event" });
  }

  const booking = await bookingModel.create({
    userId: req.user._id,
    eventId,
    status: "pending",
    paymentStatus: "not_paid",
    amount: event.ticketPrice,
  });

  await otpModel.deleteMany({ email: req.user.email, action: "event_booking" });
  res.status(201).json({ message: "Booking created successfully", booking });
}

async function confirmBooking(req, res) {
    const { paymentStatus } = req.body;

    if (!["paid", "not_paid"].includes(paymentStatus)) {
        return res.status(400).json({
            message: "Invalid payment status"
        });
    }

    const booking = await bookingModel
        .findById(req.params.id)
        .populate("eventId");

    if (!booking) {
        return res.status(404).json({
            message: "Booking not found"
        });
    }

    if (booking.status === "confirmed") {
        return res.status(400).json({
            message: "Booking is already confirmed"
        });
    }

    const event = booking.eventId;

    if (!event) {
        return res.status(404).json({
            message: "Event not found"
        });
    }

    if (typeof event.availableSeats !== "number") {
        return res.status(500).json({
            message: "Event availableSeats is invalid"
        });
    }

    if (event.availableSeats <= 0) {
        return res.status(400).json({
            message: "No available seats for this event"
        });
    }

    booking.status = "confirmed";
    booking.paymentStatus = paymentStatus;

    await booking.save();

    event.availableSeats -= 1;
    await event.save();

    await sendBookingEmail(
        req.user.email,
        req.user.name,
        event.title
    );

    res.status(200).json({
        message: "Booking confirmed successfully",
        booking
    });
}

async function getMyBookings(req, res) {
  const bookings = await bookingModel
    .find({ userId: req.user._id })
    .populate("eventId");
  res.status(200).json(bookings);
}

async function cancelBooking(req, res) {
    const booking = await bookingModel.findById(req.params.id);

    if (!booking) {
        return res.status(404).json({
            message: "Booking not found"
        });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            message: "You are not authorized to cancel this booking"
        });
    }

    // Remember whether the booking was confirmed
    const wasConfirmed = booking.status === "confirmed";

    // Cancel the booking
    booking.status = "cancelled";
    await booking.save();

    // If it was already confirmed, return the seat
    if (wasConfirmed) {
        const event = await eventModel.findById(booking.eventId);

        if (event) {
            event.availableSeats += 1;
            await event.save();
        }
    }

    res.status(200).json({
        message: "Booking cancelled successfully"
    });
}

async function getAllBookings(req, res) {
    try {
        const bookings = await bookingModel
            .find()
            .populate("userId", "name email")
            .populate("eventId");

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


module.exports = {
  sendBookingOtp,
  bookEvent,
  confirmBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings
};