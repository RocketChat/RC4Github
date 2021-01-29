const { Router } = require("express")
const router = Router()
const loginController = require('../controllers/login')

router.post('/login', loginController.createToken)
router.post('/auth/github/upgrade', loginController.upgradeAccess)

module.exports = router;