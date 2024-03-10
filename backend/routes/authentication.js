const router = require("../utils/router");
const { login, verify } = require("../controllers/authentication");
const { auth } = require("../middlewares/auth");

router.post("/api/login", login);
router.post("/api/verify", auth, verify);

module.exports = router;