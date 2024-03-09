const client = require("./connectDB");

const getDB = () => client.db("club4stud");

const wrapper = (cb) => {
    return async (req, res) => {
        try {
            await cb(req, res);
        } catch (err) {
            console.log(err);
        } finally {
            await client.close();
        }
    }
}

module.exports = { getDB, wrapper };