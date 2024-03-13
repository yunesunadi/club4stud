const router = require("../utils/router");
const { getAll, getApproved, getDeclined, insert, approve, decline } = require("../controllers/club_proposals");
const { school_admin_auth, student_auth } = require("../middlewares/auth");

router.get("/api/club_proposals", school_admin_auth, getAll);
router.get("/api/club_proposals/approved", school_admin_auth, getApproved);
router.put("/api/club_proposals/approve/:id", school_admin_auth, approve);
router.get("/api/club_proposals/declined", school_admin_auth, getDeclined);
router.put("/api/club_proposals/decline/:id", school_admin_auth, decline);
router.post("/api/club_proposals", student_auth, insert);

module.exports = router;