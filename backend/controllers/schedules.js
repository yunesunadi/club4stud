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
            { $unwind: "$schedules" },
            {
                $sort: { "schedules.created_at": -1 }
            },
            {
                $group: {
                    _id: "$_id",
                    schedules: { $push: "$schedules" }
                }
            }
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
    const { _id: club_id, members } = res.locals.user;
    const { description, start_date_time, end_date_time, location } = req.body;

    if (!description || !start_date_time || !end_date_time || !location) {
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
                        description, start_date_time, end_date_time, location, archive: false,
                        attendance: [
                            ...members.map(({ student }) => {
                                const student_id = new ObjectId(student);
                                return {
                                    student: student_id, present: false, absent: false,
                                    created_at: formatISO(new Date()),
                                    updated_at: formatISO(new Date())
                                };
                            })
                        ],
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
    const { _id: sid, description, start_date_time, end_date_time, location } = req.body;

    if (!description || !start_date_time || !end_date_time || !location) {
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
                    "schedules.$.start_date_time": start_date_time,
                    "schedules.$.end_date_time": end_date_time,
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

const getJoined = wrapper(async (req, res) => {
    const { _id } = res.locals.user;

    if (ObjectId.isValid(_id)) {
        const student_id = new ObjectId(_id);
        const data = await clubs.aggregate([
            { $unwind: "$members" },
            { $match: { "members.student": student_id, "members.approve": true } },
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

const getAttendance = wrapper(async (req, res) => {
    const { id } = req.params;
    const { _id } = res.locals.user;

    if (ObjectId.isValid(_id)) {
        const club_id = new ObjectId(_id);
        const schedule_id = new ObjectId(id);
        const data = await clubs.aggregate([
            { $match: { "_id": club_id, "schedules._id": schedule_id } },
            { $unwind: "$schedules" },
            { $unwind: "$schedules.attendance" },
            {
                $lookup: {
                    from: "students",
                    localField: "schedules.attendance.student",
                    foreignField: "_id",
                    as: "schedules.attendance.student"
                }
            },
            { $unwind: "$schedules.attendance.student" },
            {
                $group: {
                    _id: {
                        _id: "$_id",
                        name: "$name",
                        scheduleId: "$schedules._id"
                    },
                    attendance: {
                        $addToSet: {
                            present: "$schedules.attendance.present",
                            absent: "$schedules.attendance.absent",
                            created_at: "$schedules.attendance.created_at",
                            updated_at: "$schedules.attendance.updated_at",
                            student: {
                                _id: "$schedules.attendance.student._id",
                                student_id: "$schedules.attendance.student.student_id",
                                name: "$schedules.attendance.student.name",
                                batch: "$schedules.attendance.student.batch",
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: "$_id._id",
                    name: "$_id.name",
                    schedules: {
                        _id: "$_id.scheduleId",
                        description: "$_id.scheduleDescription",
                        date: "$_id.scheduleDate",
                        start_time: "$_id.scheduleStartTime",
                        end_time: "$_id.scheduleEndTime",
                        location: "$_id.scheduleLocation",
                        archive: "$_id.scheduleArchive",
                        attendance: "$attendance",
                        created_at: "$_id.scheduleCreatedAt",
                        updated_at: "$_id.scheduleUpdatedAt"
                    }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    schedules: { $push: "$schedules" }
                }
            }
        ]).toArray();
        return res.status(200).json({ data });
    }
    return res.status(500).json({ error: "Not a valid id" });
});

const present = wrapper(async (req, res) => {
    const { scid, stid } = req.params;
    const { _id: club_id } = res.locals.user;

    if (ObjectId.isValid(scid) && ObjectId.isValid(stid) && ObjectId.isValid(club_id)) {
        const _id = new ObjectId(club_id);
        const schedule_id = new ObjectId(scid);
        const student_id = new ObjectId(stid);

        await clubs.updateOne(
            { _id, "schedules._id": schedule_id, "schedules.attendance.student": student_id },
            {
                $set: {
                    "schedules.$[schedule].attendance.$[attendance].present": true,
                    "schedules.$[schedule].attendance.$[attendance].absent": false,
                    "schedules.$[schedule].attendance.$[attendance].updated_at": formatISO(new Date()),
                    "schedules.$[schedule].updated_at": formatISO(new Date()),
                    updated_at: formatISO(new Date())
                }
            },
            {
                arrayFilters: [
                    { "schedule._id": schedule_id },
                    { "attendance.student": student_id }
                ]
            }
        );

        const data = await clubs.findOne({ _id });
        return res.status(200).json(data);
    }
    return res.status(500).json({ error: "Not a valid id" });
});

const absent = wrapper(async (req, res) => {
    const { scid, stid } = req.params;
    const { _id: club_id } = res.locals.user;

    if (ObjectId.isValid(scid) && ObjectId.isValid(stid) && ObjectId.isValid(club_id)) {
        const _id = new ObjectId(club_id);
        const schedule_id = new ObjectId(scid);
        const student_id = new ObjectId(stid);

        await clubs.updateOne(
            { _id, "schedules._id": schedule_id, "schedules.attendance.student": student_id },
            {
                $set: {
                    "schedules.$[schedule].attendance.$[attendance].absent": true,
                    "schedules.$[schedule].attendance.$[attendance].present": false,
                    "schedules.$[schedule].attendance.$[attendance].updated_at": formatISO(new Date()),
                    "schedules.$[schedule].updated_at": formatISO(new Date()),
                    updated_at: formatISO(new Date())
                }
            },
            {
                arrayFilters: [
                    { "schedule._id": schedule_id },
                    { "attendance.student": student_id }
                ]
            }
        );

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
    remove,
    getJoined,
    getAttendance,
    present,
    absent
}