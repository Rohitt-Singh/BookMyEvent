const express = require("express");
const router = express.Router();
const {getAllEvents, getEventById, createEvent, updateEvent, deleteEvent} = require("../controllers/event.controller");

const {protect, admin} = require("../middlewares/auth.middleware");




router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", protect, admin, createEvent);
router.put("/:id", protect, admin, updateEvent);
router.delete("/:id", protect, admin, deleteEvent);


module.exports = router;