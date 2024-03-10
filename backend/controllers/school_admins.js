require("dotenv").config();
const { ObjectId } = require("mongodb");
const { formatISO } = require("date-fns");
const bcrypt = require("bcrypt");
const { wrapper } = require("../utils/utilities");
const db = require("../utils/utilities").getDB();
const school_admins = db.collection("school_admins");

const insert = wrapper(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email or password required" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = {
        email,
        password: hash,
        role: "school_admin",
        created_at: formatISO(new Date()),
        updated_at: formatISO(new Date())
    }
    const result = await school_admins.insertOne(user);
    user._id = result.insertedId;
    return res.status(200).json(user);
});

const update = wrapper(async (req, res) => {
    const { id } = req.params;
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email or password required" });
    }

    if (ObjectId.isValid(id)) {
        const _id = new ObjectId(id);
        const hash = await bcrypt.hash(password, 10);
        await school_admins.updateOne(
            { _id },
            {
                $set: {
                    email,
                    password: hash,
                    updated_at: formatISO(new Date())
                }
            });
        const data = await school_admins.findOne({ _id });
        return res.status(200).json(data);
    }
    return res.status(500).json({ error: "Not a valid id" });
});

module.exports = {
    insert,
    update
}