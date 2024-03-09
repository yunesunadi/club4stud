const router = require("../utils/router");
const { getAll, getOne, getMembers, update, remove } = require("../controllers/clubs");

router.get("/api/clubs", getAll);
router.get("/api/clubs/:id", getOne);
router.get("/api/clubs/members/:id", getMembers);
router.put("/api/clubs/:id", update);
router.delete("/api/clubs/:id", remove);

module.exports = router;