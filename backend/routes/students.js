const router = require("../utils/router");
const { getAll, getOne, insert, update, remove, getBatchAll, update_password } = require("../controllers/students");
const { school_admin_auth, student_auth } = require("../middlewares/auth");

router.get("/api/students", school_admin_auth, getAll);
router.get("/api/batches/students/:id", school_admin_auth, getBatchAll);
router.get("/api/students/:id", school_admin_auth, getOne);
router.post("/api/students", school_admin_auth, insert);
router.put("/api/students/update/password", student_auth, update_password);
router.put("/api/students/:id", school_admin_auth, update);
router.delete("/api/students/:id", school_admin_auth, remove);

module.exports = router;