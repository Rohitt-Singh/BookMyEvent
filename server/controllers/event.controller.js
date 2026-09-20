const eventModel = require("../models/event.model");

const getAllEvents = async (req, res) => {
    try {
        const filters = {};

        // Category filter
        if (req.query.category) {
            filters.category = req.query.category;
        }

        // Price filter
        if (req.query.ticketPrice) {
            filters.ticketPrice = req.query.ticketPrice;
        }

        // Search filter
        if (req.query.search) {
            filters.title = {
                $regex: req.query.search,
                $options: "i"
            };
        }

        const events = await eventModel.find(filters);

        res.status(200).json(events);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getEventById = async (req, res) => {  
    try {
        const event = await eventModel.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createEvent = async (req, res) => {
    const { title, description, date, location, category, totalSeats, availableSeats, ticketPrice, imageUrl } = req.body;
    try {
        const event = await eventModel.create({
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            availableSeats,
            ticketPrice,
            imageUrl
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateEvent = async (req, res) => {
    try {
        const event = await eventModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const event = await eventModel.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};