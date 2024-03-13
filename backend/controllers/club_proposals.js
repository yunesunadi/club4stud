const bcrypt = require("bcrypt");
const { wrapper } = require("../utils/utilities");
const { ObjectId } = require("mongodb");
const { formatISO } = require("date-fns");
const db = require("../utils/utilities").getDB();
const clubs = db.collection("clubs");

const getAll = wrapper(async (req, res) => {
    const data = await clubs.find({ request: true, approve: false, decline: false }).toArray();
    return res.status(200).json({ data });
});

const getApproved = wrapper(async (req, res) => {
    const data = await clubs.find({ approve: true }).toArray();
    return res.status(200).json({ data });
});

const getDeclined = wrapper(async (req, res) => {
    const data = await clubs.find({ decline: true }).toArray();
    return res.status(200).json({ data });
});

const insert = wrapper(async (req, res) => {
    const { name, description, purpose, member_fees, founded_date, phone_number, email, password, owner, request, approve, decline, role, schedules, members } = req.body;

    if (!name || !description || !purpose || !member_fees || !founded_date || !phone_number || !email || !password || !owner) {
        return res.status(400).json({ error: "Please fill in all fields" });
    }

    const hash = await bcrypt.hash(password, 10);
    const owner_id = new ObjectId(owner);
    const result = await clubs.insertOne({
        name, description, purpose, member_fees, founded_date, phone_number, email, password: hash,
        owner: owner_id, request, approve, decline, role, schedules, members,
        created_at: formatISO(new Date()),
        updated_at: formatISO(new Date())
    });
    const data = await clubs.findOne({ _id: new ObjectId(result.insertedId) });

    return res.status(200).json({ data });
});

const approve = wrapper(async (req, res) => {
    const { id } = req.params;

    if (ObjectId.isValid(id)) {
        const _id = new ObjectId(id);
        await clubs.updateOne(
            { _id },
            {
                $set: {
                    approve: true,
                    updated_at: formatISO(new Date())
                }
            });
        const data = await clubs.findOne({ _id });
        return res.status(200).json(data);
    }
    return res.status(500).json({ error: "Not a valid id" });
});

const decline = wrapper(async (req, res) => {
    const { id } = req.params;

    if (ObjectId.isValid(id)) {
        const _id = new ObjectId(id);
        await clubs.updateOne(
            { _id },
            {
                $set: {
                    decline: true,
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
    getApproved,
    getDeclined,
    insert,
    approve,
    decline
}