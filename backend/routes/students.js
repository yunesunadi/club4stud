const router = require("../utils/router");
const { getAll, getOne, insert, update, remove } = require("../controllers/students");

router.get("/api/students", getAll);
router.get("/api/students/:id", getOne);
router.post("/api/students", insert);
router.put("/api/students/:id", update);
router.delete("/api/students/:id", remove);

module.exports = router;