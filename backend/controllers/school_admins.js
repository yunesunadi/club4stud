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

const update_email = wrapper(async (req, res) => {
    const { _id: user_id } = res.locals.user;
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email required" });
    }

    if (ObjectId.isValid(user_id)) {
        const _id = new ObjectId(user_id);
        await school_admins.updateOne(
            { _id },
            {
                $set: {
                    email, updated_at: formatISO(new Date())
                }
            });
        const data = await school_admins.findOne({ _id });
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
        const result = await school_admins.findOne({ _id });

        if (await bcrypt.compare(old_password, result.password)) {
            const hash = await bcrypt.hash(new_password, 10);
            await school_admins.updateOne(
                { _id },
                {
                    $set: {
                        password: hash,
                        updated_at: formatISO(new Date())
                    }
                });
            const data = await school_admins.findOne({ _id });
            return res.status(200).json(data);
        }
        return res.status(500).json({ error: "Not a valid id" });
    }
    return res.status(500).json({ error: "Old password doesn't match" });
});

module.exports = {
    insert,
    update_email,
    update_password
}