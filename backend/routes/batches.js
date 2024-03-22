const router = require("../utils/router");
const { getAll, getOne, insert, update, remove } = require("../controllers/batches");
const { school_admin_auth, school_club_admin_auth } = require("../middlewares/auth");

router.get("/api/batches", school_club_admin_auth, getAll);
router.get("/api/batches/:id", school_admin_auth, getOne);
router.post("/api/batches", school_admin_auth, insert);
router.put("/api/batches/:id", school_admin_auth, update);
router.delete("/api/batches/:id", school_admin_auth, remove);

module.exports = router;