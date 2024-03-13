const router = require("../utils/router");
const { getAll, getOne, getMembers, update, remove, join, cancel } = require("../controllers/clubs");
const { auth, club_admin_auth, student_auth } = require("../middlewares/auth");

router.get("/api/clubs", auth, getAll);
router.get("/api/clubs/:id", auth, getOne);
router.get("/api/clubs/members/:id", auth, getMembers);
router.put("/api/clubs/:id", club_admin_auth, update);
router.delete("/api/clubs/:id", club_admin_auth, remove);
router.put("/api/clubs/members/:cid/join/:sid", student_auth, join);
router.put("/api/clubs/members/:cid/cancel/:sid", student_auth, cancel);

module.exports = router;