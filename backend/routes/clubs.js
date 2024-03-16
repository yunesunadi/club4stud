const router = require("../utils/router");
const { getAll, getOne, update, remove, join, cancel, getMembers, approve, update_password, getAuthClub } = require("../controllers/clubs");
const { auth, club_admin_auth, student_auth } = require("../middlewares/auth");

router.get("/api/clubs", auth, getAll);
router.get("/api/clubs/auth", club_admin_auth, getAuthClub);
router.get("/api/clubs/members", club_admin_auth, getMembers);
router.put("/api/clubs/members/approve/:id", club_admin_auth, approve);
router.put("/api/clubs/members/:cid/join/:sid", student_auth, join);
router.put("/api/clubs/members/:cid/cancel/:sid", student_auth, cancel);
router.get("/api/clubs/:id", auth, getOne);
router.put("/api/clubs/update", club_admin_auth, update);
router.put("/api/clubs/update/password", club_admin_auth, update_password);
router.delete("/api/clubs/:id", club_admin_auth, remove);

module.exports = router;