const router = require("../utils/router");
const { getAll, getApproved, getDeclined, insert } = require("../controllers/club_proposals");
const { school_admin_auth, student_auth } = require("../middlewares/auth");

router.get("/api/club_proposals", school_admin_auth, getAll);
router.get("/api/club_proposals/approved", school_admin_auth, getApproved);
router.get("/api/club_proposals/declined", school_admin_auth, getDeclined);
router.post("/api/club_proposals", student_auth, insert);

module.exports = router;