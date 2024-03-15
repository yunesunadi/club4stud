const { ObjectId } = require("mongodb");
const { formatISO } = require("date-fns");
const { wrapper } = require("../utils/utilities");
const db = require("../utils/utilities").getDB();
const clubs = db.collection("clubs");

const getAll = wrapper(async (req, res) => {
    const { _id } = res.locals.user;

    if (ObjectId.isValid(_id)) {
        const club_id = new ObjectId(_id);
        const data = await clubs.aggregate([
            { $match: { "_id": club_id } },
            {
                $project: {
                    schedules: 1,
                }
            },

        ]).toArray();
        return res.status(200).json({ data });
    }
    return res.status(500).json({ error: "Not a valid id" });
});

const getOne = wrapper(async (req, res) => {
    const { _id } = res.locals.user;
    const { id } = req.params;

    if (ObjectId.isValid(_id) && ObjectId.isValid(id)) {
        const club_id = new ObjectId(_id);
        const schedule_id = new ObjectId(id);
        const data = await clubs.aggregate([
            { $match: { "_id": club_id, } },
            { $unwind: "$schedules" },
            { $match: { "schedules._id": schedule_id } },
            {
                $project: {
                    schedules: 1,
                }
            },
        ]).toArray();
        return res.status(200).json({ data });
    }
    return res.status(500).json({ error: "Not a valid id" });
});

const insert = wrapper(async (req, res) => {
    const { _id: club_id } = res.locals.user;
    const { description, date, start_time, end_time, location } = req.body;

    if (!description || !date || !start_time || !end_time || !location) {
        return res.status(400).json({ error: "Please fill in all fields" });
    }

    if (ObjectId.isValid(club_id)) {
        const _id = new ObjectId(club_id);
        await clubs.updateOne(
            { _id },
            {
                $push: {
                    schedules: {
                        _id: new ObjectId(),
                        description, date, start_time, end_time, location, archive: false, attendance: {},
                        created_at: formatISO(new Date()),
                        updated_at: formatISO(new Date())
                    }
                },
                $set: {
                    updated_at: formatISO(new Date())
                }
            });
        const data = await clubs.findOne({ _id });
        return res.status(200).json(data);
    }
    return res.status(500).json({ error: "Not a valid id" });
});

const update = wrapper(async (req, res) => {
    const { _id: cid } = res.locals.user;
    const { _id: sid, description, date, start_time, end_time, location } = req.body;

    if (!description || !date || !start_time || !end_time || !location) {
        return res.status(400).json({ error: "Please fill in all fields" });
    }

    if (ObjectId.isValid(cid) && ObjectId.isValid(sid)) {
        const _id = new ObjectId(cid);
        const schedule_id = new ObjectId(sid);
        await clubs.updateOne(
            { _id, "schedules._id": schedule_id },
            {
                $set: {
                    "schedules.$.description": description,
                    "schedules.$.date": date,
                    "schedules.$.start_time": start_time,
                    "schedules.$.end_time": end_time,
                    "schedules.$.location": location,
                    "schedules.$.updated_at": formatISO(new Date()),
                    updated_at: formatISO(new Date())
                }
            });
        const data = await clubs.findOne({ _id });
        return res.status(200).json(data);
    }
    return res.status(500).json({ error: "Not a valid id" });
})

const remove = wrapper(async (req, res) => {
    const { _id: club_id } = res.locals.user;
    const { _id: sid } = req.body;

    if (ObjectId.isValid(club_id)) {
        const _id = new ObjectId(club_id);
        const schedule_id = new ObjectId(sid);
        await clubs.updateOne(
            { _id, "schedules._id": schedule_id },
            {
                $set: {
                    "schedules.$": {},
                    updated_at: formatISO(new Date())
                }
            });
        const data = await clubs.findOne({ _id });
        return res.status(200).json(data);
    }
    return res.status(500).json({ error: "Not a valid id" });
});

module.exports = {
    getAll,
    getOne,
    insert,
    update,
    remove
}