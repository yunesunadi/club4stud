const { ObjectId } = require("mongodb");
const { formatISO } = require("date-fns");
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

const getMembers = wrapper(async (req, res) => {
    const { id } = req.params;

    if (ObjectId.isValid(id)) {
        const _id = new ObjectId(id);
        const result = await clubs.findOne({ _id });
        const data = result.members;

        if (data.length === 0) {
            return res.status(404).json({ error: "Members not found" });
        }

        return res.status(200).json({ data });
    }
    return res.status(500).json({ error: "Not a valid id" });
});

const update = wrapper(async (req, res) => {
    const { id } = req.params;
    const { name, description, purpose, member_fees, founded_date, phone_number, email, password } = req.body;

    if (!name || !description || !purpose || !member_fees || !founded_date || !phone_number || !email || !password) {
        return res.status(400).json({ error: "Please fill in all fields" });
    }

    if (ObjectId.isValid(id)) {
        const _id = new ObjectId(id);
        await clubs.updateOne(
            { _id },
            {
                $set: {
                    name, description, purpose, member_fees, founded_date, phone_number, email, password,
                    updated_at: formatISO(new Date())
                }
            });
        const data = await clubs.findOne({ _id });
        return res.status(200).json(data);
    }
    return res.status(500).json({ error: "Not a valid id" });
})

const remove = wrapper(async (req, res) => {
    const { id } = req.params;

    if (ObjectId.isValid(id)) {
        const _id = new ObjectId(id);
        await clubs.deleteOne({ _id });
        return res.status(204).json({});
    }
    return res.status(500).json({ error: "Not a valid id" });
});

module.exports = {
    getAll,
    getOne,
    getMembers,
    update,
    remove
}