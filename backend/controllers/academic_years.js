const express = require("express");
const { wrapper } = require("../utils/utilities");

const db = require("../utils/utilities").getDB();
const academic_years = db.collection("academic_years");


/***
 * @param {express.Request} req
 * @param {express.Response} res
 */

const getAll = wrapper(async (req, res) => {
    const data = await academic_years.find().toArray();

    return res.status(200).json({ data });
});

module.exports = {
    getAll
}