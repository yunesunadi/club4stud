const router = require("../utils/router");
const { getAll, insert, update, remove, getOne, getJoined, getAttendance, present, absent } = require("../controllers/schedules");
const { club_admin_auth, student_auth, club_admin_student_auth } = require("../middlewares/auth");

router.get("/api/schedules", club_admin_student_auth, getAll);
router.get("/api/schedules/joined", student_auth, getJoined);
router.get("/api/schedules/:id", club_admin_auth, getOne);
router.put("/api/schedules", club_admin_auth, insert);
router.put("/api/schedules/update/:id", club_admin_auth, update);
router.put("/api/schedules/remove/:id", club_admin_auth, remove);
router.get("/api/schedules/attendance/:id", club_admin_auth, getAttendance);
router.put("/api/schedules/attendance/:scid/present/:stid", club_admin_auth, present);
router.put("/api/schedules/attendance/:scid/absent/:stid", club_admin_auth, absent);

module.exports = router;