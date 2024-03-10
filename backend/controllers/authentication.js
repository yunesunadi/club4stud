require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../utils/utilities").getDB();
const school_admins = db.collection("school_admins");

const findUser = async (user, password, res) => {
    if (user) {
        if (await bcrypt.compare(password, user.password)) {
            delete user.password;
            const token = jwt.sign(user, process.env.JWT_SECRET);
            return res.status(200).json({ token });
        }
    }
}

const login = async (req, res) => {
    const { role, email, password } = req.body;

    if (!role || !email || !password) {
        return res.status(400).json({ error: "Role, email or password required" });
    }

    if (role === "school_admin") {
        const user = await school_admins.findOne({ email });
        await findUser(user, password, res);
    }

    // else if (role === "student") {

    // }

    // const user = await school_admins.findOne({ email });

    // if (user) {
    //     if (await bcrypt.compare(password, user.password)) {
    //         delete user.password;
    //         const token = jwt.sign(user, process.env.JWT_SECRET);
    //         return res.status(200).json({ token });
    //     }
    // }

    return res.status(401).json({ error: "Incorrect email or password" });
}

const verify = async (req, res) => {
    return res.json(res.locals.user);
}

module.exports = {
    login,
    verify
}