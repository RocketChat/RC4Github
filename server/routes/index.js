const { Router } = require("express")
const router = Router()
const loginController = require('../controllers/login')
const createChannelController = require('../controllers/createChannel')
const verifyWebhooks = require('../middlewares/verifyWebhooks');
const webhooksController = require('../controllers/webhooks');
const passport = require("passport");

router.post('/login', loginController.createToken)
router.post('/auth/github/upgrade', loginController.upgradeAccess)
router.post('/sso', loginController.sso)
router.get("/logout", loginController.logout);
router.post('/createChannel', createChannelController)
router.post(
  "/webhooks/github",
  verifyWebhooks.verifyGithubWebhook,
  webhooksController.handleGithubWebhook
)
router.get('/activities/github', passport.authenticate('jwt', {session: false}), webhooksController.fetchGithubActivities)

module.exports = router;