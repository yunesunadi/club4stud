const router = require("../utils/router");
const { getAll, getOne, insert, update, remove } = require("../controllers/academic_years");

router.get("/api/academic_years", getAll);
router.get("/api/academic_years/:id", getOne);
router.post("/api/academic_years", insert);
router.put("/api/academic_years/:id", update);
router.delete("/api/academic_years/:id", remove);

module.exports = router;