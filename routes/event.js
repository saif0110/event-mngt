const express = require("express");
const router = new express.Router()

const {createEvent, getEvent, joinEvent, getAllAttendee} = require("../controller/event")

router.post("/create", createEvent)
router.get("/list", getEvent)
router.get("/attendee", getAllAttendee)
router.post("/join", joinEvent)

module.exports = router