import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/AuthMiddleware.js'
import { getAllWasteCollectors, loginController, registerController } from '../controllers/AuthController.js'

//router object
const router = express.Router()

//routing path
//Register || post method
router.post('/register',registerController )

//login
router.post('/login',loginController)

//get all waste collectors
router.get('/get-all-collectors',getAllWasteCollectors)

export default router