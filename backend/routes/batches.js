const router = require("../utils/router");
const { getAll, getOne, insert, update, remove } = require("../controllers/batches");

router.get("/api/batches/", getAll);
router.get("/api/batches/:id", getOne);
router.post("/api/batches/", insert);
router.put("/api/batches/:id", update);
router.delete("/api/batches/:id", remove);

module.exports = router;