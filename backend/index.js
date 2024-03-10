require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const authenticationRouter = require("./routes/authentication");
const academicYearsRouter = require("./routes/academic_years");
const batchesRouter = require("./routes/batches");
const studentsRouter = require("./routes/students");
const clubProposalsRouter = require("./routes/club_proposals");
const clubsRouter = require("./routes/clubs");
const schoolAdminsRouter = require("./routes/school_admins");

const port = process.env.PORT || 5000;

app.use(cors());

app.use(authenticationRouter);
app.use(academicYearsRouter);
app.use(batchesRouter);
app.use(studentsRouter);
app.use(clubProposalsRouter);
app.use(clubsRouter);
app.use(schoolAdminsRouter);

app.use((req, res) => res.status(404).json({ msg: "Page not found" }));

app.listen(port, () => {
    console.log(`Server is running at port ${port}...`);
})