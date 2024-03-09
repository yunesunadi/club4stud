const router = require("../utils/router");
const { getAll, getApproved, getDeclined, insert } = require("../controllers/club_proposals");

router.get("/api/club_proposals", getAll);
router.get("/api/club_proposals/approved", getApproved);
router.get("/api/club_proposals/declined", getDeclined);
router.post("/api/club_proposals", insert);

module.exports = router;