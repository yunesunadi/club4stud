const router = require("../utils/router");
const { getAll, getOne, insert, update, remove } = require("../controllers/academic_years");

router.get("/", getAll);
router.get("/:id", getOne);
router.post("/", insert);
router.patch("/:id", update);
router.delete("/:id", remove);

module.exports = router;