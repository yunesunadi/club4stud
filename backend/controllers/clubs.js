const { ObjectId } = require("mongodb");
const { formatISO } = require("date-fns");
const bcrypt = require("bcrypt");
const { wrapper } = require("../utils/utilities");
const db = require("../utils/utilities").getDB();
const clubs = db.collection("clubs");

const getAll = wrapper(async (req, res) => {
    const data = await clubs.find({ approve: true }).toArray();
    return res.status(200).json({ data });
});

const getOne = wrapper(async (req, res) => {
    const { id } = req.params;

    if (ObjectId.isValid(id)) {
        const _id = new ObjectId(id);
        const data = await clubs.findOne({ _id });

        if (!data) {
            return res.status(404).json({ error: "Club not found" });
        }

        return res.status(200).json({ data });
    }
    return res.status(500).json({ error: "Not a valid id" });
});

const getAuthClub = wrapper(async (req, res) => {
    const { _id: id } = res.locals.user;

    if (ObjectId.isValid(id)) {
        const _id = new ObjectId(id);
        const data = await clubs.findOne({ _id });

        if (!data) {
            return res.status(404).json({ error: "Club not found" });
        }

        return res.status(200).json({ data });
    }
    return res.status(500).json({ error: "Not a valid id" });
});

const getMembers = wrapper(async (req, res) => {
    const { _id } = res.locals.user;
    const club_id = new ObjectId(_id);

    const data = await clubs.aggregate([
        { $match: { "_id": club_id } },
        {
            $lookup: {
                from: "students",
                localField: "members.student",
                foreignField: "_id",
                as: "memberDetails"
            }
        },
        {
            $unwind: "$members"
        },
        {
            $lookup: {
                from: "students",
                localField: "members.student",
                foreignField: "_id",
                as: "members.student"
            }
        },
        {
            $unwind: "$members.student"
        },
        {
            $group: {
                _id: "$_id",
                members: {
                    $push: {
                        student: "$members.student",
                        request: "$members.request",
                        approve: "$members.approve",
                        created_at: "$members.created_at",
                        updated_at: "$members.updated_at",
                    }
                },
            }
        },
        {
            $project: {
                members: 1,
            }
        }
    ]).toArray();
    return res.status(200).json({ data });
});

const update = wrapper(async (req, res) => {
    const { _id: user_id } = res.locals.user;
    const { name, description, purpose, member_fees, founded_date, phone_number, email } = req.body;

    if (!name || !description || !purpose || !member_fees || !founded_date || !phone_number || !email) {
        return res.status(400).json({ error: "Please fill in all fields" });
    }

    if (ObjectId.isValid(user_id)) {
        const _id = new ObjectId(user_id);
        await clubs.updateOne(
            { _id },
            {
                $set: {
                    name, description, purpose, member_fees, founded_date, phone_number, email, updated_at: formatISO(new Date())
                }
            });
        const data = await clubs.findOne({ _id });
        return res.status(200).json(data);
    }
    return res.status(500).json({ error: "Not a valid id" });
});

const update_password = wrapper(async (req, res) => {
    const { _id: user_id } = res.locals.user;
    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
        return res.status(400).json({ error: "Old or new password required" });
    }

    if (ObjectId.isValid(user_id)) {
        const _id = new ObjectId(user_id);
        const result = await clubs.findOne({ _id });

        if (await bcrypt.compare(old_password, result.password)) {
            const hash = await bcrypt.hash(new_password, 10);
            await clubs.updateOne(
                { _id },
                {
                    $set: {
                        password: hash,
                        updated_at: formatISO(new Date())
                    }
                });
            const data = await clubs.findOne({ _id });
            return res.status(200).json(data);
        }
        return res.status(500).json({ error: "Not a valid id" });
    }
    return res.status(500).json({ error: "Old password doesn't match" });
});

const remove = wrapper(async (req, res) => {
    const { id } = req.params;

    if (ObjectId.isValid(id)) {
        const _id = new ObjectId(id);
        await clubs.deleteOne({ _id });
        return res.status(204).json({});
    }
    return res.status(500).json({ error: "Not a valid id" });
});

const join = wrapper(async (req, res) => {
    const { cid, sid } = req.params;

    if (ObjectId.isValid(cid) && ObjectId.isValid(sid)) {
        const _id = new ObjectId(cid);
        const student = new ObjectId(sid);
        const isExisted = await clubs.findOne({ _id, "members.student": student });

        if (isExisted) {
            await clubs.updateOne(
                { _id, "members.student": student },
                {
                    $set: {
                        "members.$.request": true,
                        "members.$.updated_at": formatISO(new Date()),
                        updated_at: formatISO(new Date())
                    }
                });
        } else {
            await clubs.updateOne(
                { _id },
                {
                    $push: {
                        members: {
                            student, request: true, approve: false,
                            created_at: formatISO(new Date()),
                            updated_at: formatISO(new Date())
                        }
                    },
                    $set: {
                        updated_at: formatISO(new Date())
                    }
                });
        }

        const data = await clubs.findOne({ _id });
        return res.status(200).json(data);
    }
    return res.status(500).json({ error: "Not a valid id" });
});

const cancel = wrapper(async (req, res) => {
    const { cid, sid } = req.params;

    if (ObjectId.isValid(cid) && ObjectId.isValid(sid)) {
        const _id = new ObjectId(cid);
        const student = new ObjectId(sid);
        await clubs.updateOne(
            { _id, "members.student": student },
            {
                $set: {
                    "members.$.request": false,
                    "members.$.updated_at": formatISO(new Date()),
                    updated_at: formatISO(new Date())
                }
            });
        const data = await clubs.findOne({ _id });
        return res.status(200).json(data);
    }
    return res.status(500).json({ error: "Not a valid id" });
});

const approve = wrapper(async (req, res) => {
    const { id } = req.params;
    const { _id: club_id } = res.locals.user;

    if (ObjectId.isValid(id) && ObjectId.isValid(club_id)) {
        const _id = new ObjectId(club_id);
        const student_id = new ObjectId(id);

        await clubs.updateOne(
            { _id, "members.student": student_id },
            {
                $set: {
                    "members.$.approve": true,
                    "members.$.updated_at": formatISO(new Date()),
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
    getAuthClub,
    update,
    update_password,
    remove,
    join,
    cancel,
    getMembers,
    approve
}