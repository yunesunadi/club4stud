require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const academicYearsRouter = require("./routes/academic_years");
const port = process.env.PORT || 5000;

app.use(cors());

app.use("/api/academic_years", academicYearsRouter);

app.use((req, res) => res.status(404).json({ msg: "Page not found" }));

app.listen(port, () => {
    console.log(`Server is running at port ${port}...`);
})