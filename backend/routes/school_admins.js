const router = require("../utils/router");
const { insert, update } = require("../controllers/school_admins");

router.post("/api/school_admins", insert);
router.put("/api/school_admins/:id", update);

module.exports = router;