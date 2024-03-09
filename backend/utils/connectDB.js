require("dotenv").config();

const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URI);

const connect = async () => {
    try {
        await client.connect();
        console.log("Connected database successfully...");
    } catch (err) {
        console.log(err);
    }
}

connect();

module.exports = client;