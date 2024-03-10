const router = require("../utils/router");
const { insert, update } = require("../controllers/school_admins");
const { school_admin_auth } = require("../middlewares/auth");

router.post("/api/school_admins", insert);
router.put("/api/school_admins/:id", school_admin_auth, update);

module.exports = router;