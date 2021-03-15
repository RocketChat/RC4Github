const { Router } = require("express");
const router = Router();
const loginController = require("../controllers/login");
const roomsController = require("../controllers/rooms");
const verifyWebhooks = require("../middlewares/verifyWebhooks");
const webhooksController = require("../controllers/webhooks");
const passport = require("passport");
const statsController = require("../controllers/stats");

router.post("/login", loginController.createToken);
router.post("/sso", loginController.sso);
router.get("/logout", loginController.logout);
router.post("/createChannel", roomsController.createRoom);
router.post(
  "/webhooks/github/events",
  verifyWebhooks.verifyGithubWebhook,
  webhooksController.handleGithubWebhook
)
router.get('/activities/github', webhooksController.fetchGithubActivities)
router.get(
  "/webhooks",
  webhooksController.fetchWebhook
);
router.post(
  "/webhooks/github",
  passport.authenticate("jwt", { session: false }),
  webhooksController.createGithubWebhook
);
router.patch(
  "/webhooks/github",
  passport.authenticate("jwt", { session: false }),
  webhooksController.updateGithubWebhook
);
router.delete(
  "/webhooks/github",
  passport.authenticate("jwt", { session: false }),
  webhooksController.deleteGithubWebhook
);

router.get("/stats", statsController.fetchStats);
router.get("/roomMembers", roomsController.fetchRoomMembers);

module.exports = router;
