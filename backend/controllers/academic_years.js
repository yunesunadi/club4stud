const { ObjectId } = require("mongodb");
const { formatISO } = require("date-fns");
const { wrapper } = require("../utils/utilities");

const db = require("../utils/utilities").getDB();
const academic_years = db.collection("academic_years");

const getAll = wrapper(async (req, res) => {
    const data = await academic_years.find().toArray();
    return res.status(200).json({ data });
});

const getOne = wrapper(async (req, res) => {
    const { id } = req.params;

    if (ObjectId.isValid(id)) {
        const _id = new ObjectId(id);
        const data = await academic_years.findOne({ _id });

        if (!data) {
            return res.status(404).json({ error: "Data not found" });
        }

        return res.status(200).json({ data });
    }
    return res.status(500).json({ error: "Not a valid id" });
});

const insert = wrapper(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Name required" });
    }

    const result = await academic_years.insertOne({ name, created_at: formatISO(new Date()), updated_at: formatISO(new Date()) });
    const data = await academic_years.findOne({ _id: new ObjectId(result.insertedId) });

    return res.status(200).json({ data });
});

const update = wrapper(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Name required" });
    }

    if (ObjectId.isValid(id)) {
        const _id = new ObjectId(id);
        await academic_years.updateOne(
            { _id },
            {
                $set: {
                    name,
                    updated_at: formatISO(new Date())
                }
            });
        const data = await academic_years.findOne({ _id });
        return res.status(200).json(data);
    }
    return res.status(500).json({ error: "Not a valid id" });
})

const remove = wrapper(async (req, res) => {
    const { id } = req.params;

    if (ObjectId.isValid(id)) {
        const _id = new ObjectId(id);
        await academic_years.deleteOne({ _id });
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