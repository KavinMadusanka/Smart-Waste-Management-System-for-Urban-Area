import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/AuthMiddleware.js'
import { getAllWasteCollectors, LoginController, userRegisterController, wasteCollectorRegisterController } from '../controllers/AuthController.js'

//router object
const router = express.Router()

//routing path
router.get('/get-all-collectors',getAllWasteCollectors )
router.post('/registerUser',userRegisterController)
router.post('/registerCollector',wasteCollectorRegisterController)
router.post('/login',LoginController)

export default router