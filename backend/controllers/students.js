const { ObjectId } = require("mongodb");
const { formatISO } = require("date-fns");
const bcrypt = require("bcrypt");
const { wrapper } = require("../utils/utilities");
const db = require("../utils/utilities").getDB();
const students = db.collection("students");

const getAll = wrapper(async (req, res) => {
    const data = await students.find().toArray();
    return res.status(200).json({ data });
});

const getBatchAll = wrapper(async (req, res) => {
    const { id } = req.params;
    if (ObjectId.isValid(id)) {
        const _id = new ObjectId(id);
        const data = await students.find({ batch: _id }).toArray();
        return res.status(200).json({ data });
    }
    return res.status(500).json({ error: "Not a valid id" });
});

const getOne = wrapper(async (req, res) => {
    const { id } = req.params;

    if (ObjectId.isValid(id)) {
        const _id = new ObjectId(id);
        const data = await students.findOne({ _id });

        if (!data) {
            return res.status(404).json({ error: "Student not found" });
        }

        return res.status(200).json({ data });
    }
    return res.status(500).json({ error: "Not a valid id" });
});

const insert = wrapper(async (req, res) => {
    const { student_id, name, email, phone_number, gender, date_of_birth, password, batch } = req.body;

    if (!student_id || !name || !email || !phone_number || !gender || !date_of_birth || !password || !batch) {
        return res.status(400).json({ error: "Please fill in all fields" });
    }

    const hash = await bcrypt.hash(password, 10);
    const batchId = new ObjectId(batch);
    const result = await students.insertOne({
        student_id, name, email, phone_number, gender, date_of_birth, password: hash, batch: batchId, role: "student",
        created_at: formatISO(new Date()),
        updated_at: formatISO(new Date())
    });
    const data = await students.findOne({ _id: new ObjectId(result.insertedId) });

    return res.status(200).json({ data });
});

const update = wrapper(async (req, res) => {
    const { id } = req.params;
    const { student_id, name, email, phone_number, gender, date_of_birth, password, batch } = req.body;

    if (!student_id || !name || !email || !phone_number || !gender || !date_of_birth || !password || !batch) {
        return res.status(400).json({ error: "Please fill in all fields" });
    }

    if (ObjectId.isValid(id)) {
        const _id = new ObjectId(id);
        const hash = await bcrypt.hash(password, 10);
        const batchId = new ObjectId(batch);
        await students.updateOne(
            { _id },
            {
                $set: {
                    student_id, name, email, phone_number, gender, date_of_birth, password: hash, batch: batchId,
                    updated_at: formatISO(new Date())
                }
            });
        const data = await students.findOne({ _id });
        return res.status(200).json(data);
    }
    return res.status(500).json({ error: "Not a valid id" });
})

const remove = wrapper(async (req, res) => {
    const { id } = req.params;

    if (ObjectId.isValid(id)) {
        const _id = new ObjectId(id);
        await students.deleteOne({ _id });
        return res.status(204).json({});
    }
    return res.status(500).json({ error: "Not a valid id" });
});

module.exports = {
    getAll,
    getBatchAll,
    getOne,
    insert,
    update,
    remove
}