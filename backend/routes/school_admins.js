const router = require("../utils/router");
const { insert, update_email, update_password } = require("../controllers/school_admins");
const { school_admin_auth } = require("../middlewares/auth");

router.post("/api/school_admins", insert);
router.put("/api/school_admins/change/email", school_admin_auth, update_email);
router.put("/api/school_admins/change/password", school_admin_auth, update_password);

module.exports = router;