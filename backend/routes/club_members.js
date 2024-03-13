const router = require("../utils/router");
const { getRequested } = require("../controllers/club_members");
const { student_auth } = require("../middlewares/auth");

router.get("/api/club_members/clubs/requested", student_auth, getRequested);

module.exports = router;