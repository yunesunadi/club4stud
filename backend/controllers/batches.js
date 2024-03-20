const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const { formatISO } = require("date-fns");
const { wrapper } = require("../utils/utilities");

const db = require("../utils/utilities").getDB();
const batches = db.collection("batches");

const getAll = wrapper(async (req, res) => {
    const data = await batches.find().toArray();
    return res.status(200).json({ data });
});

const getOne = wrapper(async (req, res) => {
    const { id } = req.params;

    if (ObjectId.isValid(id)) {
        const _id = new ObjectId(id);
        const data = await batches.findOne({ _id });

        if (!data) {
            return res.status(404).json({ error: "Batch not found" });
        }

        return res.status(200).json({ data });
    }
    return res.status(500).json({ error: "Not a valid id" });
});

const insert = wrapper(async (req, res) => {
    const { name, founded_date, default_password, academic_year } = req.body;

    if (!name || !founded_date || !default_password || !academic_year) {
        return res.status(400).json({ error: "Please fill in all fields" });
    }

    const hash = await bcrypt.hash(default_password, 10);
    const result = await batches.insertOne({
        name,
        founded_date,
        default_password: hash,
        academic_year,
        created_at: formatISO(new Date()),
        updated_at: formatISO(new Date())
    });
    const data = await batches.findOne({ _id: new ObjectId(result.insertedId) });

    return res.status(200).json({ data });
});

const update = wrapper(async (req, res) => {
    const { id } = req.params;
    const { name, founded_date, default_password, academic_year } = req.body;

    if (!name || !founded_date || !default_password || !academic_year) {
        return res.status(400).json({ error: "Please fill in all fields" });
    }

    if (ObjectId.isValid(id)) {
        const _id = new ObjectId(id);
        const hash = await bcrypt.hash(default_password, 10);
        await batches.updateOne(
            { _id },
            {
                $set: {
                    name,
                    founded_date,
                    default_password,
                    academic_year,
                    updated_at: formatISO(new Date())
                }
            });
        const data = await batches.findOne({ _id });
        return res.status(200).json(data);
    }
    return res.status(500).json({ error: "Not a valid id" });
})

const remove = wrapper(async (req, res) => {
    const { id } = req.params;

    if (ObjectId.isValid(id)) {
        const _id = new ObjectId(id);
        await batches.deleteOne({ _id });
        return res.status(204).json({});
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