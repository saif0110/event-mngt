const Event = require("../model/event")
const Attendee = require("../model/attendee")
const createEvent = async (req, res)=>{
    if(!req.body.name){
        return res.status(400).json({
            success: false,
            message: "name is required in request body"
        })
    }
    const eventDetail = {
        name: req.body.name,
        creator: req.user._id,
        date: new Date()
    }
    const event = new Event(eventDetail);
    await event.save();
    res.json({
        success: true,
        message: "Event created successfully"
    })
}
const getEvent = async (req, res)=>{        //try on partial search
    const params  = req.query
    const queryObject = {
        name: {
            $regex: new RegExp(params.searchKey),
            $options: "i" 
        }
    }    
    const events = await Event.find(queryObject)
    res.json({
        success: true,
        result: events? events: []
    })
}

const joinEvent = async (req, res)=>{
    if(!req.body.eventId){
        return res.status(400).json({
            success: false,
            message: "eventId need to passed in request body"
        })
    }
    const body = req.body
    const alreadyAttendedJoined = await Attendee.findOne({
        eventId: body.eventId,
        userId: req.user._id
    })
    if(alreadyAttendedJoined){
        return res.status(400).json({
            success: false,
            message: "User has already joined the event"
        })
    }
    const attendee = new Attendee({
        eventId: body.eventId,
        userId: req.user._id
    })
    await attendee.save()
    res.json({
        success: true,
        message: "user joined the event"
    })
}
const getAllAttendee = async (req, res)=>{
    const attendee = await Attendee.find().populate("eventId").populate("userId")
    res.json({
        success: false,
        total: attendee.length,
        result: attendee ? attendee : []
    })
}
module.exports = {
    createEvent,
    getEvent,
    joinEvent,
    getAllAttendee
}