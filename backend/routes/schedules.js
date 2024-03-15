const router = require("../utils/router");
const { getAll, insert, update, remove, getOne } = require("../controllers/schedules");
const { club_admin_auth } = require("../middlewares/auth");

router.get("/api/schedules", club_admin_auth, getAll);
router.get("/api/schedules/:id", club_admin_auth, getOne);
router.put("/api/schedules", club_admin_auth, insert);
router.put("/api/schedules/update/:id", club_admin_auth, update);
router.put("/api/schedules/remove/:id", club_admin_auth, remove);

module.exports = router;