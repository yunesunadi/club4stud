require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { wrapper } = require("../utils/utilities");
const db = require("../utils/utilities").getDB();
const school_admins = db.collection("school_admins");
const clubs = db.collection("clubs");
const students = db.collection("students");

const login = wrapper(async (req, res) => {
    let user;
    const { role, email, password } = req.body;

    if (!role || !email || !password) {
        return res.status(400).json({ error: "Role, email or password required" });
    }

    if (role === "school_admin") {
        user = await school_admins.findOne({ email });
    } else if (role === "club_admin") {
        user = await clubs.findOne({ email });
    } else if (role === "student") {
        user = await students.findOne({ email });
    }

    if (user) {
        if (await bcrypt.compare(password, user.password)) {
            delete user.password;
            const token = jwt.sign(user, process.env.JWT_SECRET);
            return res.status(200).json({ token });
        }
    }

    return res.status(401).json({ error: "Incorrect email or password" });
});

const verify = (req, res) => {
    return res.status(200).json(res.locals.user);
};

module.exports = {
    login,
    verify
}