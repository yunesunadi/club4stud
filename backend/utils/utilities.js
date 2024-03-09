const client = require("./connectDB");

const getDB = () => client.db("club4stud");

const wrapper = (cb) => {
    return async (req, res) => {
        try {
            await cb(req, res);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Something went wrong" });
        }
    }
}

module.exports = { getDB, wrapper };