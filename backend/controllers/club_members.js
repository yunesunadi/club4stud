const { ObjectId } = require("mongodb");
const { wrapper } = require("../utils/utilities");
const db = require("../utils/utilities").getDB();
const clubs = db.collection("clubs");

const getRequested = wrapper(async (req, res) => {
    const { _id } = res.locals.user;
    const student_id = new ObjectId(_id);
    const data = await clubs.aggregate([
        { $unwind: "$members" },
        { $match: { "members.student": student_id, "members.request": true } }
    ]).toArray();
    return res.status(200).json({ data });
});

module.exports = {
    getRequested
}