require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");

/***
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next  
 */

const school_admin_auth = (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization?.split(" ")[1];
    if (!token) {
        return res.status(400).json({ error: "Token required" });
    }

    const user = jwt.decode(token, process.env.JWT_SECRET);
    if (!user) {
        return res.status(401).json({ error: "Incorrect token" });
    }

    if (user.role === "school_admin") {
        res.locals.user = user;
        next();
    } else {
        return res.status(401).json({ error: "Unauthorized" });
    }
}

const club_admin_auth = (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization?.split(" ")[1];
    if (!token) {
        return res.status(400).json({ error: "Token required" });
    }

    const user = jwt.decode(token, process.env.JWT_SECRET);
    if (!user) {
        return res.status(401).json({ error: "Incorrect token" });
    }

    if (user.role === "club_admin") {
        res.locals.user = user;
        next();
    } else {
        return res.status(401).json({ error: "Unauthorized" });
    }
}

const school_club_admin_auth = (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization?.split(" ")[1];
    if (!token) {
        return res.status(400).json({ error: "Token required" });
    }

    const user = jwt.decode(token, process.env.JWT_SECRET);
    if (!user) {
        return res.status(401).json({ error: "Incorrect token" });
    }

    if (user.role === "school_admin" || user.role === "club_admin") {
        res.locals.user = user;
        next();
    } else {
        return res.status(401).json({ error: "Unauthorized" });
    }
}

const student_auth = (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization?.split(" ")[1];
    if (!token) {
        return res.status(400).json({ error: "Token required" });
    }

    const user = jwt.decode(token, process.env.JWT_SECRET);
    if (!user) {
        return res.status(401).json({ error: "Incorrect token" });
    }

    if (user.role === "student") {
        res.locals.user = user;
        next();
    } else {
        return res.status(401).json({ error: "Unauthorized" });
    }
}

const club_admin_student_auth = (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization?.split(" ")[1];
    if (!token) {
        return res.status(400).json({ error: "Token required" });
    }

    const user = jwt.decode(token, process.env.JWT_SECRET);
    if (!user) {
        return res.status(401).json({ error: "Incorrect token" });
    }

    if (user.role === "student" || user.role === "club_admin") {
        res.locals.user = user;
        next();
    } else {
        return res.status(401).json({ error: "Unauthorized" });
    }
}

const auth = (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization?.split(" ")[1];
    if (!token) {
        return res.status(400).json({ error: "Token required" });
    }

    const user = jwt.decode(token, process.env.JWT_SECRET);
    if (!user) {
        return res.status(401).json({ error: "Incorrect token" });
    }

    res.locals.user = user;
    next();
}

module.exports = {
    school_admin_auth,
    club_admin_auth,
    school_club_admin_auth,
    student_auth,
    club_admin_student_auth,
    auth
};