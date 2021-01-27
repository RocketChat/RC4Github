const { Router } = require("express")
const router = Router()
const loginController = require('../controllers/login')

router.post('/login', loginController.createToken)

module.exports = router;