const router = require("../utils/router");
const { getRequested, getJoined } = require("../controllers/club_members");
const { student_auth } = require("../middlewares/auth");

router.get("/api/club_members/clubs/requested", student_auth, getRequested);
router.get("/api/club_members/clubs/joined", student_auth, getJoined);

module.exports = router;