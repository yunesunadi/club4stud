const router = require("../utils/router");
const { getAll, getOne, insert, update, remove } = require("../controllers/academic_years");
const { school_admin_auth } = require("../middlewares/auth");

router.get("/api/academic_years", school_admin_auth, getAll);
router.get("/api/academic_years/:id", school_admin_auth, getOne);
router.post("/api/academic_years", school_admin_auth, insert);
router.put("/api/academic_years/:id", school_admin_auth, update);
router.delete("/api/academic_years/:id", school_admin_auth, remove);

module.exports = router;