const router = require("../utils/router");
const { getAll } = require("../controllers/academic_years");

router.get("/", getAll);

module.exports = router;