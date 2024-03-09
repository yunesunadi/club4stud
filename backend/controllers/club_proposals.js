const { wrapper } = require("../utils/utilities");

const db = require("../utils/utilities").getDB();
const clubs = db.collection("clubs");

const getAll = wrapper(async (req, res) => {
    const data = await clubs.find({ request: true }).toArray();
    return res.status(200).json({ data });
});

const getApproved = wrapper(async (req, res) => {
    const data = await clubs.find({ approve: true }).toArray();
    return res.status(200).json({ data });
});

const getDeclined = wrapper(async (req, res) => {
    const data = await clubs.find({ approve: false }).toArray();
    return res.status(200).json({ data });
});

const insert = wrapper(async (req, res) => {
    const { name, description, purpose, member_fees, founded_date, phone_number, email, password } = req.body;

    if (!name || !description || !purpose || !member_fees || !founded_date || !phone_number || !email || !password) {
        return res.status(400).json({ error: "Please fill in all fields" });
    }

    const result = await students.insertOne({
        name, description, purpose, member_fees, founded_date, phone_number, email, password,
        owner: "",
        request: null,
        approve: null,
        schedules: [],
        members: [],
        created_at: formatISO(new Date()),
        updated_at: formatISO(new Date())
    });
    const data = await students.findOne({ _id: new ObjectId(result.insertedId) });

    return res.status(200).json({ data });
});

module.exports = {
    getAll,
    getApproved,
    getDeclined,
    insert
}